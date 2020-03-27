const jwt = require('jsonwebtoken')
const { MoleculerError } = require('moleculer').Errors;

module.exports = {
  visibility: 'published',
  
  params: {
    verifyToken: {
      type: 'string'
    }
  },

  async handler(ctx) {
    let user
    let privateKey= 'privateKey'
    let validToken = jwt.verify(ctx.params.verifyToken, privateKey)

    if(!validToken) {
      return new MoleculerError('Not a valid token', 401, 'Not a valid token')
    }

    let tokenPayload = jwt.decode(ctx.params.verifyToken)

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

    try {
      await this.actions.update({
        _id: user[0]._id,
        verified: true
      })
    } catch(e) {
      return new MoleculerError('Could not update user', 500, 'Could not update user')
    }

    return true
  }
}