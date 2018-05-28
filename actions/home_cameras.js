'use strict';

const logger = require('../logger')();

module.exports = function(common) {
    return function(parameters) {
        return new Promise(function(resolve, reject) {
            if(typeof common.config.home_cameras.cameras === 'undefined') {
                logger.warn('Cameras list for home_cameras action is not defined!');
                resolve(common.getMessage('BAD_CONFIGURATION'));
            } else if(parameters.camera != 'all' && common.config.home_cameras.cameras.indexOf(parameters.camera) < 0) {
                logger.warn('Camera "%s" isn\'t known!', parameters.camera);
                resolve(common.getMessage('HOME_CAMERAS_UNKNOWN_CAMERA', { name: parameters.camera }));
            } else {
                const camera_uri = '/camera-' +  parameters.camera + '-alarm';
                const new_status = parameters.action === 'enable' ? 'on' : 'off';

                if('all' === parameters.camera) {
                    common.node_red('POST', camera_uri, { 'status': new_status }).then(function(payload) {
                        if('on' === payload.status) {
                            resolve(common.getMessage('HOME_CAMERAS_ENABLE_ALL'));
                        } else {
                            resolve(common.getMessage('HOME_CAMERAS_DISABLE_ALL'));
                        }
                    }).catch(reject);
                } else {
                    common.node_red('GET', camera_uri).then(function(payload) {
                        if(payload.status === new_status) {
                            if('on' === new_status) {
                                resolve(common.getMessage('HOME_CAMERAS_ALREADY_ENABLED', { name: parameters.camera }));
                            } else {
                                resolve(common.getMessage('HOME_CAMERAS_ALREADY_DISABLED', { name: parameters.camera }));
                            }
                        } else {
                            common.node_red('POST', camera_uri, { 'status': new_status }).then(function(payload) {
                                if('on' === payload.status) {
                                    resolve(common.getMessage('HOME_CAMERAS_ENABLE_ONE', { name: parameters.camera }));
                                } else {
                                    resolve(common.getMessage('HOME_CAMERAS_DISABLE_ONE', { name: parameters.camera }));
                                }
                            }).catch(reject);
                        }
                    }).catch(reject);
                }
            }
        });
    };
};