var http = require('http');
var httpProxy = require('http-proxy');
var kew = require('kew');

function create_server (options) {
  var self = this;
  var port = options.port || 3000;
  var proxy = httpProxy.createProxyServer({});
  var auth = new Buffer(this.api_key + ':').toString('base64');

  var server = http.createServer(function (req, res) {
    res.setHeader('Authorization', auth);
    proxy.web(req, res, {
      target: "https://api.orchestrate.io"
    });
  });

  server.listen(port);

  return server;
}

module.exports = create_server;
