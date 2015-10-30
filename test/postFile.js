/* eslint-env mocha */
'use strict';

function rootRequire (name) {
  return require(__dirname + '/../' + name);
}

var mockery = require('mockery');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var requestPromise;
var oneskyUtils;
var defaultOptions;

chai.use(sinonChai);
describe('POST translations with wrong credentials', function () {
  before(function () {
    mockery.registerMock('request-promise', function () {
      return requestPromise;
    });
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    oneskyUtils = rootRequire('index.js');
  });

  after(function () {
    mockery.deregisterSubstitute('request-promise');
    mockery.disable();
  });

  beforeEach(function () {
    defaultOptions = {
      language: 'pl',
      projectId: 'projectId',
      secret: 'secret',
      apiKey: 'apiKey',
      format: 'HIERARCHICAL_JSON',
      fileName: 'app-translation.json',
      content: JSON.stringify({toTranslate: 'Hey there'}),
      keepStrings: false
    };
  });

  it('Return error request fails with 400', function () {
    requestPromise = new Promise(function (resolve, reject) {
      reject({
        response: {
          body: '{ message: \'Unable to upload document\', code: 400 }'
        }
      });
    });

    oneskyUtils.postFile(defaultOptions)
      .then(function (data) {
        expect(data).to.be.undefined;
      })
      .catch(function (error) {
        expect(error.code).to.equal(400);
        expect(error.message).to.equal('Unable to upload document');
      });
  });

  it('Return success on valid content', function (done) {
    var successCallback = sinon.spy();
    var errorCallback = sinon.spy();

    requestPromise = new Promise(function (resolve, reject) {
      resolve({
        response: {
          body: '{"meta":{"status":201},"data":{}}'
        }
      });
    });

    oneskyUtils.postFile(defaultOptions)
      .then(successCallback, errorCallback)
      .then(function () {
        expect(errorCallback).to.not.have.been.calledOnce;
        expect(successCallback).to.have.been.calledOnce;
      })
      .then(done)
      .catch(done);
  });
});
