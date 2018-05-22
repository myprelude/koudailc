var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'bolg'
    },
    port: process.env.PORT || 8099,
    db: 'mongodb://localhost/nodebolg'
  },

  test: {
    root: rootPath,
    app: {
      name: 'bolg'
    },
    port: process.env.PORT || 80,
    db: 'mongodb://localhost/bolg-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'bolg'
    },
    port: process.env.PORT || 80,
    db: 'mongodb://localhost/bolg-production'
  }
};

module.exports = config[env];
