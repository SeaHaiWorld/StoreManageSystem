import request from '@/utils/request/request';
// eslint-disable-next-line import/extensions
import Config from '../../../config/api';
import { createTheURL } from '../../utils/utils';

const store = '/store'
export async function getStoreDetail(params) {
  return request(createTheURL(store, 'id'), {
    method: 'POST',
    body:params
  });
};

export async function getShareId(params){
  return request(createTheURL(Config.API.PRJECT_MSG,Config.API.SHAREID_GET),{
    method:'POST',
    body:params
  });
}

export async function getLogList(params){
  return request(createTheURL(Config.API.PRJECT_LOG,'list'),{
    method:'POST',
    body:params
  });
}

export async function getLogDetail(params){
  return request(createTheURL('',Config.API.PRJECT_LOG_GET),{
    method:'GET',
    body:params
  });
}
