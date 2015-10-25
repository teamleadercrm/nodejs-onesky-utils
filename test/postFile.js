/* eslint-env mocha */
'use strict';

var mockery = require('mockery');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var requestPromise;
var onesky_utils;
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

    onesky_utils = require(__dirname + '/../index.js');
  });

  after(function () {
    mockery.deregisterSubstitute('request-promise');
    mockery.disable();
  });

  beforeEach(function () {
    defaultOptions = {
      language: 'pl',
      fileFormat: 'HIERARCHICAL_JSON',
      projectId: 'projectId',
      secret: 'secret',
      apiKey: 'apiKey',
      format: 'HIERARCHICAL_JSON',
      fileName: 'app-translation.json',
      content: JSON.stringify({toTranslate: 'Hey there'}),
      keepStrings: false,
      callback: function () {}
    };
  });

  it('Return error when request fails with 500', function () {
    requestPromise = new Promise(function (resolve, reject) {
      reject({
        response: {
          body: '{ message: \'Unable to upload document\', code: 500 }'
        }
      });
    });

    onesky_utils.postFile(defaultOptions)
      .then(function (data) {
        expect(data).to.be.undefined;
      })
      .catch(function (error) {
        expect(error.code).to.equal(500);
        expect(error.message).to.equal('Unable to upload document');
      });
  });

  it('Return error request fails with 400', function () {
    requestPromise = new Promise(function (resolve, reject) {
      reject({
        response: {
          body: '{ message: \'Unable to upload document\', code: 400 }'
        }
      });
    });

    onesky_utils.postFile(defaultOptions)
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

    onesky_utils.postFile(defaultOptions)
      .then(successCallback, errorCallback)
      .then(function () {
        expect(errorCallback).to.not.have.been.calledOnce;
        expect(successCallback).to.have.been.calledOnce;
      })
      .then(done)
      .catch(done);
  });
});
