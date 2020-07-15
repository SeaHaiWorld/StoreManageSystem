import React, { PureComponent } from 'react';
import { Card, Form, Modal, Button, Icon, Row, Col, Tooltip, Divider } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FooterToolbar from '@/components/FooterToolbar';
import router from 'umi/router';
import { reloadAuthorized } from '@/utils/Authorized';
import AdvancedCard from '@/components/CreatCard';
import { Status } from '@/utils/Enum';
import Img from './noStore.png';
import { MENU_STATUS } from '../../utils/Enum';
import styles from './StoreList.less';
import PublicStoreAdd from './PublicStoreAdd';

const { confirm } = Modal;

@Form.create()
@connect(({ PublicStoreModel, loading, menu, tabsPanes }) => ({
  PublicStoreModel,
  loading, menu, tabsPanes,
  DataFetch: loading.effects['PublicStoreModel/fetch'],
}))

class PublicStore extends PureComponent {
  constructor() {
    super();
    this.state = {
      drawStyle: '',
      topTitle: '',
      visible: false,
    };
  }


  componentWillMount() {
    this.saveStatus();
  }

  componentDidMount() {
    this.changeMenu().then(() => {
      this.closeOther();
      this.listPage();
    });
  };

  // 权限设置
  saveStatus = async () => {
    if (!localStorage.getItem('antd-pro-back')) {
      localStorage.setItem('antd-pro-back', localStorage.getItem('antd-pro-authority'));
    }
    await localStorage.setItem('antd-pro-authority', MENU_STATUS.STORE_LIST);
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


  closeCurrentTab = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tabsPanes/save',
      payload: { panes: [] },
    });
  };

  // 更换菜单
  changeMenu = async () => {
    await reloadAuthorized();
    const { menu: { menuAll } } = this.props;
    const { dispatch, menu: { menuAll: { routes, authority } } } = this.props;
    await dispatch({
      type: 'menu/getMenuData',
      payload: { routes, authority, route: menuAll },
    });
  };


  listPage = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'PublicStoreModel/fetch',
    });
  };

  // 关闭当前页
  handelCancel = async () => {
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

  handleAll = () => {
    router.push(`/storeAll`);
  };

  handleAdd = () => {
    this.setState({
      visible: true,
      drawStyle: 'add',
    });
  };

  editStore = (record) => {
    this.setState({
      drawStyle: 'edit',
      visible: true,
      record,
    });
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
            data: {
              id: record.id,
            },
          },
        });
      },
    });
  };

  handleEditOnRow = (record) => {
    sessionStorage.setItem('store_id', record.id);
    router.push(`/storeDetail`);
  };

  getCardContent = (item, type) => (
    <div>
      <div onClick={() => this.handleEditOnRow(item)} className={styles.cardDiv}>
        <Row>
          <Col span={23}>
            <p className={styles.title}>{item.storeName}</p>
          </Col>
          {type === 'top' &&
          <Col span={1}>
            <Icon
              style={{ color: 'rgba(255, 156, 110, 1)' }}
              type="fire"
              key="fire"
            />
          </Col>}
        </Row>
        <p className={styles.Typeface}>创建时间: {item.createTime}</p>
        <Row>
          <Col span={16}>
            <Row>
              <Col span={6}>
                <p className={styles.Typeface}>创建人:</p>
              </Col>
              <Col span={18}>
                <p className={styles.Typecontent}>{item.createUser}</p>
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            <Row>
              <Col span={16}>
                <p className={styles.Typeface}>当前库存：</p>
              </Col>
              <Col span={8}>
                <p className={styles.Typecontent} style={{ paddingLeft: '50%' }}>{item.stock}</p>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col span={16}>
            <Row>
              <Col span={6}>
                <p className={styles.Typeface}>种类:</p>
              </Col>
              <Col span={18}>
                <p className={styles.Typecontent}>{item.type}</p>
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            <Row>
              <Col span={16}>
                <p className={styles.Typeface}>出库容量：</p>
              </Col>
              <Col span={8}>
                <p className={styles.Typecontent} style={{ paddingLeft: '50%' }}>{item.max}</p>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <div>
        <Divider className={styles.divider}/>
        <Row>
          <Col span={3}>
            <Tooltip title='修改'>
              <a className={styles.editStyle} onClick={() => this.editStore(item)}><Icon type="edit" /></a>
            </Tooltip>
          </Col>
          <Col span={3}>
            <Tooltip title='废弃'>
              <a className={styles.deleteStyle} onClick={() => this.deleteStore(item)}><Icon type="delete" /></a>
            </Tooltip>
          </Col>
        </Row>
      </div>
    </div>
  );

  topStoreMap = (data) => {
    let topTitle = '';
    let topData = [];
    if (data) {
      topData = data.filter(item => item.status == Status.URGE);
      topTitle = topData.length !== 0 ? '库存紧急' : '';
    }
    this.setState({ topTitle });
    return (
      <AdvancedCard
        data={topData}
        type='top'
        getCardContent={this.getCardContent}
      />
    );
  };

  allStoreMap = (data) => {
    const store = [];
    if (data) {
      data.filter(item => item.status == Status.DEFAULT).map((item, index) => {
        if (index <= 4) {
          store[index] = item;
        }
        return false;
      });
      return (
        <AdvancedCard
          data={store}
          type='all'
          getCardContent={this.getCardContent}
        />
      );
    }
    return (
      <Col>
        <p className={styles.noStore}>
          没有仓库
        </p>
      </Col>
    );
  };

  actionStore = (data) => {
    if (data) {
      return (
        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 12 }}
          xl={{ span: 8 }}
        >
          <Row>
            <Card
              className={styles.actionCard_add}
              onClick={() => this.handleAdd()}
            >
              <Row className={styles.actionRow}>
                <Col offset={8} span={2}>
                  <Icon
                    style={{
                      fontSize: '20px',
                      marginTop: '6px',
                      color: 'rgba(0, 0, 0, 1)',
                    }}
                    type="plus"
                    key="plus"
                  />
                </Col>
                <Col span={6}>
                  <p className={styles.addStyle}>新建仓库</p>
                </Col>
              </Row>
            </Card>
          </Row>
          <Row>
            <Card
              className={styles.actionCard_more}
              onClick={() => this.handleAll()}
            >
              <Row className={styles.actionRow}>
                <Col offset={8} span={2}>
                  <Icon
                    style={{
                      fontSize: '20px',
                      marginTop: '6px',
                      color: 'rgba(0, 0, 0, 1)',
                    }}
                    type="appstore"
                    key="appstore"
                  />
                </Col>
                <Col span={6}>
                  <p className={styles.addStyle}>更多仓库</p>
                </Col>
              </Row>
            </Card>
          </Row>
        </Col>
      );
    }
    return (
      <Col>
        <p className={styles.noStore}>
          没有仓库
        </p>
      </Col>
    );
  };

  // eslint-disable-next-line consistent-return
  creatCard = (data) => {
    const { topTitle } = this.state;
    if (data !== undefined) {
      if (data.length !== 0) {
        return (
          <Card className={styles.cardStyle} bordered={false}>
            <p className={styles.cardTitle}>{topTitle}</p>
            <Row gutter={[16, 36]}>
              {this.topStoreMap(data)}
            </Row>
            <p className={styles.cardTitle} style={{ paddingTop: 30 }}>库存正常</p>
            <Row gutter={[16, 36]}>
              {this.allStoreMap(data)}
              {this.actionStore(data)}
            </Row>
          </Card>
        );
      }
      return (
        <div>
          <Card className={styles.noStoreCardStyle} bordered={false}>
            <div style={{ textAlign: 'center', marginLeft: '' }}>
              <img style={{ textAlign: 'center' }} src={Img} alt="" />
            </div>
          </Card>
          <Card className={styles.noStoreActionStyle} bordered={false}>
            <p className={styles.noStoreExplain}>没有任何仓库</p>
            <Button
              className={styles.noStoreButton}
              type="primary"
              onClick={() => this.handleAdd()}
              htmlType='button'
            >
              创建仓库
            </Button>
          </Card>
        </div>
      );
    }
  };

  handleCancel = () => {
    this.setState({
          visible: false,
    });
  };

  render() {
    const { visible, drawStyle, record } = this.state;
    const { PublicStoreModel: { data, user } } = this.props;
    return (
      <PageHeaderWrapper>
        {this.creatCard(data)}
        <PublicStoreAdd
          visible={visible}
          onClose={this.onClose}
          onCancel={this.handleCancel}
          drawStyle={drawStyle}
          storeDetail={record}
          user={user}
        />
        <FooterToolbar>
          <Button type="primary" style={{ marginLeft: 8 }} onClick={this.handelCancel} htmlType='button'>
            返回
          </Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default PublicStore;
