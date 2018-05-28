'use strict';

const logger = require('../logger')();

module.exports = function(common) {
    return function(parameters) {
        if(typeof common.config.home_dispensers.dispensers === 'undefined') {
            logger.warn('Dispensers list for home_dispensers action is not defined!');
            return common.getMessage('BAD_CONFIGURATION');
        } else if(parameters.dispenser != 'all' && common.config.home_dispensers.dispensers.indexOf(parameters.dispenser) < 0) {
            logger.warn('Dispenser "%s" isn\'t known!', parameters.dispenser);
            return common.getMessage('HOME_DISPENSERS_UNKNOWN_DISPENSER', {
                name: parameters.dispenser
            });
        } else {
            const res = common.node_red('POST', '/dispenser-' + parameters.dispenser, {
                'action': parameters.action
            });

            if('enable' === parameters.action) {
                if('all' == parameters.dispenser) {
                    return common.getMessage('HOME_DISPENSERS_ENABLE_ALL');
                } else {
                    return common.getMessage('HOME_DISPENSERS_ENABLE_ONE', {
                        name: parameters.dispenser
                    });
                }
            } else if('disable' === parameters.action) {
                if('all' == parameters.dispenser) {
                    return common.getMessage('HOME_DISPENSERS_DISABLE_ALL');
                } else {
                    return common.getMessage('HOME_DISPENSERS_DISABLE_ONE', {
                        name: parameters.dispenser
                    });
                }
            } else if('dispense' === parameters.action) {
                if('all' == parameters.dispenser) {
                    return common.getMessage('HOME_DISPENSERS_DISPENSE_ALL');
                } else {
                    return common.getMessage('HOME_DISPENSERS_DISPENSE_ONE', {
                        name: parameters.dispenser
                    });
                }
            }
        }
    };
};