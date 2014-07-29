var upload = require('./upload');
var server = require('./server');

function orc_csv (options) {
  this.collection = options.collection;
  this.api_key = options.api_key;

  this.upload = upload.bind(this);
  // TODO this.server = server.bind(this);

  return this;
}

module.exports = orc_csv;
