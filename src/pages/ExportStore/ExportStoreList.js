import React, { PureComponent, Fragment } from 'react';
import { Card, Form, Tooltip, Modal, Button, Icon, Table } from 'antd';
import { connect } from 'dva';
import ToolBarGroup from '@/components/ToolBarGroup';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FooterToolbar from '@/components/FooterToolbar';
import router from 'umi/router';
import { reloadAuthorized } from '@/utils/Authorized';
import { MENU_STATUS } from '../../utils/Enum';
import AdvancedSearchForm from '../../components/AdvancedSearchForm/index';
import ExportDetail from './ExportDetail';

const { confirm } = Modal;

@Form.create()
@connect(({ ExportStoreModel, loading, menu, tabsPanes }) => ({
  ExportStoreModel,
  loading, menu, tabsPanes,
  DataFetch: loading.effects['ExportStoreModel/fetch'],
}))

class ExportStoreList extends PureComponent {
  constructor() {
    super();
    this.state = {
      selectedRows: [],
      drawStyle: '',
      visible: false,
    };
  }

  componentWillMount() {
    this.saveStatus();
  }

  async componentDidMount() {
    this.changeMenu().then(async () => {
      const storeId = sessionStorage.getItem('store_id');
      const { dispatch } = this.props;
      await dispatch({
        type: 'ExportStoreModel/save',
        payload: { storeId },
      });
      await this.closeOther();
      await this.listPage();
    });
  };

  closeOther = () => {
    const { tabsPanes: { activeKey } } = this.props;
    const { tabsPanes: { panes }, dispatch } = this.props;
    const newPanes = panes.filter((current) => activeKey === current.key);
    dispatch({
      type: 'tabsPanes/save',
      payload: { panes: newPanes },
    });
  };


  saveStatus = async () => {
    if (!localStorage.getItem('antd-pro-back')) {
      localStorage.setItem('antd-pro-back', localStorage.getItem('antd-pro-authority'));
    }
    await localStorage.setItem('antd-pro-authority', MENU_STATUS.STORE_DETAIL);
  };

  changeMenu = async () => {
    await reloadAuthorized();
    const { menu: { menuAll } } = this.props;
    const { dispatch, menu: { menuAll: { routes, authority } } } = this.props;
    await dispatch({
      type: 'menu/getMenuData',
      payload: { routes, authority, route: menuAll },
    });
  };


  listPage = (params) => {
    const { dispatch, ExportStoreModel: { storeId } } = this.props;
    dispatch({
      type: 'ExportStoreModel/getStoreDetail',
      payload: { id: storeId },
    });
    dispatch({
      type: 'ExportStoreModel/fetch',
      payload: { ...params, storeId },
    });
  };

  // 关闭当前页
  handelCancel = async () => {
    router.push('/storeAll');
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

  createAction = (text, record) => (
    <Fragment>
      <Tooltip title='删除记录'>
        <a onClick={() => this.deleteStore(record)}><Icon type="delete"/></a>
      </Tooltip>
    </Fragment>
  );

  handleAdd = () => {
    this.setState({
      visible: true,
      drawStyle: 'add',
    });
  };

  deleteStore = (record) => {
    const { dispatch } = this.props;
    confirm({
      title: `是否删除所选记录`,
      okText: '废弃',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'ExportStoreModel/delExport',
          payload: {
            id: record.id,
          },
        });
      },
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { selectedRows, visible, drawStyle, storeDetail } = this.state;
    const { ExportStoreModel: { data, user }, DataFetch } = this.props;
    const results = {
      list: data,
      pagination: {},
    };
    const searchList = [
      {
        title: '订单号',
        field: 'key',
        type: 'input',
      },
    ];
    const columns = [
      {
        align: 'center',
        dataIndex: 'id',
        key: 'id',
        title: '序号',
        width: 60,
        render: (value, row, index) => (index + 1),
      },
      {
        align: 'center',
        title: '订单号',
        width: 140,
        dataIndex: 'key',
        key: 'key',
      }, {
        align: 'center',
        title: '操作人',
        width: 140,
        dataIndex: 'user',
        key: 'user',
      },{
        align: 'center',
        title: '出库数量',
        width: 140,
        dataIndex: 'num',
        key: 'num',
      }, {
        align: 'center',
        title: '出库时间',
        width: 140,
        dataIndex: 'time',
        key: 'time',
      },
      {
        align: 'center',
        title: '操作',
        width: 140,
        key: 'action',
        dataIndex: 'action',
        render: (text, record) => (
          this.createAction(text, record)
        ),
      },
    ];
    this.btnList = {
      primaryBtn: [{
        func: this.handleAdd,
        param: [],
        key: 'ADD',
      }, {
        func: this.listPage,
        param: {},
        key: 'REFRESH',
      }],
    };
    return (
      <PageHeaderWrapper title='出库管理'>
        <AdvancedSearchForm
          searchList={searchList}
          doSearch={this.listPage}
        />
        <Card bordered={false}>
          <ToolBarGroup btnOptions={this.btnList} selectedRows={selectedRows}/>
          <Table
            loading={DataFetch}
            dataSource={data}
            pagination={false}
            columns={columns}
            onChange={() => {}}
            rowKey={record => record.id}
          />
        </Card>
        <ExportDetail
          visible={visible}
          onClose={this.onClose}
          onCancel={this.handleCancel}
          drawStyle={drawStyle}
          storeDetail={storeDetail}
          user={user}
        />
        <FooterToolbar>
          <Button onClick={this.handelReturnIndex} style={{ marginLeft: 8 }} htmlType='button'>
            首页
          </Button>
          <Button type="primary" style={{ marginLeft: 8 }} onClick={this.handelCancel} htmlType='button'>
            返回
          </Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default ExportStoreList;
