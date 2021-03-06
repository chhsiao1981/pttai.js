import Immutable        from 'immutable'
import { createDuck }   from 'redux-duck'

import * as utils       from './utils'
import * as serverUtils from './ServerUtils'

import { EMPTY_ID,
         DEFAULT_USER_IMAGE,
         DEFAULT_USER_NAME,
         NUM_MEMBER_PER_REQ }     from '../constants/Constants'

export const myClass  = 'MANAGE_BOARD_MODAL'

export const myDuck   = createDuck(myClass, 'Manage_Board_Modal')

const INIT            = myDuck.defineType('INIT')
const ADD_CHILD       = myDuck.defineType('ADD_CHILD')
const SET_ROOT        = myDuck.defineType('SET_ROOT')
const REMOVE_CHILDS   = myDuck.defineType('REMOVE_CHILDS')
const REMOVE          = myDuck.defineType('REMOVE')
const SET_DATA        = myDuck.defineType('SET_DATA')

// init
export const init = (myId, parentId, parentClass, parentDuck) => {
  return (dispatch, getState) => {
    dispatch(utils.init({myId, myClass, myDuck, parentId, parentClass, parentDuck}))
  }
}

/*                          */
/*  Get Board level Info    */
/*                          */

export const getBoardInfo = (myId, boardId) => {
  return (dispatch, getState) => {
    dispatch(serverUtils.getBoard(boardId))
      .then(({response: {result}, type, query, error}) => {
        dispatch(postprocessGetBoardInfo(myId, result))
      })
  }
}

const postprocessGetBoardInfo = (myId, result) => {

  result = serverUtils.deserialize(result)

  const boardInfo = {
      ArticleCreateTS:  result.ArticleCreateTS ? result.ArticleCreateTS : utils.emptyTimeStamp(),
      ID:               result.ID,
      LastSeen:         result.LastSeen ? result.LastSeen : utils.emptyTimeStamp(),
      Status:           result.Status,
      Title:            result.Title,
      UpdateTS:         result.UpdateTS ? result.UpdateTS : utils.emptyTimeStamp(),
  }

  console.log('doBoardPage.postprocessGetBoardInfo: boardInfo:', boardInfo)

  return {
    myId,
    myClass,
    type: SET_DATA,
    data: { boardInfo: boardInfo }
  }
}

export const getBoardJoinKey = (myId, boardId) => {
  return (dispatch, getState) => {
    dispatch(serverUtils.getBoardUrl(boardId))
      .then(({response: {result}, type, query, error}) => {
        dispatch(postprocessGetBoardJoinKey(myId, result))
      })
  }
}

const postprocessGetBoardJoinKey = (myId, result) => {

  const boardJoinKey = {
    C:            result.C,
    ID:           result.ID,
    Pn:           result.Pn,
    T:            result.T,
    URL:          result.URL,
    UpdateTS:     result.UT ? result.UT : utils.emptyTimeStamp(),
    expirePeriod: result.e,
  }

  console.log('doBoardPage.postprocessGetBoardJoinKey: boardJoinKey:', boardJoinKey)

  return {
    myId,
    myClass,
    type: SET_DATA,
    data: { boardJoinKey: boardJoinKey }
  }
}

/*                     */
/*  Get Friend Info    */
/*                     */

export const getFriendList = (myId, boardId, limit) => {
  return (dispatch, getState) => {
    dispatch(serverUtils.getFriends(EMPTY_ID, limit))
      .then(({response: friendResult, type, query, error}) => {
        /* Get member list to match friends in this board */
        dispatch(serverUtils.getMemberList(boardId, EMPTY_ID, NUM_MEMBER_PER_REQ))
          .then(({response: memberResult, type, query, error}) => {
            let friendIds   = friendResult.result.map((each) => each.FID)
            let memeberIds  = memberResult.result.map((each) => each.ID)
            dispatch(serverUtils.getUsersInfo([...friendIds, ...memeberIds]))
              .then((usersInfo) => {
                dispatch(postprocessgetFriends(myId, friendResult.result, memberResult.result, usersInfo))
              })
          })
      })
  }
}

const postprocessgetFriends = (myId, friendListResult, memeberListResult, usersInfo) => {

  friendListResult = friendListResult.map((each) => {
    return {
      friendID: each.FID,
      ...each
    }
  })

  friendListResult = friendListResult.map(serverUtils.deserialize)

  let memberMap = memeberListResult.reduce((acc, each) => {
    acc[each.ID] = each
    return acc
  }, {})

  usersInfo = usersInfo.reduce((acc, each) => {
    acc[each.key] = each.value
    return acc
  }, {})

  const friendList = friendListResult.map(each => {

    let userId      = each.friendID
    let userNameMap = usersInfo['userName'] || {}
    let userImgMap  = usersInfo['userImg'] || {}

    let userName  = userNameMap[userId] ? serverUtils.b64decode(userNameMap[userId].N) : DEFAULT_USER_NAME
    let userImg   = userImgMap[userId] ? userImgMap[userId].I : DEFAULT_USER_IMAGE

    return {
      Name:             userName,
      Img:              userImg,
      friendID:         each.friendID,
      chatID:           each.ID,
      BoardID:          each.BID,
      FriendStatus:     each.S,
      LastSeen:         each.LT ? each.LT : utils.emptyTimeStamp(),
      isBoardMember:    (userId in memberMap),
      memberStatus:     (userId in memberMap) ? memberMap[userId].S : null,
      memberUpdateTS:   (userId in memberMap) ? memberMap[userId].UT : utils.emptyTimeStamp(),
      /* ArticleCreateTS:  each.ArticleCreateTS ? each.ArticleCreateTS : utils.emptyTimeStamp(), */
    }
  })

  console.log('doManageBoardModal.postprocessgetFriends: friendList:', friendList)

  return {
    myId,
    myClass,
    type: SET_DATA,
    data: { friendList: friendList }
  }
}

/*                             */
/*  Invite Friend to Board     */
/*                             */

export const sendFriendInvite = (myId, chatId, inviteMessage) => {
  return (dispatch, getState) => {
    dispatch(serverUtils.postMessage(chatId, [inviteMessage], []))
      .then(({response: {result}, type, error, query}) => {
        dispatch(postprocessPostMessage(myId, result))
      })
  }
}

const postprocessPostMessage = (myId, result) => {
  /* Do nothing */
  return {
    myId,
    myClass,
    type: SET_DATA,
    data: {}
  }
}


// reducers
const reducer = myDuck.createReducer({
  [INIT]:           utils.reduceInit,
  [ADD_CHILD]:      utils.reduceAddChild,
  [SET_ROOT]:       utils.reduceSetRoot,
  [REMOVE_CHILDS]:  utils.reduceRemoveChilds,
  [REMOVE]:         utils.reduceRemove,
  [SET_DATA]:       utils.reduceSetData,
}, Immutable.Map())

export default reducer
