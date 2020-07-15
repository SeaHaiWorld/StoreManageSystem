import { query as queryUsers } from '@/services/user';
import { queryCurrent } from '@/services/api';
import { routerRedux } from 'dva/router';
import {message} from 'antd'
const code = 0;
const currentUser = {
  name : '管理员',
  unreadCount : 8,
  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
};
export default {
  namespace : 'user',

  state : {
    list : [],
    code:0,
  },

  effects : {
    * fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type : 'save',
        payload : response,
      });
    },
    * fetchCurrent(_, { call, put }) {
      if (code === 0) {
        let _currentUser=currentUser;
        yield put({
          type : 'saveCurrentUser',
          payload : _currentUser,
        });
      }
      else{
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers : {
    save(state, action) {
      return {
        ...state,
        list : action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser : action.payload || {},
      };
    },
    saveUserData(state,action){
      return{
        ...state,
        userData:action.payload,
      }
    },
    saveShareInfo(state,action){
      return{
        ...state,
        shareInfo:action.payload
      }
    }
  },
};
