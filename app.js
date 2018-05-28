const config = require('./config');
const logger = require('./logger')(config.LOGGING);
const messages = require('./messages');
const express = require('express');
const body_parser = require('body-parser');
const json_body_parser = body_parser.json();
const app = express();
const actions = require('./actions');

app.use(json_body_parser);
app.use(function(req, res, next) {
    logger.info('%s %s', req.method, req.url);
    if(req.body) {
        logger.debug(JSON.stringify(req.body));
    }
    next();
});

app.post('/', function(req, res) {
    try {
        const action = req.body.queryResult.intent.displayName;
        const parameters = req.body.queryResult.parameters;
        const language = req.body.queryResult.languageCode;

        res.setHeader('Content-Type', 'application/json');

        if(actions.hasOwnProperty(action)) {
            logger.info('Executing action "%s" (parameters : %s)...', action, JSON.stringify(parameters));
            actions[action](parameters).then(function(r) {
                res.send(JSON.stringify({ 'fulfillmentText': r }));
            }).catch(function(e) {
                logger.error('Error during the execution of the action "%s" (parameters %s)', action, JSON.stringify(parameters));
                logger.exception(e);
                res.send(JSON.stringify({ 'fulfillmentText': messages.getMessage('ERROR') }));
            });
        } else {
            logger.warn('Unknown action "%s"! (parameters %s)', action, JSON.stringify(parameters));
            res.send(JSON.stringify({ 'fulfillmentText': messages.getMessage('UNKNOWN_ACTION') }));
        }
    } catch(e) {
        res.status(400);
        res.send('Bad request');
    }
});

const server = app.listen(config.PORT, config.ADDRESS, function() {
    logger.info('Listening on http://%s:%d', server.address().address, server.address().port);
});
