'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/classcapture-dev'
  },

  seedDB: true,

  apiServer: {
    ip: '127.0.0.1', // currently only have 1 VM...so web server & api server on same machine
    port: 8080, // look at API server prod config
    context: '/api' // redirect calls to '/api/*' to API Server
  }
};
