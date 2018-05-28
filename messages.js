const logger = require('./logger')();
const messages = {
    'fr-fr': {
        'ERROR': [
            'Une erreur est survenue !',
        ],
        'UNKNOWN_ACTION': [
            'Je ne sais pas quoi faire pour vous aider... !',
        ],
        'BAD_CONFIGURATION': [
            'Je crois que ma configuration n\'est pas optimale !',
        ],

        // home_cameras
        'HOME_CAMERAS_ENABLE_ALL': 'OK, j\'active toutes les caméras immédiatement !',
        'HOME_CAMERAS_DISABLE_ALL': 'OK, je désactive toutes les caméras immédiatement !',
        'HOME_CAMERAS_ENABLE_ONE': 'OK, j\'active la caméra "{name}" immédiatement !',
        'HOME_CAMERAS_DISABLE_ONE': 'OK, je désactive la caméra "{name}" immédiatement !',
        'HOME_CAMERAS_ALREADY_ENABLED': 'La caméra "{name}" est déjà activée !',
        'HOME_CAMERAS_ALREADY_DISABLED': 'La caméra "{name}" est déjà désactivée !'
    }
};

var current_locale = 'fr-fr';

module.exports.setLocale = function(locale) {
    if(messages.hasOwnProperty(locale)) {
        current_locale = locale;
    }
};

module.exports.getMessage = function(message, args) {
    if(typeof args === 'undefined') {
        args = {};
    }

    if(!messages[current_locale].hasOwnProperty(message)) {
        logger.warn('Message "%s" is unknown for locale "%s"', message, current_locale);
        return message;
    }

    result = messages[current_locale][message];

    if(typeof result === 'array' || typeof result === 'object') {
        if(!result.length) {
            logger.warn('The message "%s" is empty for the locale "%s"', message, current_locale);
            return message;
        }
        result = result[Math.floor(Math.random() * result.length)];
    }

    if(!result.length) {
        logger.warn('The message "%s" is empty for the locale "%s"', message, current_locale);
        return message;
    }

    for(k in args) {
        result = result.replace('{' + k + '}', args[k]);
    }

    return result;
};
