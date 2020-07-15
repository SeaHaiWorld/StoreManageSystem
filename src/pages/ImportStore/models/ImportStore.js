import { message } from 'antd';
import * as ImportStoreService from '@/services/ImportStore/ImportStore';

export default {
  namespace: 'ImportStoreModel',
  state: {
    data: [],
    storeId: '',
    user: [],
    pagination: {
      currentPage: 1,
      pageSize: 10,
    },
    storeDetail: {},
  },

  effects: {
    * fetch({ payload }, { call, put }) {
      const response = yield call(ImportStoreService.getImportList, payload);
      const { data } = response;
      yield put({
        type: 'save',
        payload: {
          data,
        },
      });
    },
    * getUser({ payload }, { call, put }) {
      const response = yield call(ImportStoreService.getUser, payload);
      const { data } = response;
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            user: data,
          },
        });
      }
    },
    * getStoreDetail({ payload }, { call, put }) {
      const response = yield call(ImportStoreService.getStoreDetail, payload);
      if (response.code === 0) {
        const { data } = response;
        yield put({
          type: 'saveDetail',
          payload: data,
        });
      }
    },
    * addImport({ payload }, { call }) {
      const response = yield call(ImportStoreService.addImport, payload);
      if (response.code === 0) {
        message.success('新建入库记录成功');
      } else {
        message.error('新建入库记录失败');
      }
    },
    * editStock({ payload }, { call, put }) {
      const response = yield call(ImportStoreService.editStock, payload);
      if (response.code === 0) {
        message.success('修改库存成功');
        yield put({
          type: 'fetch',
          payload:{
            storeId:payload.id
          }
        });
      } else {
        message.error('修改库存失败');
      }
    },

    * delImport({ payload }, { call, put }) {
      const response = yield call(ImportStoreService.delImport, payload);
      if (response.code === 0) {
        message.success('删除成功');
        yield put({
          type: 'fetch',
        });
      } else {
        message.error('删除失败');
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return (
        {
          ...state,
          ...payload,
        }
      );
    },
    saveDetail(state, { payload }) {
      return {
        ...state,
        storeDetail: payload,
      };
    },
  },
};
