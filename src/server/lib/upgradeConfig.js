var Promise = require('bluebird');
var isUpgradeable = require('./isUpgradeable');
var config = require('../config');
var _ = require('lodash');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: config.elasticsearch
});

module.exports = function (response) {
  var newConfig = {};
  // Check to see if there are any doc. If not then we can assume
  // nothing needs to be done
  if (response.hits.hits.length === 0) return Promise.resolve();

  // Look for upgradeable configs. If none of them are upgradeable
  // then resolve with null.
  var body = _.find(response.hits.hits, isUpgradeable);
  if (body) return Promise.resolve();

  return client.create({
    index: '.kibana',
    type: 'config',
    id: config.package.version,
    body: body
  });

};
