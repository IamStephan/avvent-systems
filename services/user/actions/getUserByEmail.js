const { MoleculerError } = require('moleculer').Errors;

module.exports = {
  visibility: 'public',

  params: {
    email: {
      type: 'email',
      normalize: true
    }
  },

  async handler(ctx) {
    let user
    try {
      user = await this.actions.find({
        query: {
          email: ctx.params.email
        },
        fields: ['_id', 'first_name', 'last_name', 'email']
      })
    } catch(e) {
      console.log(e)
      return new MoleculerError('Could not fetch user', 500, 'Server Error')
    }

    if(user.length === 0) {
      return new MoleculerError('Could not fetch user', 404, 'User does not exist')
    }

    return user[0]
  }
}