const request = require('request-promise');
const config = require('./config');
const logger = require('./logger')();
const messages = require('./messages');

const common = {
    'config': config.ACTIONS,
    'getMessage': messages.getMessage,
    'node_red': function(method, uri, payload) {
        var request_params = {
            'method': method,
            'uri': config.NODE_RED.url + uri,
            'json': true
        };

        if(config.NODE_RED.username.length) {
            request_params.headers = {
                'Authorization': 'Basic ' + new Buffer(config.NODE_RED.username + ':' + config.NODE_RED.password).toString('base64')
            }
        }

        if('POST' === method || 'PUT' === method || 'PATCH' === method) {
            request_params.body = payload;
        }

        return request(request_params);
    }
};

module.exports = {
    'home_cameras': require('./actions/home_cameras')(common),
    'home_dispensers': require('./actions/home_dispensers')(common)
};