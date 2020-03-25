const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { MoleculerError } = require('moleculer').Errors;

module.exports = {
  visibility: 'published',

  params: {
    email: {
      type: 'email',
      normalize: true
    },
    password: {
      type: 'string'
    }
  },

  async handler(ctx) {
    let emailCount
    let user

    let privateKey= 'privateKey'

    try {
      emailCount = await this.actions.count({
        query: {
          email: ctx.params.email
        }
      })
    } catch (e) {
      return new MoleculerError('Could not search for matching users', 500, 'Server Error')
    }

    if(emailCount === 0) {
      return new MoleculerError('User does not Exist', 409, 'User does not exist')
    }

    try {
      user = await this.actions.find({
        query: {
          email: ctx.params.email
        }
      })
    } catch (e) {
      return new MoleculerError('Could not fetch user', 500, 'Server Error')
    }

    console.log(user)

    let passwordValidate = await bcrypt.compare(ctx.params.password, user[0].password)

    if(!passwordValidate) {
      return new MoleculerError('Email or password is incorrect', 409, 'Email or password is incorrect')
    }

    return {
      token: jwt.sign({
        _id: user[0]._id,
        verified: user[0].verified
      }, privateKey)
    }
  }
}