'use strict';

function errorHandler(error) {
  console.log(
    'Telldus request %d: Error = %s %s',
    error.request.id,
    error.request.method,
    error.request.resource
  );
  console.log(
    'Telldus request %d: Error = %d, %s',
    error.request.id,
    error.statusCode,
    error.statusMessage
  );
}

function requestHandler(request) {
  console.log(
    'Telldus request %d: Request = %s, Resource = %s',
    request.id,
    request.method,
    request.resource
  );
  console.log(
    'Telldus request %d: Request = %s, URL = %s',
    request.id,
    request.method,
    request.url
  );
  console.log('Bind test:', this.success);
}

function responseHandler(response) {
  console.log(
    'Telldus response %d: Status = %s, %s',
    response.request.id,
    response.statusCode,
    response.statusMessage
  );
  console.log(
    'Telldus response %d: Body = %s',
    response.request.id,
    response.body
  );
}

module.exports.errorHandler = errorHandler;
module.exports.requestHandler = requestHandler;
module.exports.responseHandler = responseHandler;
