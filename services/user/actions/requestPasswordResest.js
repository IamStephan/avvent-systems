const shortid = require('shortid')
const { MoleculerError } = require('moleculer').Errors;

module.exports = {
  visibility: 'published',
  
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
      return new MoleculerError('Could not fetch user', 500, 'Could not fetch user')
    }

    if(user.length === 0) {
      return new MoleculerError('User does not exist', 404, 'User does not exist')
    }

    const password_reset_id = shortid.generate()

    try {
      await this.actions.update({
        _id: user[0]._id,
        password_reset_id: password_reset_id
      })
    } catch(e) {
      return new MoleculerError('Could not update user', 500, 'Could not update user')
    }

    this.broker.emit('user.requestPasswordReset', {
      to: ctx.params.email,
      name: user[0].first_name,
      password_reset_id: password_reset_id
    })

    return true
  }
}