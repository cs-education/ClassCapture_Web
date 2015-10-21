/**
 * Middleware to add proxying of requests to /api to the api server
 * Must be called before app.use(bodyParser...)
 * More info on this at: https://github.com/nodejitsu/node-http-proxy/issues/180
 */

var config          = require('./config/environment')
var proxyMiddleware = require('http-proxy-middleware');

// Proxy '/api/*' endpoint to API server
var rewriteTable = {};
rewriteTable[`^${config.apiServer.context}`] = '';

var apiProxy = proxyMiddleware(`${config.apiServer.context}/**`, {
	'target': `http://${config.apiServer.ip}:${config.apiServer.port}`,
	'changeOrigin': true,
	'pathRewrite': rewriteTable
});

module.exports = function (app) {
	app.use(apiProxy);
};