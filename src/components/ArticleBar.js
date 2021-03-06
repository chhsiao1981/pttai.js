import React,
       { PureComponent }    from 'react'
import { Link }             from 'react-router-dom'
import { FontAwesomeIcon }  from '@fortawesome/react-fontawesome'
import $                    from 'jquery'

import { epoch2FullDate,
         epoch2ReadFormat } from '../utils/utilDatetime'

import styles               from './ArticleBar.css'

class ArticleBar extends PureComponent {
  render() {
    const { boardInfo, articleInfo } = this.props

    return (
      <div className={styles['root']}>
        <div className={styles['content']}>
            <div className={styles['prev-button']}>
              <Link to={`/board/${boardInfo.ID}`}>
                <div className={styles['prev-tag']}>
                  {boardInfo.Title}
                </div>
              </Link>
              <div className={styles['caret']}>
                <FontAwesomeIcon icon="caret-right" />
              </div>
            </div>
            <div title={articleInfo.Title} className={styles['board-name']}>
              {articleInfo.Title}
            </div>
            {
              $.isEmptyObject(articleInfo) ? (
                <div className={styles['search']}></div>
              ):(
                <div title={epoch2FullDate(articleInfo.CreateTS.T)} className={styles['search']}>
                  {epoch2ReadFormat(articleInfo.CreateTS.T)}
                </div>
              )
            }
        </div>
      </div>
    )
  }
}

export default ArticleBar
