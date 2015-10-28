
'use strict';

global.rootRequire = function (name) {
  return require(__dirname + '/' + name);
};

module.exports = {
  getFile: rootRequire('lib/getFile.js'),
  postFile: rootRequire('lib/postFile.js')
};
