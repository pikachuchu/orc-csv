var orc_csv = require('../');
var fs = require('fs');
var nock = require('nock');
var path = require('path');
var http = require('http');
var assert = require('assert');

describe('orc-csv', function () {
  before(function () {
    this.filepath = 'test/sample.csv';
    this.collection = 'sample';
    this.nock = nock("https://api.orchestrate.io")
    .get('/v0')
    .reply(200)
    .post('/v0/' + this.collection)
    .reply(201);

    this.orc_csv = orc_csv({
      collection: this.collection,
      api_key: 'alkefgafelakefhea'
    });
  });

  afterEach(function () {
    // `restore` only becomes available after intercepting requests
    if (this.nock.restore) this.nock.restore();
  });

  it('should sync from a path name', function (done) {
    var self = this;
    this.orc_csv.upload().file(this.filepath)
    .then(function () {
      self.nock.done();
    })
    .fail(done);
  });

  it('should sync from a file stream', function (done) {
    var self = this;
    var stream = fs.createReadStream(path.resolve(this.filepath));
    this.orc_csv.upload().stream(stream)
    .then(function () {
      self.nock.done();
    })
    .fail(done);
  });

  it('should start a web server containing uploaded docs', function (done) {
    this.nock.get('/').reply(200);

    var server = this.orc_csv.server({
      port: 5000
    });
    
    http.get("http://localhost:5000", function (res) {
      assert.equal(res.statusCode, 200);
      server.close();
      done();
    });
  });
});
