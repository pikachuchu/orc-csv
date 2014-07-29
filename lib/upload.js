var fs = require('fs');
var orchestrate = require('orchestrate');
var kew = require('kew');
var parse = require('csv-parse');
var path = require('path');

function upload (options) {
  this.parser = parse(options);
  this.db = orchestrate(this.api_key || process.env.ORCHESTRATE_API_KEY);

  this.stream = from_stream.bind(this);
  this.file = from_file.bind(this);

  return this;
}

function from_file (filepath) {
  filepath = path.resolve(filepath);
  var stream = fs.createReadStream(filepath);
  return from_stream.call(this, stream);
}

function from_stream (stream) {
  var csv_stream = stream.pipe(this.parser);
  return to_orchestrate.call(this, csv_stream);
}

function to_orchestrate (stream) {
  var defer = kew.defer();
  var headers;
  var self = this;

  stream
  .on('data', function (data) {
    stream.pause();
    if (headers) {
      headers = data;
      stream.resume();
    } else {
      var doc = {};

      headers.forEach(function (header, i) {
        doc[header] = data[i];
      });

      db.post(self.collection, doc)
      .fail(console.error)
      .fin(function () {
        stream.resume();
      });
    }
  })
  .on('error', function () {
    defer.reject();
  })
  .on('finish', function () {
    defer.resolve();
  });

  return defer.promise;
}

module.exports = upload;
