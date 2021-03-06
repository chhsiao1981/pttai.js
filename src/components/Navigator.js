import React, { PureComponent }     from 'react'
import { FormattedMessage }         from 'react-intl'
import { Link }                     from 'react-router-dom'

import styles   from './Navigator.css'

class Navigator extends PureComponent {
  render() {
    let tabOneClass = ''
    let tabTwoClass = ''
    if (this.props.match.url.indexOf('/hub') === 0 ||
        this.props.match.url.indexOf('/board') === 0 ) {
      tabOneClass = 'active'
    } else {
      tabTwoClass = 'active'
    }
    return (
      <div className={styles['root']}>
        <div className={styles['content']}>

          <ul className={styles['tabs']}>
            <li className={styles[tabOneClass]}>
              <Link to={`/hub`} className={styles['content-block']}>
                <div>
                  <FormattedMessage
                    id="navigator.tab1"
                    defaultMessage="Latest"
                  />
                </div>
              </Link>
            </li>
            <li className={styles[tabTwoClass]}>
              <Link to={`/friend`} className={styles['content-block']}>
                <div>
                  <FormattedMessage
                    id="navigator.tab2"
                    defaultMessage="Friends"
                  />
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

export default Navigator
