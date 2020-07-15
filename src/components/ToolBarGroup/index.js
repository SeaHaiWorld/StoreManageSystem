import React, { PureComponent } from 'react';
import { Button, Menu, Dropdown, Icon } from 'antd';
import PropTypes from 'prop-types';
import styles from './index.less';

const BUTTON_ARRAY = [{
  name: '新建',
  key: 'ADD',
  icon: 'file',
  param: {},
  function: '',
}, {
  name: '删除',
  key: 'DELETE',
  icon: 'delete',
  param: {},
  func: '',
}, {
  name: '刷新',
  key: 'REFRESH',
  icon: 'reload',
  param: {},
  func: '',
}];

class ToolBarGroup extends PureComponent {
  static propTypes = {
    primaryBtn: PropTypes.array.isRequired,
  };

  static defaultProps = {
    primaryBtn: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      selectPrimaryBtn: [],
    };
  }

  componentDidMount() {
    const { btnOptions } = this.props;
    if (btnOptions) {
      const { primaryBtn } = btnOptions;
      this.setState({
        selectPrimaryBtn: this.getBtnData(primaryBtn) || [],
      });
    }
  }

  getBtnData = (btnData) => {
    const resData = [];
    if (!btnData) {
      return;
    }
    btnData.forEach((v) => {
      let tmpBtn = BUTTON_ARRAY.find((o) => o.key == v.key);
      if (tmpBtn) {
        const { func, param } = v;
        tmpBtn = {
          ...tmpBtn,
          func,
          param,
        };
        resData.push(tmpBtn);
      }
    });
    return resData;
  };

  renderPrimaryBtn = () => {
    const items = [];
    const { selectPrimaryBtn } = this.state;
    if (selectPrimaryBtn.length == 0) {
      return items;
    }
    selectPrimaryBtn.forEach((v) => {
      items.push(
        <Button
          icon={v.icon}
          type="dashed"
          key={v.key}
          id={v.key}
          onClick={() => v.func({ ...v.param })}
        >
          {v.name}
        </Button>);
    });
    return items;
  };

  render() {
    return (
      <div className={styles.listOperator}>
        {this.renderPrimaryBtn()}
      </div>
    );
  }
}

export default ToolBarGroup;
