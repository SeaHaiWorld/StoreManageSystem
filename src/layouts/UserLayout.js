import React, { Fragment } from 'react';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import { Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import styles from './UserLayout.less';
import Config from '../../config/api';

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 5120172748_物联1702_杨海啸 &nbsp;&nbsp;&nbsp;{Config.VERSIONS}
  </Fragment>
);

class UserLayout extends React.PureComponent {
  // @TODO title

  render() {
    const { children } = this.props;
    return (
      // @TODO <DocumentTitle title={this.getPageTitle()}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <span className={styles.title}>库房管理系统</span>
              </Link>
            </div>
            <div className={styles.desc}></div>
          </div>
          {children}
        </div>
        <GlobalFooter copyright={copyright} />
      </div>
    );
  }
}

export default UserLayout;
