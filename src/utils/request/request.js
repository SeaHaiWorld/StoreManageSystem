import requestAxios from './request.axios';


export default function request(url, options,headerConfig) {
  return requestAxios(url, options,headerConfig);
}
