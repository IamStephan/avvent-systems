const mailMixin = require('moleculer-mail')

module.exports = {
  name: 'mail',
  version: 'v1',

  settings: {
    transport: {
      service: 'gmail',
      auth: {
        user: 'avventsystemstest@gmail.com',
        pass: '135798642Awe'
      }
    }
  },

  mixins: [mailMixin]
}