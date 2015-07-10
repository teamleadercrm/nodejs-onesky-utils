'use strict';
module.exports = {
  getFile: getFile
};

var request = require('request-promise'),
  md5 = require('MD5'),
  queryString = require('querystring'),
  apiAddress = "https://platform.api.onesky.io/";

/**
 * Get translations file form service
 * @param  {Object} options
 * @param  {Number} options.projectId Project ID
 * @param  {String} options.secret Private key to OneSky API
 * @param  {String} options.apiKey Public key to OneSky API
 * @param  {String} options.language Language to download
 * @param  {String} options.fileName File name to download
 */
function getFile(options) {
  options.hash = _getDevHash(options.secret);
  return _getTranslation(_getLink(options));
}

/**
 * @param  {String}   url
 * @param  {String}   language
 * @private
 */
function _getTranslation(url) {
  return request(url).catch(_handleError);
}

/**
 * @param  {String} secret
 * @return {Object}
 * @private
 */
function _getDevHash(secret) {
  var timestamp = Math.floor(new Date().getTime() / 1000);
  return {
    devHash: md5(timestamp + secret),
    timestamp: timestamp
  };
}

/**
 * @param  {Object} options
 * @return {String}
 * @private
 */
function _getLink(options) {
  return apiAddress + "/1/projects/" + options.projectId + "/translations?" + queryString.stringify({
    locale: options.language,
    api_key: options.apiKey,
    timestamp: options.hash.timestamp,
    dev_hash: options.hash.devHash,
    source_file_name: options.fileName
  });
}

/**
 * @param  {Object} data
 * @private
 */
function _handleError(data) {
  var error = {};
  return new Promise(function(resolve, reject) {
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
      error.message = "Unable to download file";
      error.code = 500;
    }

    reject(error);
  });
}
