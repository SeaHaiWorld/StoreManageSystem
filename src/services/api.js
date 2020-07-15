import request from '../utils/request/request';

export async function accountLogin(params) {
  return request(`http://127.0.0.1:8361/login`, {
      method : 'POST',
      body : params,
    },
  );
}
