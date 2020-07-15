import React, { PureComponent } from 'react';
import { Card, Form, Button, Row, Col, Descriptions } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FooterToolbar from '@/components/FooterToolbar';
import { reloadAuthorized } from "@/utils/Authorized";
import router from 'umi/router';
import style from './StoreDetail.less';
import { MENU_STATUS, Status } from '../../utils/Enum';

@Form.create()
@connect(({ StoreDetailModel, loading, menu, tabsPanes, user }) => ({
  StoreDetailModel,
  loading, menu, tabsPanes, user,
  DataFetch: loading.effects['StoreDetailModel/fetch'],
  LogFetch: loading.effects['StoreDetailModel/getLogList'],
}))

class StoreDetail extends PureComponent {
  constructor() {
    super();
    this.state = {};
  }

  async componentDidMount() {
    this.changeMenu().then(async () => {
      const storeId = sessionStorage.getItem('store_id');
      const { dispatch } = this.props;
      await dispatch({
        type: 'StoreDetailModel/save',
        payload: { storeId },
      });
      await this.getStoreDetail(storeId);
      // await this.listPage();
    });
  };

  changeMenu = async () => {
    const { menu: { menuAll } } = this.props;
    this.closeOther();
    localStorage.setItem('antd-pro-authority', MENU_STATUS.STORE_DETAIL);
    await reloadAuthorized();
    const { dispatch, menu: { menuAll: { routes, authority } } } = this.props;
    await dispatch({
      type: 'menu/getMenuData',
      payload: { routes, authority, route: menuAll },
    });
  };

  closeOther = () => {
    const { tabsPanes: { activeKey } } = this.props;
    const { tabsPanes: { panes }, dispatch } = this.props;
    const authority = localStorage.getItem('antd-pro-authority');
    if (authority != MENU_STATUS.STORE_DETAIL) {
      const newPanes = panes.filter((current) => activeKey === current.key);
      dispatch({
        type: 'tabsPanes/save',
        payload: { panes: newPanes },
      });
    }
  };

  getStoreDetail = (storeId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'StoreDetailModel/getStoreDetail',
      payload: { id: storeId },
    });
  };

  listPage = (params) => {
    const { dispatch, StoreDetailModel: { storeId } } = this.props;
    dispatch({
      type: 'StoreDetailModel/getLogList',
      payload: { ...params, storeId },
    });
  };

  // 关闭当前页
  handelCancel = () => {
    const { dispatch, menu: { menuAll: { routes, authority }, menuAll } } = this.props;
    localStorage.setItem('antd-pro-authority', MENU_STATUS.STORE_LIST);
    dispatch({
      type: 'menu/getMenuData',
      payload: { routes, authority, route: menuAll },
    });
    router.push(`/storeAll`);
  };

  handelReturnIndex = async () => {
    const { dispatch, menu: { menuAll: { routes, authority }, menuAll } } = this.props;
    const backStatus = localStorage.getItem('antd-pro-back');
    await localStorage.setItem('antd-pro-authority', backStatus);
    localStorage.removeItem('antd-pro-back');
    await reloadAuthorized();
    await dispatch({
      type: 'menu/getMenuData',
      payload: { routes, authority, route: menuAll },
    });
    this.closeCurrentTab();
    router.push('/');
  };

  closeCurrentTab = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tabsPanes/save',
      payload: { panes: [] },
    });
  };

  descriptionItems = (data) => {
    const content = [];
    const labelArr = ['创建人', '创建时间', '库存状态', '储物种类'];
    const desArr = [];
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const i in data) {
      desArr.push(data[i]);
    }
    labelArr.forEach((item, index) => {
      content.push(
        <Descriptions.Item
          label={item}
          key={item}
        >{index !== 2 ? desArr[index + 2] : desArr[index + 2] == Status.DEFAULT ? '库存正常' : '库存紧急'}
        </Descriptions.Item>,
      );
    });
    return content;
  };

  render() {
    const { StoreDetailModel: { data, storeLogs }, LogFetch } = this.props;
    const columns = [
      {
        align: 'center',
        dataIndex: 'id',
        key: 'id',
        title: '序号',
        width: 60,
        render: (value, row, index) => (index + 1),
      },
    ];
    const btnList = {
      primaryBtn: [{
        func: this.listPage,
        param: {},
        key: 'REFRESH',
      }],
    };
    return (
      <PageHeaderWrapper>
        <Row>
          <Col>
            <Card>
              <div className={style.title}>
                <span>{data.storeName || ''}</span>
              </div>
              <Descriptions
                column={2}
                // bordered
                key="description"
              >
                {this.descriptionItems(data)}
              </Descriptions>
              {/*<div className={style.title} style={{ marginTop: '1em' }}>*/}
              {/*  <span>仓库操作日志:</span>*/}
              {/*</div>*/}
              {/*<ToolBarGroup btnOptions={btnList}/>*/}
              {/*<Table*/}
              {/*  dataSource={storeLogs}*/}
              {/*  loading={LogFetch}*/}
              {/*  pagination={false}*/}
              {/*  columns={columns}*/}
              {/*  rowKey={record => record.id}*/}
              {/*/>*/}
            </Card>
          </Col>
        </Row>
        <FooterToolbar>
          <Button onClick={this.handelReturnIndex} style={{ marginLeft: 8 }} htmlType='button'>
            首页
          </Button>
          <Button type="primary" onClick={this.handelCancel} style={{ marginLeft: 8 }} htmlType='button'>
            返回
          </Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default StoreDetail;
