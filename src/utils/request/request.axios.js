import axios from 'axios';
import { handleStatusError } from './checkStatus';
import checkCode from './checkCode';

export default function axiosRequest(url, options, headerConfig) {
  let config = {};
  config = {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    responseType: 'json',
  };
  const newOptions = { ...config, ...options};

  newOptions.url = url;
  if ('method' in newOptions) {
    newOptions.method = newOptions.method.toUpperCase();
  } else {
    newOptions.method = 'GET';
  }

  if (newOptions.method !== 'GET') {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.data = JSON.stringify(newOptions.body);
    } else {
      newOptions.data = newOptions.body;
    }
  } else {
    newOptions.params = newOptions.body;
  }

  return axios(newOptions).then(response =>
    checkCode(url, response)
  ).catch(handleStatusError);
}
