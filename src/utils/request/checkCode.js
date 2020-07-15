import { notification } from 'antd';
import handleResponse from './response';
import { handleError } from './checkStatus';
import { WHITELIST_CODE } from '../Enum';

export default function checkCode(url, response) {
  const { data } = response;
  if (data.code) {
    if (!WHITELIST_CODE.some((current) => current === data.code)) {
      notification.error({
        message: `请求错误 ${data.code}`,
        description: data.msg,
      });
    }
  }
  return handleResponse(url, response);
}


