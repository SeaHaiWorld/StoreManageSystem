import { message } from 'antd';
import * as ExportStoreService from '@/services/ExportStore/ExportStore';

export default {
  namespace: 'ExportStoreModel',
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
      const response = yield call(ExportStoreService.getExportList, payload);
      const { data } = response;
      yield put({
        type: 'save',
        payload: {
          data,
        },
      });
    },
    * getUser({ payload }, { call, put }) {
      const response = yield call(ExportStoreService.getUser, payload);
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
      const response = yield call(ExportStoreService.getStoreDetail, payload);
      if (response.code === 0) {
        const { data } = response;
        yield put({
          type: 'saveDetail',
          payload: data,
        });
      }
    },
    * addExport({ payload }, { call }) {
      const response = yield call(ExportStoreService.addExport, payload);
      if (response.code === 0) {
        message.success('新建出库记录成功');
      } else {
        message.error('新建出库记录失败');
      }
    },
    * editStock({ payload }, { call, put }) {
      const response = yield call(ExportStoreService.editStock, payload);
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

    * delExport({ payload }, { call, put }) {
      const response = yield call(ExportStoreService.delExport, payload);
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
