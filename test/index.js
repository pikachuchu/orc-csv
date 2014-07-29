var orc_csv = require('../lib-cov');
var fs = require('fs');
var nock = require('nock');

describe('orc-csv', function () {
  before(function () {
    this.filepath = 'sample.csv';
    this.collection = 'sample';
    this.nock = nock("https://api.orchestrate.io")
    .get('/v0')
    .reply(200)
    .post('/v0/' + this.collection)
    .reply(201);
  });

  afterEach(function () {
    // `restore` only becomes available after intercepting requests
    if (this.nock.restore) this.nock.restore();
  });

  it('should sync from a path name', function (done) {
    var self = this;
    orc_csv({
      collection: this.collection
    }).upload.file(this.filepath)
    .then(function () {
      self.nock.done();
    })
    .fail(done);
  });

  it('should sync from a file stream', function (done) {
    var self = this;
    var stream = fs.createReadStream(this.filepath);
    orc_csv({
      collection: this.collection
    }).upload.stream(stream)
    .then(function () {
      self.nock.done();
    })
    .fail(done);
  });

  it('should start a web server containing uploaded docs', function (done) {
    orc_csv({
      collection: this.collection
    }).server({
      port: 5000
    })
    .then(function (server) {
      http.get("http://localhost:5000", function (res) {
        assert.equal(res.status, 200);
        server.close();
        done();
      });
    })
    .fail(done);
  });
});
