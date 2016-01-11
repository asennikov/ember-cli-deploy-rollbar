/* jshint node: true */
'use strict';

var BasePlugin = require('ember-cli-deploy-plugin');
var request = require('request-promise');

module.exports = {
  name: 'ember-cli-deploy-rollbar',

  createDeployPlugin: function(options) {
    var DeployPlugin = BasePlugin.extend({
      name: options.name,

      requiredConfig: ['accessToken'],

      didDeploy: function(context) {
        var token = this.readConfig('accessToken');
        this.log('Creating new deploy in Rollbar');

        return request({
          uri: 'https://api.rollbar.com/api/1/deploy/',
          method: 'POST',
          form: {
            access_token: token,
            environment: context.config.build.environment,
            revision: context.revisionData.revisionKey
          },
          resolveWithFullResponse: true
        }).then(function() {
          this.log('Deploy was successfully created in Rollbar');
        });
      }
    });

    return new DeployPlugin();
  }
};
