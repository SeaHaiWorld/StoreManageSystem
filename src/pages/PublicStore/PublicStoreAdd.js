import {connect} from 'dva';
import React,{PureComponent} from 'react';
import { Input, Row, Col, Form ,Modal} from 'antd';
import AdvancedSelect from '../../components/AdvancedSelect';
import { Status } from '@/utils/Enum';

const FormItem = Form.Item;
@Form.create()
@connect(({PublicStoreModel,loading})=>({
  PublicStoreModel,
  AllLoading: loading.models.PublicStoreModel,
}))

class PublicStoreAdd extends PureComponent{
  constructor(props){
    super(props);
    this.state={
    }
  }

  handleSubmit = () => {
    const { form: { validateFields },dispatch,onCancel,drawStyle,storeDetail} = this.props;
    validateFields((error,values)=>{
      if(!error){
        let status='';
        const { stock, max } = values;
        switch (drawStyle) {
          case 'add':
            status=stock/max<=Status.LIMIT?Status.URGE:Status.DEFAULT;
            dispatch({
              type:'PublicStoreModel/addStore',
              payload:{
                data:{...values,status},
              }
            });
            break;
          case 'edit':
            status=stock/max<=Status.LIMIT?Status.URGE:Status.DEFAULT;
            dispatch({
              type:'PublicStoreModel/editStore',
              payload:{
                data:{...values,status,id:storeDetail.id},
              }
            });
            break;
          default:
            break
        }
        onCancel();
        const { form: { resetFields } } = this.props;
        resetFields();
      }
    });
  };

  handleCancel = () => {
    const { form: { resetFields }, onCancel } = this.props;
    resetFields();
    onCancel();
  };

  render(){
    const {
      form: { getFieldDecorator },
      visible,
      drawStyle,
      storeDetail,
      user,
    }=this.props;
    switch (drawStyle) {
      case 'edit':
        return(
          <Modal
            title="修改仓库"
            visible={visible}
            onOk={this.handleSubmit}
            onCancel={this.handleCancel}
          >
            <Form style={{ marginTop : 8 }}>
              <Row>
                <Col span={12}>
                  <FormItem label="仓库名称">
                    {getFieldDecorator('storeName', {
                      initialValue :storeDetail.storeName||'',
                      rules : [
                        {
                          required : true,
                          whitespace:true,
                          max:11,
                          message : '请输入仓库名称',
                        },
                      ],
                    })(<Input style={{ width: "90%"}} placeholder="请输入仓库名称" />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="储物种类">
                    {getFieldDecorator('type', {
                      initialValue : storeDetail.type||undefined,
                      rules : [
                        {
                          required : true,
                          message : '请输入储物种类',
                        },
                      ],
                    })(<Input style={{ width: "90%"}} placeholder="请输入储物种类" />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <FormItem label="仓库库存">
                    {getFieldDecorator('stock', {
                      initialValue : storeDetail.stock||undefined,
                      rules : [
                        {
                          required : true,
                          message : '请输入仓库库存',
                        },
                      ],
                    })(<Input style={{ width: "90%"}} placeholder="请输入仓库库存" />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="最大容量">
                    {getFieldDecorator('max', {
                      initialValue : storeDetail.max||undefined,
                      rules : [
                        {
                          required : true,
                          message : '请输入库存最大容量',
                        },
                      ],
                    })(<Input style={{ width: "90%"}} placeholder="请输入库存最大容量" />)}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Modal>
        );
      case 'add':
        return(
          <Modal
            title="新建仓库"
            visible={visible}
            onOk={this.handleSubmit}
            onCancel={this.handleCancel}
          >
            <Form style={{ marginTop : 8 }}>
              <Row>
                <Col span={12}>
                  <FormItem label="仓库名称">
                    {getFieldDecorator('storeName', {
                      initialValue :'',
                      rules : [
                        {
                          required : true,
                          whitespace:true,
                          max:11,
                          message : '请输入仓库名称',
                        },
                      ],
                    })(<Input style={{ width: "90%"}} placeholder="请输入仓库名称" />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="储物种类">
                    {getFieldDecorator('type', {
                      initialValue :'',
                      rules : [
                        {
                          required : true,
                          message : '请输入储物种类',
                        },
                      ],
                    })(<Input style={{ width: "90%"}} placeholder="请输入储物种类" />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <FormItem label="仓库库存">
                    {getFieldDecorator('stock', {
                      initialValue : '',
                      rules : [
                        {
                          required : true,
                          message : '请输入仓库库存',
                        },
                      ],
                    })(<Input style={{ width: "90%"}} placeholder="请输入仓库库存" />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="最大容量">
                    {getFieldDecorator('max', {
                      initialValue : '',
                      rules : [
                        {
                          required : true,
                          message : '请输入最大容量',
                        },
                      ],
                    })(<Input style={{ width: "90%"}} placeholder="请输入最大容量" />)}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Modal>
        );
      default:
        return <div />;
    }
  }
}
export default PublicStoreAdd;
