var fs = require('fs');
var orchestrate = require('orchestrate');
var kew = require('kew');
var parse = require('csv-parse');
var path = require('path');
var assert = require('assert');

function upload (options) {
  assert(this.collection, "A collection name is required.");

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
  var promises = [];
  var self = this;

  stream
  .on('data', function (data) {
    if (!headers) {
      headers = data;
    } else {
      var doc = {};

      headers.forEach(function (header, i) {
        doc[header] = data[i];
      });

      var promise = db.post(self.collection, doc);
      promises.push(promise);
    }
  })
  .on('error', function (err) {
    defer.reject(err);
  })
  .on('end', function () {
    defer.resolve(kew.all(promises));
  });

  return defer.promise;
}

module.exports = upload;
