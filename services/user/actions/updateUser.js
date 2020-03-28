const { MoleculerError } = require('moleculer').Errors

module.exports = {
  visibility: 'published',

  params: {
    token: {
      type: 'string'
    },
    properties: {
      type: 'object',
      strict: 'remove',
      props: {
        first_name: { type: 'string', optional: true },
        last_name: { type: 'string', optional: true },
        username: { type: 'string', optional: true }
      }
    }
  },

  async handler(ctx) {
    let userEssential
    let updateDetails = {}

    try {
      userEssential = await this.actions.auth({
        token: ctx.params.token
      })
    } catch(e) {
      return new MoleculerError('Could not auth user', 500, 'Could not auth user')
    }

    if(ctx.params.properties.first_name) { updateDetails.first_name = ctx.params.properties.first_name }
    if(ctx.params.properties.last_name) { updateDetails.last_name = ctx.params.properties.last_name }
    if(ctx.params.properties.username) { updateDetails.username = ctx.params.properties.username }

    try {
      await this.actions.update({
        _id: userEssential.id,
        ...updateDetails
      })
    } catch(e) {
      return new MoleculerError('Could not update user', 500, 'Could not update user')
    }

    return {
      message: 'User Updated'
    }
  }
}