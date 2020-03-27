const { MoleculerError } = require('moleculer').Errors;

module.exports = {
  visibility: 'public',

  params: {
    id: {
      type: 'string'
    }
  },

  async handler(ctx) {
    let user
    try {
      user = await this.actions.get({
        id: ctx.params.id,
        fields: ['_id', 'first_name', 'last_name', 'email']
      })
    } catch(e) {
      console.log(e.code)
      if(e.code === 404) {
        return new MoleculerError('Could not fetch user', 404, 'User does not exist')
      }
      return new MoleculerError('Could not fetch user', 500, 'Server Error')
    }

    return user
  }
}