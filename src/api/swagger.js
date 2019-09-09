'use strict';

const express = require('express');
const swaggerUi = require('swagger-ui-express');

const apiDocsRouter = express.Router();

const swaggerDocument = require('../../docs/config/openapi.json');

apiDocsRouter.use('/', swaggerUi.serve);
apiDocsRouter.get('/', swaggerUi.setup(swaggerDocument));

module.exports = apiDocsRouter;
