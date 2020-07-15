export default function handleResponse(url, response) {
  const { statusText, status, data: resultData, data } = response;
  return Promise.resolve({
    success: data.code,
    message: statusText,
    statusCode: status,
    ...resultData,
  });
}
