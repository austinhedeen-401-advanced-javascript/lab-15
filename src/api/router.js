'use strict';

const express = require('express');
const apiRouter = express.Router();

const modelFinder = require(`../middleware/model-finder.js`);
const auth = require('../auth/middleware');

// Evaluate the model, dynamically
apiRouter.param('model', modelFinder.load);

// Models List
/**
 * @route GET /api/v1/models
 * @returns {object} 200 - A list of models [ {}, {} ]
 * @returns {Error}  500 - Unexpected error
 */
apiRouter.get('/api/v1/models', (request, response) => {
  modelFinder.list()
    .then(models => response.status(200).json(models));
});

// JSON Schema
/**
 * @route GET /api/v1/{model}/schema
 * @param {model} model.path - Model Name
 * @returns {object} 200 - A model schema
 * @returns {Error}  500 - Unexpected error
 */
apiRouter.get('/api/v1/:model/schema', (request, response) => {
  response.status(200).json(request.model.jsonSchema());
});


// API Routes
/**
 * Get a list of records for a given model
 * Model must be a proper model, located within the ../models folder
 * @route GET /api/v1/{model}
 * @param {model} model.path - Model Name
 * @security basicAuth
 * @returns {object} 200 { count: 2, results: [ {}, {} ] }
 * @returns {Error}  500 - Server error
 */
apiRouter.get('/api/v1/:model', handleGetAll);

/**
 * @route POST /api/v1/:model
 * Model must be a proper model, located within the ../models folder
 * @param {model} model.path.required
 * @returns {object} 200 - Count of results with an array of results
 * @returns {Error}  500 - Unexpected error
 */
apiRouter.post('/api/v1/:model', auth('create'), handlePost);

/**
 * Get a record matching the given id.
 * @route GET /api/v1/:model/:id
 * @returns {object} 200 - A model record
 * @returns {Error}  500 - Server error
 */
apiRouter.get('/api/v1/:model/:id', handleGetOne);

/**
 * Update the record with the matching id.
 * @route PUT /api/v1/:model/:id
 * @returns {object} 200 - A model record
 * @returns {Error}  500 - Server error
 */
apiRouter.put('/api/v1/:model/:id', auth('update'), handlePut);

/**
 * Delete the record matching the id.
 * @route DELETE /api/v1/:model/:id
 * @returns {object} 200 - The deleted record
 * @returns {Error}  500 - Server error
 */
apiRouter.delete('/api/v1/:model/:id', auth('delete'), handleDelete);


// Route Handlers
function handleGetAll(request,response,next) {
  request.model.get()
    .then( data => {
      const output = {
        count: data.length,
        results: data,
      };
      response.status(200).json(output);
    })
    .catch( next );
}

function handleGetOne(request,response,next) {
  request.model.get(request.params.id)
    .then( result => response.status(200).json(result[0]) )
    .catch( next );
}

function handlePost(request,response,next) {
  request.model.create(request.body)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

function handlePut(request,response,next) {
  request.model.update(request.params.id, request.body)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

function handleDelete(request,response,next) {
  request.model.delete(request.params.id)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

module.exports = apiRouter;
