var upload = require('./upload');
var server = require('./server');
var assert = require('assert');

function orc_csv (options) {
  this.collection = options.collection;
  this.api_key = options.api_key;
  this.api_host = options.api_host;

  assert(this.api_key, "An API key is required.");
  assert(this.api_host, "A datacenter is required.");

  this.upload = upload.bind(this);
  this.server = server.bind(this);

  return this;
}

module.exports = orc_csv;
