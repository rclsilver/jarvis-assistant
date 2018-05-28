const utils = require('./utils');
var local = {};
const settings_file = utils.getEnv('LOCAL_SETTINGS', './local_settings');

try {
    local = require(settings_file);
} catch(e) { // eslint-disable-line no-empty
    console.log('unable to load local settings', e);
}

function getParam(variable, defaultValue) {
    var result = utils.getParam(local, variable);

    if(result === undefined) {
        result = utils.getEnv(variable, defaultValue);
    }

    return result;
}

var config = {
    ADDRESS: getParam('ADDRESS', '127.0.0.1'),
    PORT: getParam('PORT', 3000),
    TIMEZONE: getParam('TIMEZONE', 'UTC'),
    LOGGING: getParam('LOGGING', {console: 'info'}),
    ACTIONS: getParam('ACTIONS', {}),
    NODE_RED: getParam('NODE_RED')
};

module.exports = config;
