import request from '@/utils/request/request';
import { GLOBAL_URL } from '@/utils/ip';
import Config from '../../config/api';
import { createTheURL } from '../utils/utils';

export async function getAllList() {
  return request(createTheURL(Config.API.PERMISSIONS, 'listall'), {
    method: 'GET',
  });
}
export async function addChildMenu(params) {
  return request(createTheURL(Config.API.PERMISSIONS, 'add'), {
    method: 'POST',
    body:params
  });
}
export async function delChooseMenu(params) {
  return request(createTheURL(Config.API.PERMISSIONS, 'del'), {
    method: 'GET',
    body:params
  });
}
export async function updateChooseMenu(params) {
  return request(createTheURL(Config.API.PERMISSIONS, 'edit'), {
    method: 'POST',
    body:params
  });
}
export async function getMenu(params) {
  return request(createTheURL(Config.API.PERMISSIONS, 'get'), {
    method: 'GET',
    body:params
  });
}
