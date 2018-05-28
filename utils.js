'use strict';

module.exports = {
    getParam: function(obj, key, defaultValue) {
        if (obj.hasOwnProperty(key)) {
            return obj[key];
        } else {
            return defaultValue;
        }
    },
    getEnv: function(key, defaultValue) {
        if (process.env[key] === undefined && defaultValue === undefined) {
            throw new Error('You must create an environment variable for ' + key);
        } else if (process.env[key] !== undefined) {
            return process.env[key];
        } else {
            return defaultValue;
        }
    }
};