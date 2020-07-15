import React, { PureComponent } from 'react';
import { Row, Col, Button, Input, Form, message, Card, Select } from 'antd';
import PropTypes from 'prop-types';

const FormItem = Form.Item;
const { Option } = Select;
const ButtonGroup = Button.Group;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
    md: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 19 },
    md: { span: 15 },
  },
};

@Form.create()
class AdvancedSearchForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      col: 4
    };
  }

  static propTypes = {
    searchList: PropTypes.array.isRequired,// 父组件选中的数据
    doSearch: PropTypes.func.isRequired,
  };

  constructSearchComponent = () => {
    const {col} = this.state;
    const { searchList, form: { getFieldDecorator } } = this.props;
    const result = [];
    const row = parseInt(searchList.length / col);
    for (let i = 0; i <= row; i++) {
      const rowContent = [];
      for (let j = 0; j < col; j++) {
        const num = i * col + j;
        if (searchList.length > num) {
          const current = searchList[num];
          const { title, field, value, required } = current;
          const rules = {
            whitespace: true,
            required: required || false,
          };
          rowContent.push(
            <Col span={24 / col} key={field}>
              <FormItem
                {...formItemLayout}
                label={title || ''}
              >
                {getFieldDecorator(field, {
                  initialValue: value || '',
                  rules: [rules],
                })(
                  this.createComponent(current),
                )}
              </FormItem>
            </Col>);
        }
      }
      if (rowContent.length > 0) {
        const RowData = <Row key={i}>{rowContent}</Row>;
        result.push(RowData);
      }
    }
    return (result);
  };

  createSelection = (src) => {
    return (
      <Select
        style={{ width: '100%' }}
      >
        {src.map((current) => {
          return <Option id={current.value} key={current.key}>{current.value}</Option>;
        })}
      </Select>
    );
  };

  createComponent = (props) => {
    const { type: componentType, renderComponent, src } = props;
    const typeMap = {
      input: () => (<Input style={{ width: '100%' }} {...props} />),
      select: () => (this.createSelection(src)),
      other: () => renderComponent(),
    };
    return typeMap[componentType]();
  };

  doSearch = () => {
    const { doSearch, form: { getFieldsValue, validateFields } } = this.props;
    const formData = getFieldsValue();
    let params = {};
    params = { ...params };
    Object.keys(formData).forEach((current) => {
      if (formData[current] !== '') {
        params[current] = formData[current];
      }
    });
    validateFields((err) => {
      if (!err) {
        doSearch(params);
      } else {
        message.error('搜索信息输入有误！');
      }
    });
  };

  doReset = () => {
    const { doSearch, doReset, form: { resetFields } } = this.props;
    const params = {};
    doSearch(params);
    if (doReset) {
      doReset();
    }
    resetFields();
  };

  render() {
    return (
      <Card style={{ marginBottom: 15, height: 90 }} bordered={false}>
        <Row>
          <Col span={20}>
            <Form>
              {this.constructSearchComponent()}
            </Form>
          </Col>
          <Col offset={20}>
            <ButtonGroup style={{ width: '100%' }}>
              <Button id='search' type="primary" style={{ width: '50%' }} onClick={this.doSearch}>搜索</Button>
              <Button id='reset' style={{ width: '50%' }} onClick={this.doReset}>重置</Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Card>
    );
  }
}

export default AdvancedSearchForm;
