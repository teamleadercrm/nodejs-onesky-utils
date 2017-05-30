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
describe('GET languages list with wrong credentials', function () {
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
      projectId: 'projectId',
      secret: 'secret',
      apiKey: 'apiKey'
    };
  });

  it('Return error when request fails', function () {
    requestPromise = new Promise(function (resolve, reject) {
      reject({
        response: {
          body: '{"meta":{"status":400,"message":"Invalid source file"},"data":{}}'
        }
      });
    });

    oneskyUtils.getLanguages(defaultOptions)
      .then(function (data) {
        expect(data).to.be.undefined;
      })
      .catch(function (error) {
        expect(error.code).to.equal(400);
        expect(error.message).to.equal('Invalid source file');
      });
  });

  it('Return success on valid content', function (done) {
    var successCallback = sinon.spy();
    var errorCallback = sinon.spy();

    requestPromise = new Promise(function (resolve, reject) {
      resolve({
          response: {
              body: JSON.stringify({
                  meta: {
                      status: 200,
                      record_count: 2
                  },
                  data: [
                      {
                          code: "en-US",
                          english_name: "English (United States)",
                          local_name: "English (United States)",
                          locale: "en",
                          region: "US",
                          is_base_language: true,
                          is_ready_to_publish: true,
                          translation_progress: "100%",
                          uploaded_at: "2013-10-07T15:27:10+0000",
                          uploaded_at_timestamp: 1381159630
                      },
                      {
                          code: "ja-JP",
                          english_name: "Japanese",
                          local_name: "日本語",
                          locale: "ja",
                          region: "JP",
                          is_base_language: false,
                          is_ready_to_publish: true,
                          translation_progress: "98%",
                          uploaded_at: "2013-10-07T15:27:10+0000",
                          uploaded_at_timestamp: 1381159630
                      }
                  ]
              })
          }
      });
    });

    oneskyUtils.getLanguages(defaultOptions)
      .then(successCallback, errorCallback)
      .then(function () {
        expect(errorCallback).to.not.have.been.calledOnce;
        expect(successCallback).to.have.been.calledOnce;
      })
      .then(done)
      .catch(done);
  });
});
