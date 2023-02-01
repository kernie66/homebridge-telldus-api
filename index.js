'use strict';

const HomebridgeTelldusApi = require('./HomebridgeTelldusApi');
const {
  requestHandler,
  responseHandler,
  errorHandler,
} = require('./utils/apiHandlers');
const process = require('process');
const checkStatusCode = require('./utils/checkStatusCode');

const supportedCommands = {
  on: 0x0001, // 1
  off: 0x0002, // 2
  bell: 0x0004, // 4
  // toggle: 0x0008, // 8
  dim: 0x0010, // 16
  // learn: 0x0020, // 32
  //execute: 0x0040, // 64
  // up: 0x0080, // 128
  //down: 0x0100, // 256
  //stop: 0x0200, // 512
};

const accessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImF1ZCI6ImhvbWVicmlkZ2UtdGVsbGR1cy10b28iLCJleHAiOjE3MDE2MzkzNTl9.eyJyZW5ldyI6dHJ1ZSwidHRsIjozMTUzNjAwMH0.X_H2N8fZY1bZ0d7f5c8unNChUh3oD6B3y_rY2ylQTNo';
//const host = 'kernie.asuscomm.com:8118';
const host = '192.168.1.118';

this.success = 'Yes, it works';
try {
  this.telldusApi = new HomebridgeTelldusApi(host, accessToken);
  this.telldusApi.setRequestHandler(requestHandler.bind(this));
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
console.log('URL:', this.telldusApi.getUrl);
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
    response = await apiClient.getSensorInfo(100);
    if (response.ok) {
      console.log('Sensor info:', response.body);
    } else {
      checkStatusCode(response);
    }
    response = await apiClient.listDevices(
      apiClient.setSupportedMethods(supportedCommands)
    );
    if (response.ok) {
      console.log('Devices:', response.body.device);
    } else {
      checkStatusCode(response);
    }
    //    response = await apiClient.onOffDevice(14, 0);
    //    console.log('Off:', response.body.status);
    response = await apiClient.bellDevice(130);
    console.log('Bell:', response.body.status);
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
}
