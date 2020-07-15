import React, { Suspense } from 'react';
import { Layout, Tabs, Progress } from 'antd';
import DocumentTitle from 'react-document-title';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import { connect } from 'dva';
import router from 'umi/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import Media from 'react-media';
import { formatMessage } from 'umi/locale';
import Authorized from '@/utils/Authorized';
import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';
import Exception403 from '../pages/Exception/403';
import PageLoading from '@/components/PageLoading';
import SiderMenu from '@/components/SiderMenu';
import styles from './BasicLayout.less';

const { Content } = Layout;
const { TabPane } = Tabs;

const query = {
  'screen-xs' : {
    maxWidth : 575,
  },
  'screen-sm' : {
    minWidth : 576,
    maxWidth : 767,
  },
  'screen-md' : {
    minWidth : 768,
    maxWidth : 991,
  },
  'screen-lg' : {
    minWidth : 992,
    maxWidth : 1199,
  },
  'screen-xl' : {
    minWidth : 1200,
    maxWidth : 1599,
  },
  'screen-xxl' : {
    minWidth : 1600,
  },
};

@connect(({ basicdata, global, loading ,tabsPanes}) => ({
  basicdata,
  global,tabsPanes,
  loading : loading.models.basicdata,
}))
class BasicLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
    this.pathnameListWithoutGetInfo = [
      '/exception/403',
      '/exception/404',
      '/exception/500',
      '/',
    ];
    this.newTabIndex = 0;
    this.state = {
      activeKey : '1',
      panes : [],
    };
  }

  componentWillMount(){
    this.getUserInfo();
  }

  componentDidMount() {
    const {
      dispatch,
      route : { routes, authority },route,
    } = this.props;
    dispatch({
      type : 'menu/getMenuData',
      payload : { routes, authority ,route},
    });
  }

  componentWillReceiveProps(nextProps) {
    const {
      children,
      location : { pathname },
      menuData,
      breadcrumbNameMap,
      fixedHeader,
    } = nextProps;
    const routerConfig = this.matchParamsPath(pathname, breadcrumbNameMap);
    const contentStyle = !fixedHeader ? { paddingTop : 0 } : {};
    const pageData = { routerConfig, contentStyle, children };
      this.add(pathname, menuData, pageData, nextProps);
    this.closeCurrentTab(nextProps);
  }

  componentDidUpdate(preProps) {

    // After changing to phone mode,
    // if collapsed is true, you need to click twice to display
    const { collapsed, isMobile } = this.props;
    if (isMobile && !preProps.isMobile && !collapsed) {
      this.handleMenuCollapse(false);
    }
  }

  getContext() {
    const { location, breadcrumbNameMap } = this.props;
    return {
      location,
      breadcrumbNameMap,
    };
  }

  /**
   * 获取面包屑映射
   * @param {Object} menuData 菜单配置
   */
  getBreadcrumbNameMap(nextProps) {
    const routerMap = {};
    const { menuData } = nextProps;//原文档如此写的
    const flattenMenuData = data => {
      data.forEach(menuItem => {
        if (menuItem.children) {
          flattenMenuData(menuItem.children);
        }
        // Reduce memory usage
        routerMap[menuItem.path] = menuItem;
      });
    };
    flattenMenuData(menuData);
    return routerMap;
  }

  getBreadcrumbNameMapByRoute(routerData) {
    const routerMap = {};
    const flattenMenuData = data => {
      data.forEach(menuItem => {
        if (menuItem.routes) {
          flattenMenuData(menuItem.routes);
        }
        // Reduce memory usage
        routerMap[menuItem.path] = menuItem;
      });
    };
    flattenMenuData(routerData);
    return routerMap;
  }

  getUserInfo = () => {
    const {
      dispatch,
    } = this.props;
    dispatch({
      type : 'user/fetchCurrent',
    });
  };

  matchParamsPath = (pathname, breadcrumbNameMap) => {
    const pathKey = Object.keys(breadcrumbNameMap).find(key => pathToRegexp(key).test(pathname));
    return breadcrumbNameMap[pathKey];
  };

  getPageTitle = (pathname, breadcrumbNameMap) => {
    const currRouterData = this.matchParamsPath(pathname, breadcrumbNameMap);
    console.log(currRouterData)
    if (!currRouterData) {
      return '库房管理系统';
    }
    const pageName = formatMessage({
      id : currRouterData.locale || currRouterData.name,
      defaultMessage : currRouterData.name,
    });
    return `${pageName}`;
  };

  getLayoutStyle = () => {
    const { fixSiderbar, isMobile, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft : collapsed ? '80px' : '256px',
      };
    }
    return null;
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type : 'global/changeLayoutCollapsed',
      payload : collapsed,
    });
  };

  onChange = (activeKey) => {
    const { tabsPanes:{panes} } = this.props;
    panes.forEach((current) => {
      if (current.key === activeKey) {
        router.push(current.pathname);
        this.setState({ activeKey });
      }
    });
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  add = (pathname, menuData, pageData, nextProps) => {
    const {dispatch}=this.props
    const { routerConfig, contentStyle, children } = pageData;
    // eslint-disable-next-line no-shadow
    const { location : { query } } = nextProps;
    const { tabsPanes:{panes }} = this.props;
    let activeKey = `newTab${this.newTabIndex++}`;
    const constructPane = () => {
      return (
        <Content className={styles.content} style={contentStyle}>
          <Authorized
            authority={routerConfig && routerConfig.authority}
            noMatch={<Exception403/>}
          >
            {children}
          </Authorized>
        </Content>
      );
    };
    //const breadcrumbNameMap = this.getBreadcrumbNameMap(nextProps);
    const breadcrumbNameMap = this.getBreadcrumbNameMapByRoute(nextProps.route.routes);
    if (pathname !== '/') {
      //该句为添加
      //console.log(nextProps.route.routes);
      const menuKey = this.matchParamsPath(pathname, breadcrumbNameMap);
      // const tabName = breadcrumbNameMap[pathname] ? breadcrumbNameMap[pathname].name : this.getBreadcrumbNameMapByRoute(nextProps.route.routes)[pathname].name;
      const tabName = menuKey ? menuKey.name : this.getBreadcrumbNameMapByRoute(nextProps.route.routes)[pathname].name;
      const isExist = panes.some((_current) => {
        return _current.title === tabName;
      });
      if (!isExist) {
        //如果panes中已不存在当前名字
        panes.push({
          title : tabName, content : constructPane(), key : activeKey, pathname,
        });
        this.setState({  activeKey });
        dispatch({
          type:'tabsPanes/save',
          payload:{panes,activeKey, panesStatus:true,}
        })
      } else {
        if (query.prevent) {
          const upDatePanes = panes.map((current) => {
            if (current.title === tabName) {
              current.content = constructPane();
              current.pathname = pathname;
            }
            return current;
          });
          this.setState({
            panes : upDatePanes,
          });
        }
        //默认将当前标题对应的key设为当前activeKey
        panes.forEach((current) => {
          if (current.title === tabName) {
            activeKey = current.key;
          }
        });
        this.setState({ activeKey });
      }
    }
  };

  remove = (targetKey) => {
    const { dispatch } = this.props;
    let { activeKey } = this.state;
    let { tabsPanes:{ panes }} = this.props;
    let lastIndex = 0;
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    panes = panes.filter(pane => pane.key !== targetKey);
    if (lastIndex >= 0 && activeKey === targetKey) {
      activeKey = panes[lastIndex].key;
      router.push(panes[lastIndex].pathname);
    }
    this.setState({activeKey });
    dispatch({
      type:'tabsPanes/save',
      payload:{panes}
    })
  };

  closeCurrentTab = (nextProps) => {
    const { global : { willCloseContentName }, dispatch } = nextProps;
    const { tabsPanes:{panes} } = this.props;
    if (willCloseContentName !== '') {
      panes.forEach((current) => {
        if (current.title === willCloseContentName) {
          this.remove(current.key);
          dispatch({
            type : 'global/closeCurrentTab',
            payload : {
              tabName : '',
            },
          });
        }
      });
    }
  };

  getPercentSuccess = () => {

  };

  render() {
    const {
      navTheme,
      layout : PropsLayout,
      location : { pathname },
      isMobile,
      menuData,
      breadcrumbNameMap,
    } = this.props;
    const { tabsPanes:{ panes }} = this.props;
    const { activeKey } = this.state;
    const isTop = PropsLayout === 'topmenu';
    const percentSuccess = this.getPercentSuccess();
    const status=pathname.indexOf('ProjectBranch')!==-1
    const layout = (
      <Layout>
        {isTop && !isMobile||status? null : (
          <SiderMenu
            theme={navTheme}
            onCollapse={this.handleMenuCollapse}
            menuData={menuData}
            isMobile={isMobile}
            {...this.props}
          />
        )}
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight : '100vh',
          }}
        >
          <Header
            menuData={menuData}
            handleMenuCollapse={this.handleMenuCollapse}
            isMobile={isMobile}
            {...this.props}
          />
          {percentSuccess !== 100 && (
            <Progress percent={percentSuccess} strokeWidth={5} showInfo={false}/>)
          }

          {
            status?<div>
              {panes.map(pane =>
                <div key={pane.key}>{pane.content}</div>
              )}
            </div>:<Tabs
              style={{height:'100%'}}
              hideAdd
              onChange={this.onChange}
              activeKey={activeKey}
              type="card"
              onEdit={this.onEdit}
            >
              {panes.map(pane =>
                <TabPane
                  tab={pane.title}
                  key={pane.key}
                >
                  {pane.content}
                </TabPane>,
              )}
            </Tabs>

          }
          <Footer />
        </Layout>
      </Layout>
    );
    return (
      <React.Fragment>
        <DocumentTitle title={this.getPageTitle(pathname, breadcrumbNameMap)}>
          <ContainerQuery query={query}>
            {params => (
              <Context.Provider value={this.getContext()}>
                <div className={classNames(params)}>{layout}</div>
              </Context.Provider>
            )}
          </ContainerQuery>
        </DocumentTitle>
        <Suspense fallback={<PageLoading/>}/>
      </React.Fragment>
    );
  }
}

export default connect(({ global, setting, menu, basicdata }) => ({
  collapsed : global.collapsed,
  layout : setting.layout,
  menuData : menu.menuData,
  breadcrumbNameMap : menu.breadcrumbNameMap,
  basicdata,
  ...setting,
}))(props => (
  <Media query="(max-width: 599px)">
    {isMobile => <BasicLayout {...props} isMobile={isMobile}/>}
  </Media>
));
