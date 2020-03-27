const jwt = require('jsonwebtoken')
const { MoleculerError } = require('moleculer').Errors

module.exports = {
  visibility: 'public',

  params: {
    token: {
      type: 'string'
    }
  },

  async handler(ctx) {
    let privateKey = 'privateKey'

    let verified = jwt.verify(ctx.params.token, privateKey)

    if(!verified) {
      return new MoleculerError('Token not valid', 401, 'Token not valid')
    }

    let token = jwt.decode(ctx.params.token)

    if(!token.id && !token.verified) {
      return new MoleculerError('Token contains insufficient properties', 404, 'Token contains insufficient properties')
    }

    return {
      id: token.id,
      verified: token.verified
    }
  }
}