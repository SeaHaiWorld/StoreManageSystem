import {message} from 'antd';
import * as StoreDetailServiece from '@/services/StoreDetail/StoreDetail';

export default {
  namespace:'StoreDetailModel',
  state:{
    data:{},
    storeLogs:'',
    storeId:sessionStorage.getItem('store_id'),
  },

  effects:{
    *getStoreDetail({payload},{call,put}){
      const response=yield call(StoreDetailServiece.getStoreDetail,payload);
      if (response.code === 0){
        yield put({
          type:'save',
          payload:{
            data: response.data
          }
        })
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
  },
}
