'use strict';
const fs = require('fs');
const util = require('util');
const readdir = util.promisify(fs.readdir);

const modelsFolder = `${__dirname}/../models`;
/**
 * @module
 */

/**
 * Middleware to set the model property of the request object.
 * @param req - Request object
 * @param res - Response object
 * @param next - Calls the next middleware function
 */
const load = (req,res,next) => {
  let modelName = req.params.model.replace(/[^a-z0-9-_]/gi, '');
  const Model = require(`../models/${modelName}/${modelName}-model.js`);
  req.model = new Model();
  next();
};

/**
 * Returns a list of the models used in the API.
 * @returns {Promise<string[] | void>} - the list of models
 */
const list = () => {
  return readdir(modelsFolder)
    .then(contents =>
      contents.filter((entry) =>
        fs.lstatSync(`${modelsFolder}/${entry}`).isDirectory() && fs.statSync(`${modelsFolder}/${entry}/${entry}-model.js`)
      )
    )
    .catch(console.error);
};

module.exports = {load,list};
