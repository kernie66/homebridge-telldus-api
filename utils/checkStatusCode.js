function checkStatusCode(response) {
  if (response.body.error) {
    console.error('Telldus replies with error:', response.body.error);
  } else if (
    response.statusCode >= 400 &&
    response.statusCode <= 499
  ) {
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

module.exports = checkStatusCode;
