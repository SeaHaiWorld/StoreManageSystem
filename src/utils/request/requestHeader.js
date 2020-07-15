export const REQUEST_HEADER_LIST = {
  WITH_OUT_TOKEN_TYPE: 'WITH_OUT_TOKEN_TYPE',
  FILE_DOWN_TYPE: 'FILE_DOWN_TYPE',
  IMAGE_TYPE: 'IMAGE_TYPE',
  FILE_UPLOAD_TYPE: 'FILE_UPLOAD_TYPE',
  EXPORT_TYPE: 'EXPORT_TYPE',
  DEFAULT: 'DEFAULT',
};

export function getHeaderObject() {
  let config = {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    withCredentials: true,
    credentials: 'same-origin',
    responseType: 'json',
  }
  return config;
}
