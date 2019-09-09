'use strict';
/**
 * @module
 */

const User = require('./users-model.js');

/**
 * Returns an authentication middleware function based on the permissions of the capability.
 * @param {string} capability
 * @returns {Function} Authentication middleware function
 */
module.exports = (capability) => {

  /**
   * A middleware function that authenticates a request using the authorization header
   * @param req
   * @param res
   * @param next
   * @returns {Promise|void}
   */
  return (req, res, next) => {

    try {
      let [authType, authString] = req.headers.authorization.split(/\s+/);

      switch (authType.toLowerCase()) {
        case 'basic':
          return _authBasic(authString);
        case 'bearer':
          return _authBearer(authString);
        default:
          return _authError();
      }
    } catch (e) {
      _authError();
    }


    /**
     * Authenticates the request using basic auth
     * @param {string} str
     * @returns {Promise}
     * @private
     */
    function _authBasic(str) {
      // str: am9objpqb2hubnk=
      let base64Buffer = Buffer.from(str, 'base64'); // <Buffer 01 02 ...>
      let bufferString = base64Buffer.toString();    // john:mysecret
      let [username, password] = bufferString.split(':'); // john='john'; mysecret='mysecret']
      let auth = {username, password}; // { username:'john', password:'mysecret' }

      return User.authenticateBasic(auth)
        .then(user => _authenticate(user))
        .catch(_authError);
    }

    /**
     * Authenticates the request using bearer auth
     * @param {string} token
     * @returns {Promise}
     * @private
     */
    function _authBearer(authString) {
      return User.authenticateToken(authString)
        .then(user => _authenticate(user))
        .catch(_authError);
    }

    /**
     * Completes the authentication process by placing a token in the request
     * @param user
     * @private
     */
    function _authenticate(user) {
      if ( user && (!capability || (user.can(capability))) ) {
        req.user = user;
        req.token = user.generateToken();
        next();
      }
      else {
        _authError();
      }
    }

    /**
     * If the authentication process hits an error, notify the client
     * @private
     */
    function _authError() {
      next('Invalid User ID/Password');
    }

  };

};
