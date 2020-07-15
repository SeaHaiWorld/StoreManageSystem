import request from '@/utils/request/request';
// eslint-disable-next-line import/extensions
import Config from '../../../config/api';
import { createTheURL } from '../../utils/utils';

const store = '/store'
export async function getStoreList(params) {
  return request(createTheURL(store, 'list'), {
    method: 'POST',
    body:params
  });
}
export async function delStore(params) {
  return request(createTheURL(store,'delete'), {
    method: 'POST',
    body: params,
  });
}
export async function addStore(params) {
  return request(createTheURL(store,'add'), {
    method: 'POST',
    body:params
  });
}
export async function editStore(params) {
  return request(createTheURL(store,'update'), {
    method: 'POST',
    body:params
  });
};

export async function getStoreDetail(params) {
  return request(createTheURL('', Config.API.PRJECT_MSG_GET), {
    method: 'GET',
    body:params
  });
};
