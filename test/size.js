var orc_csv = require('../lib-cov');
var fs = require('fs');
var nock = require('nock');
var path = require('path');
var http = require('http');
var assert = require('assert');

describe('size test', function () {
  before(function () {
    this.filepath = 'test/huge.csv';
    this.collection = 'sample';
    this.nock = nock("https://api.orchestrate.io");

    this.orc_csv = orc_csv({
      collection: this.collection,
      api_key: 'alkefgafelakefhea'
    });
  });

  it('should handle large files', function (done) {
    this.timeout(0);
    var self = this;
    
    this.nock
    .post('/v0/' + this.collection)
    .times(10000)
    .reply(201);

    this.orc_csv
    .upload()
    .file(this.filepath)
    .then(function () {
      self.nock.done();
      done();
    })
    .fail(done);
  });
});
