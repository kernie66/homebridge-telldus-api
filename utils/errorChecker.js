'use strict';

function errorChecker(apiClient, error) {
  error = apiClient.getLastResponse();
  if (!error) {
    error = apiClient.getLastError();
  }
  return error.statusCode ? error.statusCode : 500;
}

module.exports = errorChecker;
