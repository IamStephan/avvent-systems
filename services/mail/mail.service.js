const mailMixin = require('moleculer-mail')
const path = require('path')

module.exports = {
  name: 'mail',
  version: 'v1',
  mixins: [mailMixin],

  settings: {
    templateFolder: path.join(__dirname, 'templates'),
    transport: {
      service: 'gmail',
      auth: {
        user: 'avventsystemstest@gmail.com',
        pass: '135798642Awe'
      }
    }
  },

  // actions: {
    
  // },

  events: {
    'user.verify': { ...require('./events/user.verify') },
    'user.requestPasswordReset': { ...require('./events/user.requestPasswordReset') },
  }
}