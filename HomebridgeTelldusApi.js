'use strict';

const homebridgeLib = require('homebridge-lib');
const querystring = require('qs');

function getPath(path, qs) {
  return qs ? `${path}?${querystring.stringify(qs)}` : path;
}

const commands = {
  on: 0x0001, // 1
  off: 0x0002, // 2
  bell: 0x0004, // 4
  toggle: 0x0008, // 8
  dim: 0x0010, // 16
  learn: 0x0020, // 32
  execute: 0x0040, // 64
  up: 0x0080, // 128
  down: 0x0100, // 256
  stop: 0x0200, // 512
};

const supportedMethods = Object.values(commands).reduce(
  (memo, num) => memo + num,
  0
);

class HomebridgeTelldusApi extends homebridgeLib.HttpClient {
  constructor({
    host = '127.0.0.1',
    accessToken = '',
    requestHandler = null,
    responseHandler = null,
    errorHandler = null,
  } = {}) {
    //    const checkedUrl = makeURL(host);
    //    if (!checkedUrl) {
    //      throw new TypeError('TelldusAPI: host not a valid value');
    //    }
    super();
    this.host = host;
    this.headers = { Authorization: `Bearer ${accessToken}` };

    console.log('Supported methods:', supportedMethods);
    console.log(
      'Querystring:',
      querystring.stringify({ supportedMethods })
    );
    try {
      this.apiClient = new homebridgeLib.HttpClient({
        https: false,
        host: this.host,
        headers: this.headers,
        json: true,
        maxSockets: 1,
        path: '/api/',
        timeout: 15, //this.config.timeout,
        validStatusCodes: [200, 401, 403, 404],
      });
      this.apiClient
        .on('error', (error) => {
          if (errorHandler) {
            errorHandler(error);
          }
        })
        .on('request', (request) => {
          if (requestHandler) {
            requestHandler(request);
          }
        })
        .on('response', (response) => {
          if (responseHandler) {
            responseHandler(response);
          }
        });
    } catch (error) {
      console.log(error);
    }

    // return this.apiClient;
  }

  async getSystemInfo() {
    const response = await this.apiClient.get('system/info');
    return response.body;
  }

  async listSensors() {
    const response = await this.apiClient.get('sensors/list');
    return response.body.sensor;
  }

  async getSensorInfo(id) {
    const response = this.apiClient.get(
      getPath('sensor/info', { id })
    );
    return response.body;
  }

  /*
  async setSensorName(id, name) {
    return this.request({
      path: '/sensor/setName',
      qs: { id, name },
    });
  }

  async setSensorIgnore(id, ignore) {
    return this.request({
      path: '/sensor/setIgnore',
      qs: { id, ignore },
    });
  }

  async listClients() {
    return this.request({ path: '/clients/list' });
  }
*/
  async listDevices() {
    const response = await this.apiClient.get('devices/list');
    //      qs: { supportedMethods },
    //    });
    return response.body.device;
  }

  /*
  async getDeviceInfo(id) {
    return this.request({
      path: '/device/info',
      qs: { id, supportedMethods },
    });
  }

  async addDevice(device) {
    return this.request({ path: '/device/setName', qs: device });
  }

  async deviceLearn(id) {
    return this.request({ path: '/device/learn', qs: { id } });
  }

  async setDeviceModel(id, model) {
    return this.request({
      path: '/device/setModel',
      qs: { id, model },
    });
  }

  async setDeviceName(id, name) {
    return this.request({
      path: '/device/setName',
      qs: { id, name },
    });
  }

  async setDeviceParameter(id, parameter, value) {
    return this.request({
      path: '/device/setParameter',
      qs: { id, parameter, value },
    });
  }

  async setDeviceProtocol(id, protocol) {
    return this.request({
      path: '/device/setProtocol',
      qs: { id, protocol },
    });
  }

  async removeDevice(id) {
    return this.request({ path: '/device/remove', qs: { id } });
  }

  async bellDevice(id) {
    return this.request({ path: '/device/bell', qs: { id } });
  }

  async dimDevice(id, level) {
    return this.request({ path: '/device/dim', qs: { id, level } });
  }

  async onOffDevice(id, on) {
    return this.request({
      path: `/device/turn${on ? 'On' : 'Off'}`,
      qs: { id },
    });
  }

  async stopDevice(id) {
    return this.request({ path: '/device/stop', qs: { id } });
  }

  async upDownDevice(id, up) {
    return this.request({
      path: `/device/${up ? 'up' : 'down'}`,
      qs: { id },
    });
  }

  async commandDevice(id, command, value) {
    if (!commands[command])
      throw new Error('Invalid command supplied');
    return this.request({
      path: '/device/command',
      qs: { id, method: command, value },
    });
  }

  async listEvents() {
    return this.request({ path: '/events/list' });
  } */
}

module.exports = HomebridgeTelldusApi;
