import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Input, Row, Col, Form, Modal, message } from 'antd';
import { Layout } from '@/utils/globalUIConfig';

const FormItem = Form.Item;
@Form.create()
@connect(({ ExportStoreModel, loading }) => ({
  ExportStoreModel,
  AllLoading: loading.models.ExportStoreModel,
}))

class ExportDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      key: '',
    };
  }

  componentDidMount() {
    this.setKey();
  }

  handleSubmit = () => {
    const { key } = this.state;
    const { form: { validateFields }, dispatch, onCancel, ExportStoreModel: { storeDetail } } = this.props;
    validateFields((error, values) => {
        if (!error) {
          if (Number(storeDetail.stock) - Number(values.num) >= 0) {
            const stock = Number(storeDetail.stock) - Number(values.num);
            dispatch({
              type: 'ExportStoreModel/addExport',
              payload: { ...values, key, storeId: storeDetail.id },
            });
            dispatch({
              type: 'ExportStoreModel/editStock',
              payload: {
                id: storeDetail.id,
                stock,
              },
            });
            const { form: { resetFields } } = this.props;
            resetFields();
            onCancel();
          } else {
            message.error('库存不足');
          }
        }
        this.setKey();
      },
    );
  };

  setKey = () => {
    let code = '';
    const selectChar = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'G', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    for (let i = 0; i < 16; i++) {
      const charIndex = Math.floor(Math.random() * 32);
      code += selectChar[charIndex];
    }
    if (code.length !== 16) {
      this.setKey();
    }
    this.setState({
      key: code,
    });
  };

  handleCancel = () => {
    const { form: { resetFields }, onCancel } = this.props;
    resetFields();
    onCancel();
  };

  render() {
    const { form: { getFieldDecorator }, visible, ExportStoreModel: { storeDetail } } = this.props;
    return (
      <Modal
        title="新建出库记录"
        visible={visible}
        onOk={this.handleSubmit}
        onCancel={this.handleCancel}
      >
        <Form style={{ marginTop: 8 }}>
          <Row>
            <Col span={24}>
              <FormItem
                {...Layout}
                label="出库数量"
              >
                {getFieldDecorator('num', {
                  initialValue: '',
                  rules: [
                    {
                      whitespace: true,
                      required: true,
                      max: storeDetail.stock,
                      message: '请输入出库数量',
                    },
                  ],
                })(<Input style={{ width: '90%' }} placeholder="请输入出库数量" />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default ExportDetail;
