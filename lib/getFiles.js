'use strict';

var queryString = require('querystring');

var _private = rootRequire('lib/privateFunctions.js');
var _globals = rootRequire('lib/globals.js');

var apiAddress = _globals.apiAddress;

/**
 * Get all translations files from service
 * @param  {Object} options
 * @param  {Number} options.projectId Project ID
 * @param  {String} options.secret Private key to OneSky API
 * @param  {String} options.apiKey Public key to OneSky API
 * @param  {Number} options.page Page number to retrieve
 * @param  {Number} options.perPage How many items a page should contain
 */
function getFiles (options) {
  options.hash = _private.getDevHash(options.secret);
  return _private.makeRequest(_getLink(options),
    'Unable to fetch project files');
}

/**
 * @param  {Object} options
 * @return {String}
 * @private
 */
function _getLink (options) {
  var link = apiAddress + '/1/projects/' + options.projectId + '/files?' + queryString.stringify({
    api_key: options.apiKey,
    timestamp: options.hash.timestamp,
    dev_hash: options.hash.devHash,
  });

  if (options.page) {
    link += '&' + queryString.stringify({ page: options.page });
  }

  if (options.perPage) {
    link += '&' + queryString.stringify({ per_page: options.perPage });
  }

  return link;
}

module.exports = getFiles;
