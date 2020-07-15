import { message } from 'antd';
import { register } from '../../../services/register';

export default {
  namespace: 'register',

  state: {
    status: undefined,
  },

  effects: {
    * register({ payload }, { call, put }) {
      const response = yield call(register, payload);
      if (response.code === 0) {
        message.success('注册成功');
      }
    },
  },

  reducers: {
  },
};
