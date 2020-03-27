const mailMixin = require('moleculer-mail')

module.exports = {
  name: 'mail',
  version: 'v1',
  mixins: [mailMixin],

  settings: {
    transport: {
      service: 'gmail',
      templateFolder: './templates',
      auth: {
        user: 'avventsystemstest@gmail.com',
        pass: '135798642Awe'
      }
    }
  },

  actions: {
    
  },

  events: {

  }
}