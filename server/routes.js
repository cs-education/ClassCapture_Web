/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');
var config = require('./config/environment')
var proxyMiddleware = require('http-proxy-middleware');

module.exports = function(app) {

  // Proxy '/api/*' endpoint to API server
  var apiProxy = proxyMiddleware(`${config.apiServer.context}`, {
    'target': `http://${config.apiServer.ip}:${config.apiServer.port}`,
    'ws': true,
  });
  
  app.use(apiProxy);

  
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
