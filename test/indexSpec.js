'use strict';

var mockery = require('mockery'),
    chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    requestPromise,
    onesky_utils,
    defaultOptions;

chai.use(sinonChai);
describe('GET translations with wrong credentials', function() {
    before(function() {
        mockery.registerMock('request-promise', function() {
            return requestPromise;
        });
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        onesky_utils = require(__dirname + "/../index.js");
    });

    after(function() {
        mockery.deregisterSubstitute('request-promise');
        mockery.disable();
    });

    beforeEach(function() {
        defaultOptions = {
            language: "pl",
            fileFormat: "test",
            projectId: "projectId",
            secret: "secret",
            apiKey: "apiKey",
            callback: function() {}
        };
    });

    it('Return error when request fails', function() {
        requestPromise = new Promise(function(resolve, reject) {
            reject({
                response: {
                    body: '{"meta":{"status":400,"message":"Invalid source file"},"data":{}}'
                }
            });
        });

        onesky_utils.getFile(defaultOptions)
            .then(function(data) {
                expect(data).to.be.undefined;
            })
            .catch(function(error) {
                expect(error.code).to.equal(400);
                expect(error.message).to.equal("Invalid source file");
            });
    });

    it('Return success on valid content', function(done) {
        var successCallback = sinon.spy(),
            errorCallback = sinon.spy();

        requestPromise = new Promise(function(resolve, reject) {
            resolve('msgid "test"\nmsgstr "test_content"');
        });

        onesky_utils.getFile(defaultOptions)
            .then(successCallback, errorCallback)
            .then(function() {
                expect(errorCallback).to.not.have.been.calledOnce;
                expect(successCallback).to.have.been.calledWith('msgid "test"\nmsgstr "test_content"');
            })
            .then(done)
            .catch(done);
    });
});
