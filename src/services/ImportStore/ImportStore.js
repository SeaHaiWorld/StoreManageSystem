import request from '@/utils/request/request';
// eslint-disable-next-line import/extensions
import { createTheURL } from '../../utils/utils';

const store = '/store'
export async function getImportList(params) {
  return request(createTheURL(store, 'import'), {
    method: 'POST',
    body:params
  });
}
export async function delImport(params) {
  return request(createTheURL(store,'delete'), {
    method: 'POST',
    body: params,
  });
}
export async function addImport(params) {
  return request(createTheURL(store,'addIm'), {
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
