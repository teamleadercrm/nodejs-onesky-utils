# nodejs-onesky-utils [![Build Status](https://travis-ci.org/brainly/nodejs-onesky-utils.svg?branch=master)](https://travis-ci.org/brainly/nodejs-onesky-utils) [![Code Climate](https://codeclimate.com/github/brainly/nodejs-onesky-utils/badges/gpa.svg)](https://codeclimate.com/github/brainly/nodejs-onesky-utils) [![npm version](https://badge.fury.io/js/onesky-utils.svg)](http://badge.fury.io/js/onesky-utils)
Node.js utils for working with [OneSky](http://www.oneskyapp.com/) translation service.

## Example

### getFile

```
var onesky = require('onesky-utils');

var options = {
  language: 'en_EN',
  secret: '1234567',
  apiKey: 'abcdefg',
  projectId: '123',
  fileName: 'translations.po'
};

onesky.getFile(options).then(function(content) {
  console.log(content);
}).catch(function(error) {
  console.log(error);
});
```

### postFile

```
var onesky = require('onesky-utils');

var options = {
  language: 'en-US',
  secret: '1234567',
  apiKey: 'abcdefg',
  projectId: '123',
  fileName: 'translations.json',
  format: 'HIERARCHICAL_JSON',
  content: JSON.stringify(translations),
  keepStrings: true
};

onesky.postFile(options).then(function(content) {
  console.log(content);
}).catch(function(error) {
  console.log(error);
});
```

## Install

```
$ npm install onesky-utils
```

## API

### getFile(options)
Downloads translation file from OneSky.

Returns file content via promise.

The `options` object is required. Options include:

- **options.projectId** - numerical ID of the project
- **options.fileName** - name of the translation file
- **options.language** - language version
- **options.secret** - secret and apiKey are used for authentication
- **options.apiKey**

### postFile(options)
Uploads translation file to OneSky.

Returns response content via promise.

The `options` object is required. Options include:

- **options.projectId** - numerical ID of the project
- **options.fileName** - name of the translation file
- **options.language** - language version
- **options.format** - file format ([list here](https://github.com/onesky/api-documentation-platform/blob/master/reference/format.md))
- **options.content** string with the content of the file
- **options.keepStrings** boolean saying if already uploaded strings not present on this file should be deprecated or keept
- **options.secret** - secret and apiKey are used for authentication
- **options.apiKey**


## Tests

```
$ npm test
```

## License

[MIT](./LICENSE)
