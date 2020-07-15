import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Input, Row, Col, Form, Modal, message } from 'antd';
import { Layout } from '@/utils/globalUIConfig';

const FormItem = Form.Item;
@Form.create()
@connect(({ ImportStoreModel, loading }) => ({
  ImportStoreModel,
  AllLoading: loading.models.ImportStoreModel,
}))

class ImportDetail extends PureComponent {
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
    const { form: { validateFields }, dispatch, onCancel, ImportStoreModel: { storeDetail } } = this.props;
    validateFields((error, values) => {
        if (!error) {
          if (Number(storeDetail.stock) + Number(values.num) <= Number(storeDetail.max)) {
            const stock = Number(storeDetail.stock) + Number(values.num);
            dispatch({
              type: 'ImportStoreModel/addImport',
              payload: {
                data: { ...values, key, storeId: storeDetail.id },
              },
            });
            dispatch({
              type: 'ImportStoreModel/editStock',
              payload: {
                stock,
                id: storeDetail.id,
              },
            });
            const { form: { resetFields } } = this.props;
            resetFields();
            onCancel();
          } else {
            message.error('库存已满');
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
    const {
      form: { getFieldDecorator },
      visible, ImportStoreModel: { storeDetail },
    } = this.props;
    return (
      <Modal
        title="新建入库记录"
        visible={visible}
        onOk={this.handleSubmit}
        onCancel={this.handleCancel}
      >
        <Form style={{ marginTop: 8 }}>
          <Row>
            <Col span={24}>
              <FormItem
                {...Layout}
                label="入库数量"
              >
                {getFieldDecorator('num', {
                  initialValue: '',
                  rules: [
                    {
                      whitespace: true,
                      required: true,
                      max: storeDetail.stock,
                      message: '请输入入库数量',
                    },
                  ],
                })(<Input style={{ width: '90%' }} placeholder="请输入入库数量"/>)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default ImportDetail;
