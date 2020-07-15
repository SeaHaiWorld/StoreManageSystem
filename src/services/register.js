import request from '@/utils/request/request';
import { createTheURL } from '../utils/utils';

const login = '/login'
export async function register(params) {
  return request(createTheURL(login, 'register'), {
    method: 'POST',
    body:params
  });
}

