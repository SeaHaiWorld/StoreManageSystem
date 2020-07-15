import React, { PureComponent, Fragment } from 'react';
import { Card, Form, Tooltip, Modal, Button, Divider, Icon, Table } from 'antd';
import { connect } from 'dva';
import ToolBarGroup from '@/components/ToolBarGroup';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FooterToolbar from '@/components/FooterToolbar';
import router from 'umi/router';
import { reloadAuthorized } from '@/utils/Authorized';
import { MENU_STATUS, StoreStatus } from '../../utils/Enum';
import AdvancedSelect from '../../components/AdvancedSelect';
import AdvancedSearchForm from '../../components/AdvancedSearchForm/index';
import PublicStoreAdd from './PublicStoreAdd';
import global from '../../global.less';

const { confirm } = Modal;
@Form.create()
@connect(({ PublicStoreModel, loading, menu, tabsPanes }) => ({
  PublicStoreModel,
  loading, menu, tabsPanes,
  DataFetch: loading.effects['PublicStoreModel/fetch'],
}))

class PublicStoreList extends PureComponent {
  constructor() {
    super();
    this.state = {
      selectedRows: [],
      drawStyle: '',
      visible: false,
      storeDetail: '',
    };
  }

  componentWillMount() {
    this.saveStatus();
  }

  componentDidMount() {
    this.changeMenu().then(() => {
      this.closeOther();
      this.listPage();
    })

  };

  closeOther = () => {
    const { tabsPanes: { activeKey } } = this.props;
    const { tabsPanes: { panes }, dispatch } = this.props;
    const newPanes = panes.filter((current) => activeKey === current.key);
    dispatch({
      type: 'tabsPanes/save',
      payload: { panes: newPanes }
    })
  };

  saveStatus = async () => {
    if (!localStorage.getItem('antd-pro-back')) {
      localStorage.setItem('antd-pro-back', localStorage.getItem('antd-pro-authority'))
    }
    await localStorage.setItem('antd-pro-authority', MENU_STATUS.STORE_LIST)
  };

  changeMenu = async () => {
    await reloadAuthorized();
    const { menu: { menuAll } } = this.props;
    const { dispatch, menu: { menuAll: { routes, authority } } } = this.props;
    await dispatch({
      type: 'menu/getMenuData',
      payload: { routes, authority, route: menuAll },
    })

  };

  listPage = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'PublicStoreModel/fetch',
      payload: {...params},
    });
  };

  handelCancel = async () => {
    router.push('/PublicStore')
  };

  handelReturnIndex = async () => {
    const { dispatch, menu: { menuAll: { routes, authority }, menuAll } } = this.props;
    const backStatus = localStorage.getItem('antd-pro-back');
    await localStorage.setItem('antd-pro-authority', backStatus);
    localStorage.removeItem("antd-pro-back");
    await reloadAuthorized();
    await dispatch({
      type: 'menu/getMenuData',
      payload: { routes, authority, route: menuAll },
    });
    this.closeCurrentTab();
    router.push('/')
  }

  closeCurrentTab = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tabsPanes/save',
      payload: { panes: [] }
    })
  };

  createAction = (text, record) => (
    <Fragment>
      <Tooltip title='仓库详情'>
        <a onClick={() => this.getStoreDetail(record)}><Icon type="credit-card" /></a>
      </Tooltip>
      <Divider type="vertical" />
      <Tooltip title='修改'>
        <a onClick={() => this.editStore(record)}><Icon type="edit" /></a>
      </Tooltip>
      <Divider type="vertical" />
      <Tooltip title='废弃'>
        <a onClick={() => this.deleteStore(record)}><Icon type="delete" /></a>
      </Tooltip>
    </Fragment>
  );

  getStoreDetail=(record)=>{
    sessionStorage.setItem("store_id",record.id);
    router.push(`/storeDetail`)
  };

  handleAdd = () => {
    this.setState({
      visible: true,
      drawStyle: 'add'
    })
  };

  editStore = (record) => {
    this.setState({
      visible:true,
      drawStyle:'edit',
      storeDetail: record
    })
  };

  deleteStore = (record) => {
    const { dispatch } = this.props;
    confirm({
      title: `是否废弃所选仓库`,
      okText: '废弃',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'PublicStoreModel/delStore',
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
    })
  };

  render() {
    const { selectedRows, visible, drawStyle, storeDetail } = this.state;
    const { PublicStoreModel: { data, user }, DataFetch } = this.props;
    const searchList = [
      {
        title: '仓库名称',
        field: 'storeName',
        type: 'input',
      },
      {
        title: '储物种类',
        field: 'type',
        type: 'input',
      },
      {
        title : '仓库状态',
        field : 'status',
        type : 'other',
        renderComponent : () => (<AdvancedSelect dataSource={StoreStatus} type="STORE" placeholder='请选择项目类型' onChange={() => {}} />),
      }
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
        title: '仓库名称',
        width: 140,
        dataIndex: 'storeName',
        key: 'storeName',
      }, {
        align: 'center',
        title: '储物种类',
        width: 140,
        dataIndex: 'type',
        key: 'type',
      }, {
        align: 'center',
        title: '创建人',
        width: 140,
        dataIndex: 'createUser',
        key: 'createUser',
      }, {
        align: 'center',
        title: '仓库状态',
        width: 140,
        dataIndex: 'status',
        key: 'status',
        render: (value) => {
          const type = StoreStatus.filter(item => item.k == value);
          return (
            <span><div className={global.circle} style={{ background: type[0] === undefined ? 'black' : type[0].color }} />{type[0] === undefined ? '' : type[0].val}</span>
          )
        }
      }, {
        align: 'center',
        title: '创建时间',
        width: 140,
        dataIndex: 'createTime',
        key: 'createTime',
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
      }]
    };
    return (
      <PageHeaderWrapper title='仓库列表'>
        <AdvancedSearchForm
          searchList={searchList}
          doSearch={this.listPage}
        />
        <Card bordered={false}>
          <ToolBarGroup btnOptions={this.btnList} selectedRows={selectedRows} />
          <Table
            loading={DataFetch}
            dataSource={data}
            pagination={false}
            columns={columns}
            onChange={() => {}}
            rowKey={record => record.id}
          />
        </Card>
        <PublicStoreAdd
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
    )
  }
}
export default PublicStoreList;
