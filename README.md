# LAB - 15

## API Server

### Author: Austin Hedeen

### Links and Resources
* [submission PR](https://github.com/austinhedeen-401-advanced-javascript/lab-15/pull/1)
* [travis](https://travis-ci.com/austinhedeen-401-advanced-javascript/lab-15)
* [back-end](https://murmuring-shore-73537.herokuapp.com/)

#### Documentation
* [api docs](https://murmuring-shore-73537.herokuapp.com/api-docs/)
* [jsdoc](https://murmuring-shore-73537.herokuapp.com/docs/)

### Modules
#### `app.js`
##### Exported Values and Methods

###### `server`
The Express application (for testing)

###### `start(port)`
Starts the Express server on `port`

### Setup
#### `.env` requirements
* `PORT` - Port Number
* `MONGODB_URI` - URL to the running mongo instance/db

#### Running the app
* `npm start`
* Endpoint: `/api-docs`
  * Renders API Documentation
* Endpoint: `/docs`
  * Renders Developer Documentation
* Endpoint: `/api/v1/models`
  * GET: Fetch all models
* Endpoint: `/api/v1/:model/schema`
  * GET: Fetch a model's schema
* Endpoint: `/api/v1/:model/`
  * GET: Fetch all model records
  * POST: Create a model record
* Endpoint: `/api/v1/:model/:id`
  * GET: Fetch a model record
  * PUT: Update a model record
  * DELETE: Delete a model record
  
#### Tests
* `npm test`

#### UML
![](assets/lab-15.png)
