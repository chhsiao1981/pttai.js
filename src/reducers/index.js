import {  createStore,
          applyMiddleware,
          combineReducers,
          compose          } from 'redux'

import middleware   from '../middleware/'
import DevTools     from '../DevTools'

import app                from './App'
import rootPage           from './RootPage'
import hubPage            from './HubPage'
import boardPage          from './BoardPage'
import articlePage        from './ArticlePage'
import profilePage        from './ProfilePage'
import friendListPage     from './FriendListPage'
import friendChatPage     from './FriendChatPage'
import modal              from './ModalContainer'
import createBoardModal   from './CreateBoardModal'
import manageBoardModal   from './ManageBoardModal'
import showOpLogModal     from './ShowOpLogModal'

const reducers = combineReducers({
  app,
  modal,
  createBoardModal,
  manageBoardModal,
  showOpLogModal,
  rootPage,
  hubPage,
  boardPage,
  articlePage,
  profilePage,
  friendListPage,
  friendChatPage,
})

const enhancer = compose(
  applyMiddleware(...middleware),
  DevTools.instrument(),
)

const configure = (initialState) => {
  const store = createStore(reducers, initialState, enhancer)

  if (module.hot) {
    module.hot.accept('./', () => {
      const nextReducer = require('./').default

      store.replaceReducer(nextReducer)
    })
  }

  return store
}

export default configure
