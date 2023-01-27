'use strict';

const HomebridgeTelldusApi = require('./HomebridgeTelldusApi');
const {
  requestHandler,
  responseHandler,
  errorHandler,
} = require('./utils/apiHandlers');
const process = require('process');

const accessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImF1ZCI6ImhvbWVicmlkZ2UtdGVsbGR1cy10b28iLCJleHAiOjE3MDE2MzkzNTl9.eyJyZW5ldyI6dHJ1ZSwidHRsIjozMTUzNjAwMH0.X_H2N8fZY1bZ0d7f5c8unNChUh3oD6B3y_rY2ylQTNo';
//const host = 'kernie.asuscomm.com:8118';
const host = '192.168.1.118';

try {
  this.telldusApi = new HomebridgeTelldusApi(host, accessToken);
  this.telldusApi.setRequestHandler(requestHandler);
  this.telldusApi.setResponseHandler(responseHandler);
  this.telldusApi.setErrorHandler(errorHandler);
} catch (error) {
  console.error(
    'Error initialising the Telldus API\n',
    error.name,
    error.message
  );
  return false;
}
telldus(this.telldusApi);
return true;

async function telldus(apiClient) {
  let response;
  try {
    response = await apiClient.getSystemInfo();
    if (!response.ok) {
      if (!checkStatusCode(response)) {
        if (!response.body.product) {
          console.log(
            'Unknown response from Telldus, check if the host address is correct'
          );
        }
      }
      process.exit(1);
    }
    console.log('Telldus system info:', response.body);

    response = await apiClient.listSensors();
    const id = response.body.sensor[0].id;
    console.log(
      'First sensor:',
      response.body.sensor[0],
      '\nID:',
      id
    );
    response = await apiClient.getSensorInfo(id);
    console.log('Sensor info:', response.body);
    response = await apiClient.listDevices();
    console.log('Devices:', response.body.device[0]);
    response = await apiClient.onOffDevice(14, 0);
    console.log('Off:', response.body.status);
    response = await apiClient.bellDevice(130);
    console.log('Bell:', response);
    response = await apiClient.onOffDevice(14, 1);
    console.log('On:', response.body.status);
    response = await apiClient.dimDevice(186, 100);
    console.log('Dimmer:', response);
  } catch (error) {
    console.error(
      'Access failed to Telldus API\n',
      error.name,
      error.message,
      error
    );
  }
  return response;

  function checkStatusCode(response) {
    if (response.statusCode >= 400 && response.statusCode <= 499) {
      if (response.statusCode == 401) {
        console.error(
          'Access denied, check if the access token is valid'
        );
      } else if (response.statusCode == 404) {
        console.error(
          'Host API not found, check if the host address is correct'
        );
      } else if (response.statusCode == 408) {
        console.error(
          'Request timed out, check if the host address is correct'
        );
      } else {
        console.error(
          'Telldus reports client error %s, %s',
          response.statusCode,
          response.statusMessage
        );
      }
    } else if (
      response.statusCode >= 500 &&
      response.statusCode <= 599
    ) {
      console.error(
        'Telldus reports client error %s, %s',
        response.statusCode,
        response.statusMessage
      );
    } else {
      return false;
    }
    return true;
  }
}
