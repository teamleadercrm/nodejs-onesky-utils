
'use strict';

module.exports = {
  getDevHash: _getDevHash,
  handleError: _handleError,
  makeRequest: _makeRequest
};

var md5 = require('md5');
var request = require('request-promise');

/**
 * @param  {String} secret
 * @return {Object}
 * @private
 */
function _getDevHash (secret) {
  var timestamp = Math.floor(Date.now() / 1000);
  return {
    devHash: md5(timestamp + secret),
    timestamp: timestamp
  };
}

/**
 * @param  {String|Object}   options URL to get from or object with request config
 * @param  {String}          message Error message
 * @private
 */
function _makeRequest (options, message) {
  return request(options).catch(
    _handleError.bind(undefined,
    message)
  );
}

/**
 * @param  {Object} data
 * @private
 */
function _handleError (message, data) {
  var error = {};
  return new Promise(function (resolve, reject) {
    try {
      var content = JSON.parse(data.response.body);
      if (content.meta) {
        error.message = content.meta.message;
        error.code = content.meta.status;
      } else {
        error.message = content.message;
        error.code = content.code;
      }
    } catch (e) {
      error.message = message;
      error.code = 500;
    }

    reject(error);
  });
}
