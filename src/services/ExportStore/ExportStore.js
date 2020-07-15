import request from '@/utils/request/request';
// eslint-disable-next-line import/extensions
import Config from '../../../config/api';
import { createTheURL } from '../../utils/utils';

const store = '/store'
export async function getExportList(params) {
  return request(createTheURL(store, 'export'), {
    method: 'POST',
    body:params
  });
}
export async function delExport(params) {
  return request(createTheURL(store,'delete'), {
    method: 'POST',
    body: params,
  });
}
export async function addExport(params) {
  return request(createTheURL(store,'addEx'), {
    method: 'POST',
    body:params
  });
}
export async function editStock(params) {
  return request(createTheURL(store,'update'), {
    method: 'POST',
    body:params
  });
};

export async function getStoreDetail(params) {
  return request(createTheURL(store, 'id'), {
    method: 'POST',
    body:params
  });
};
