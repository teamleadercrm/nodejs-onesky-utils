'use strict';
module.exports = {
  getDevHash: _getDevHash,
  handleError: _handleError
};

var md5 = require('MD5');

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
