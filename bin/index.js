#!/usr/bin/env node
var assert = require('assert');
var orc_csv = require('../');

var argv = require('yargs')
  .usage('Upload CSVs to Orchestrate')
  // aliases
  .alias('u', 'api-key')
  .alias('f', 'file')
  .alias('c', 'collection')
  .alias('p', 'port')
  // descriptions
  .describe('u', 'An Orchestrate API key. Defaults to $ORCHESTRATE_API_KEY')
  .describe('f', 'Path to the CSV to upload')
  .describe('c', 'Name of the Orchestrate collection to upload files into')
  .describe('p', 'Port for `$0 server` to listen on.')
  // examples
  .example('$0 -u API_KEY -f PATH/TO/FILE -c COLLECTION_NAME')
  .example('$0 server -u API_KEY')
  .argv;

var orc = orc_csv({
  api_key: argv.u || process.env.ORCHESTRATE_API_KEY,
  collection: argv.c
});

if (argv._[0] === 'server') {
  // start server
  var port = argv.p || 3000;
  orc.server({
    port: port
  }).on('listening', function () {
    console.log('Listening on port', port);
  });
} else {
  // upload a file
  var uploader = orc.upload(argv);
  var promise;
  if (argv.f) {
    promise = uploader.file(argv.f);
  } else {
    promise = uploader.stream(process.stdin);
  }
  promise
  .then(function (res) {
    console.log('Uploaded', res.length, 'documents');
  })
  .fail(function () {
    console.trace(arguments);
  });
}