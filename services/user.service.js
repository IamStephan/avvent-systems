'use strict';

/**
 * General User Structure:
 *    - first_name: string
 *    - last_name: string
 *    - username: string
 *    - email: string
 *    - password: string (should be hashed)
 *    - started: Date()
 *    - verified: boolean
 *    - verifyId: string
 */

const DbService	= require('moleculer-db');
const MongoDBAdapter = require('moleculer-db-adapter-mongo');


module.exports = {
  name: 'user',
  version: 'v1',

  mixins: [DbService],

  // Test DB
  // DO NOT use password here
  adapter: new MongoDBAdapter('mongodb+srv://stephan_test:12344321@cluster0-v1ld8.mongodb.net/avvent_test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }),

  collection: 'users',
  
  settings: {
    fields: ['_id', 'first_name', 'last_name', 'username', 'email', 'password', 'started', 'verified', 'verify_id']
  },

  actions: {
    signup: { ...require('./user/actions/signup') },
    login: { ...require('./user/actions/login') },
    sendVerifyId: { ...require('./user/actions/sendVerifyId') }
  }
}