var http = require('http');
var httpProxy = require('http-proxy');
var kew = require('kew');

function create_server (options) {
  var self = this;
  var port = options.port;
  var proxy = httpProxy.createProxyServer({});
  var auth = new Buffer(self.api_key + ':').toString('base64');

  var server = http.createServer(function (req, res) {
    req.headers.Authorization = 'Basic ' + auth;
    proxy.web(req, res, {
      target: "https://api.orchestrate.io",
      headers: {
        host: "api.orchestrate.io"
      }
    });
  });

  server.listen(port);

  return server;
}

module.exports = create_server;
