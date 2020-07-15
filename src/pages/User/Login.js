import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Alert, Input, Button, Row, Col, Form, message } from 'antd';
import Login from '@/components/Login';
import styles from './Login.less';

const { Tab, UserName, Password, Submit } = Login;
const FormItem = Form.Item;

@Form.create()
@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    captcha: '',
  };

  componentDidMount = () => {
    this.getCaptcha();
  };

  getCaptcha = () => {
    let code = '';
    const CaptchaArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'G', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    for (let i = 0; i < 4; i++) {
      code += CaptchaArr[Math.floor(Math.random() * 32)];
    }
    if (code.length !== 4) this.getCaptcha();
    this.setState({
      captcha: code,
    });
  };

  handleSubmit = (err, userInfo) => {
    const { captcha } = this.state;
    const { form: { validateFields } } = this.props;
    validateFields((errors, values) => {
      if (!errors) {
        if (values.InputCaptcha.toUpperCase() != captcha) {
          message.error('验证码错误');
          this.getCaptcha();
        } else if (!err) {
          const { dispatch } = this.props;
          dispatch({
            type: 'login/login',
            payload: {
              ...userInfo,
              password: userInfo.password,
            },
          });
          this.getCaptcha();
        }
      }
    });
  };

  render() {
    const { login, submitting } = this.props;
    const { captcha } = this.state;
    const { form: { getFieldDecorator } } = this.props;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey="account"
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab="账户密码登录">
            {login.status === 'error' &&
            login.type === 'account' &&
            !submitting &&
            <Alert style={{ marginBottom: 24 }} message={'账户或密码错误'} type="error" showIcon/>}
            <UserName
              name="username"
              placeholder="用户名"
              rules={[{ required: true, message: '请输入用户名!', }]}
            />
            <Password
              name="password"
              placeholder="密码"
              rules={[{ required: true, message: '请输入密码!', }]}
              onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
            />
            <Row>
              <Col span={16}>
                <FormItem>
                  {getFieldDecorator('InputCaptcha', {
                    rules: [{required: true,message: '请输入验证码'}]
                  })(
                    <Input size="large" placeholder="请输入验证码"/>,
                  )}
                </FormItem>
              </Col>
              <Col span={1}/>
              <Col span={7}>
                <Button block size='large' id="getCaptcha" onClick={this.getCaptcha} style={{ 'color': '#1890FF' }}>
                  {captcha}
                </Button>
              </Col>
            </Row>
          </Tab>
          <div/>
          <Submit loading={submitting}>登录</Submit>
          <div className={styles.other}>
            <Link className={styles.register} to="/user/register">注册账户</Link>
          </div>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
