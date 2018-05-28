'use strict';

// Dependencies
const winston = require('winston');

// Module variables
var instance = null;

// Module functions
function getParam(obj, key, defaultValue) {
    if (!obj) {
        return defaultValue;
    } else if (!obj.hasOwnProperty(key)) {
        return defaultValue;
    } else {
        return obj[key];
    }
}

// Exports
module.exports = function(config) {
    if (null === instance) {
        const logger = new winston.Logger();
        const opts = config || {};

        if (opts.hasOwnProperty('console')) {
            logger.add(winston.transports.Console, {
                level: getParam(opts.console, 'level', 'info'),
                timestamp: getParam(opts.console, 'timestamp', false),
                colorize: true
            });
        }

        if (opts.hasOwnProperty('file') && getParam(opts.file, 'filename', '')) {
            logger.add(winston.transports.File, {
                level: getParam(opts.file, 'level', 'info'),
                filename: getParam(opts.file, 'filename', ''),
                timestamp: getParam(opts.file, 'timestamp', false),
                colorize: false
            });
        }

        logger.stream = {
            write: function(message) {
                logger.info(message.replace(/\s*$/g, ''));
            }
        };

        logger.exception = function(e, message) {
            if (message) {
                this.error(message, e.message);
            }
            this.error(e.stack);
        };

        instance = logger;
    }
    return instance;
};