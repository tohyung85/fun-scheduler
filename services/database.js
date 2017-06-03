const Promise = require('bluebird');
const DATABASE_NAME = require('../.env').databaseName;
const DATABASE_USER = require('../.env').databaseUser;
const DATABASE_PASSWORD = require('../.env').databasePassword;
const arango = require('arangojs').Database; // Require preferred database
const db = new arango('http://127.0.0.1:8529');
db.useDatabase(DATABASE_NAME);
db.useBasicAuth(DATABASE_USER, DATABASE_PASSWORD);
Promise.promisifyAll(db);

module.exports = db;

