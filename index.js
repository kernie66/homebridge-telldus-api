'use strict';

const HomebridgeTelldusApi = require('./HomebridgeTelldusApi');

const logResponse = true;
const accessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImF1ZCI6ImhvbWVicmlkZ2UtdGVsbGR1cy10b28iLCJleHAiOjE3MDE2MzkzNTl9.eyJyZW5ldyI6dHJ1ZSwidHRsIjozMTUzNjAwMH0.X_H2N8fZY1bZ0d7f5c8unNChUh3oD6B3y_rY2ylQTNo';
const host = 'kernie.asuscomm.com:8118';

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
}

function responseHandler(response) {
  if (logResponse) {
    console.log('Response:', response.body);
  }
}

try {
  this.telldusApi = new HomebridgeTelldusApi({
    host,
    accessToken,
    requestHandler,
    responseHandler,
    errorHandler,
  });
} catch (error) {
  console.log(error);
}
telldus(this.telldusApi);
return true

async function telldus(apiClient) {
  let response;
  response = await apiClient.getSystemInfo();
  console.log('Telldus system info:', response);
  response = await apiClient.listSensors();
  console.log('First sensor:', response[0], '\nID:', response[0].id);
  response = await apiClient.getSensorInfo(response[0].id);
  console.log('Sensor info:', response);
  response = await apiClient.listDevices();
  console.log('Devices:', response[0]);
  return response;
}
