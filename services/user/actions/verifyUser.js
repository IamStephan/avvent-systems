const jwt = require('jsonwebtoken')
const { MoleculerError } = require('moleculer').Errors;

module.exports = {
  visibility: 'published',
  
  params: {
    verify_id: {
      type: 'string'
    },
    token: {
      type: 'string'
    }
  },

  async handler(ctx) {
    let user
    let privateKey= 'privateKey'
    let token = jwt.verify(ctx.params.token, privateKey)

    if(!token) {
      return new MoleculerError('Not a valid token', 401, 'Not a valid token')
    }

    let tokenPayload = jwt.decode(ctx.params.token)

    console.log(tokenPayload)

    if(!tokenPayload.email) {
      return new MoleculerError('Not a valid token', 401, 'Not a valid token: Incorrect payload')
    }

    try {
      user = await this.actions.find({
        query: {
          email: tokenPayload.email
        },
        fields: ['_id']
      })
    } catch(e) {
      return new MoleculerError('Could not update user', 500, 'Server Error')
    }

    if(user.length === 0) {
      return new MoleculerError('Could not find user', 409, 'Could not find user')
    }

    if(user[0].verify_id !== ctx.params.verify_id) {
      return new MoleculerError('Invalid verify id', 409, 'Invalid verify id')
    }

    try {
      await this.actions.update({
        _id: user[0]._id,
        verified: true
      })
    } catch(e) {
      return new MoleculerError('Could not verify user', 500, 'Could not verify user')
    }

    return true
  }
}