import {message} from 'antd';
import * as StoreServiece from '@/services/StoreService/StoreService';

export default {
  namespace:'PublicStoreModel',
  state:{
    data:[],
    topData:[],
    user:[],
    pagination:{currentPage: 1,
      pageSize: 10,},
    storeDetail:{}
  },

  effects:{
    *fetch({payload},{call,put}){
      const response=yield call(StoreServiece.getStoreList,payload);
      const { data } = response;
      yield put({
        type:'save',
        payload:{
          data
        }
      })
    },
    *getUser({payload},{call,put}){
      const response = yield call(StoreServiece.getUser, payload);
      const {data}=response;
      if(response.code===0){
        yield put({
          type:'save',
          payload:{
            user:data,
          }
        })
      }
    },
    *getStoreDetail({payload},{call,put}){
      const response = yield call(StoreServiece.getStoreDetail, payload);
      if(response.code===0){
        const {data}=response;
        yield put({
         type:'saveDetail',
         payload:data
       })
      }
    },
    *addStore({payload},{call,put}){
      const response = yield call(StoreServiece.addStore, payload.data);
      if(response.code===0){
        message.success('新建成功');
        yield put({
          type: 'fetch',
        });
      } else{
        message.error('新建失败')
      }
    },
    *editStore({payload},{call,put}){
      const response = yield call(StoreServiece.editStore, payload.data);
      if(response.code===0){
        message.success('修改成功');
        yield put({
          type: 'fetch',
        });
      } else{
        message.error('修改失败')
      }
    },
    *delStore({payload},{call,put}){
      const response = yield call(StoreServiece.delStore, payload.data);
      if(response.code===0){
        message.success('删除成功');
        yield put({
          type: 'fetch',
        });
      } else{
        message.error('删除失败')
      }
    },
  },

  reducers:{
    save(state,{payload}){
      return(
        {
          ...state,
          ...payload,
        }
      )
    },
    saveEditId(state,{payload}){
      return {
        ...state,
      ...payload
      }
    },
    saveDetail(state,{payload}){
      return {
        ...state,
        storeDetail:payload
      }
    },
  },
}
