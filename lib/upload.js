var fs = require('fs');
var orchestrate = require('orchestrate');
var kew = require('kew');
var async = require('async');
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
  var self = this;
  var defer = kew.defer();
  var headers;
  var rows = 0;
  var queue;

  function create_object (doc, done) {
    db.post(self.collection, doc)
    .then(function (res) {
      rows++;
      done(null, rows);
    })
    .fail(done);
  }

  stream
  .on('data',   function (data) {
    if (!headers) {
      headers = data;
      queue = async.queue(create_object, 10);

      queue.saturated = function () {
        stream.pause();
      };

      queue.empty = function () {
        stream.resume();
      };
    } else {
      var doc = {};

      headers.forEach(function (header, i) {
        doc[header] = data[i];
      });

      queue.push(doc);
    }
  })
  .on('error', defer.reject)
  .on('end', function () {
    queue.drain = function () {
      defer.resolve({
        length: rows
      });
    };
  });

  return defer.promise;
}

module.exports = upload;
