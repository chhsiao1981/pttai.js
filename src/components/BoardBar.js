import React, { PureComponent }   from 'react'
import { FormattedMessage }       from 'react-intl'
import { Link }                   from 'react-router-dom'

import styles from './BoardBar.css'

class BoardBar extends PureComponent {
  render() {
    const { boardInfo, userId, manageBoardAction } = this.props
    return (
      <div className={styles['root']}>
        <div className={styles['content']}>
            <div className={styles['prev-button']}>
                <Link to={`/hub`}>
                    <div className={styles['prev-button-icon']}></div>
                    <div className={styles['prev-button-text']}>
                      <FormattedMessage
                        id="boardbar.prev-button"
                        defaultMessage="Boards"
                      />
                    </div>
                </Link>
            </div>
            <div title={boardInfo.Title} className={styles['board-name']}>
              {boardInfo.Title}
            </div>
            <div className={styles['search']}>
              {
                boardInfo.CreatorID !== userId? (
                  null
                ):(
                  <div className={styles['list-item-ellipsis']} onClick={() => manageBoardAction(boardInfo.ID)}></div>
                )
              }
            </div>
        </div>
      </div>
    )
  }
}

export default BoardBar
