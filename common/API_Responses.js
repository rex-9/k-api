function createResponse(statusCode, data = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Origin': '*',
  };

  return {
    headers,
    statusCode,
    body: JSON.stringify(data),
  };
}

export const Responses = {
  _200: (data = {}) => createResponse(200, data),
  _201: (data = {}) => createResponse(201, data),
  _204: (data = {}) => createResponse(204, data),
  _400: (data = {}) => createResponse(400, data),
  _401: (data = {}) => createResponse(401, data),
  _405: (data = {}) => createResponse(405, data),
  _404: (data = {}) => createResponse(404, data),
  _409: (data = {}) => createResponse(409, data),
  _500: (data = {}) => createResponse(500, data),
};
