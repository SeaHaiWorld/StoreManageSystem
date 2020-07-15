import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import {SYSTEM_PROPERTY} from '../utils/Enum';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
        {
          key: '西南科技大学',
          title: 'SWUST',
          href: 'http://www.swust.edu.cn',
          blankTarget: true,
        },
      ]}
      copyright={
        <Fragment>
          Copyright <Icon type='copyright' />{SYSTEM_PROPERTY.CORYRIGHT}
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
