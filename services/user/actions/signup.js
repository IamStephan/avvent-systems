const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { MoleculerError } = require('moleculer').Errors;

module.exports = {
  visibility: 'published',

  params: {
    first_name: {
      type: 'string',
      min: 1,
      max: 16
    },
    last_name: {
      type: 'string',
      min: 1,
      max: 16
    },
    email: {
      type: 'email',
      normalize: true
    },
    username: {
      type: 'string',
      min: 1,
      max: 16
    },
    password: {
      type: 'custom',
      check(value) {
        let flaws = []

        if(typeof value !== 'string') {
          return [{ type: 'type', expected: 'string', actual: typeof value }]
        }

        if(/(\s)/g.test(value)) {
          return [{ type: 'validation', expected: 'Cannot contain any whitespace' }]
        }

        let tests = [
          {
            pattern: /^(.){8,}$/g,
            message: 'Password must be longer that 8 characters'
          },
          {
            pattern: /([A-Z])/g,
            message: 'At least one upper case English letter'
          },
          {
            pattern: /([a-z])/g,
            message: 'At least one lower case English letter'
          },
          {
            pattern: /([0-9])/g,
            message: 'At least one digit'
          },
          {
            pattern: /([#?!@$%^&*-])/g,
            message: 'At least one special character'
          }
        ]

        for(let i = 0; i < tests.length; i++) {
          if(!tests[i].pattern.test(value)) {
            flaws.push({ type: 'validation', expected: tests[i].message })
          }
        }

        return flaws.length === 0 ? true : flaws
      }
    }
  },

  async handler(ctx) {
    let createdUser
    let emailCount

    let privateKey = 'privateKey'

    let user = {
      first_name: ctx.params.first_name,
      last_name: ctx.params.last_name,
      username: ctx.params.username,
      email: ctx.params.email,
      password: await bcrypt.hash(ctx.params.password, 5),
      started: new Date(Date.now()),
      verified: false,
      verify_id: jwt.sign({ email: ctx.params.email }, privateKey)
    }

    try {
      emailCount = await this.actions.count({
        query: {
          email: ctx.params.email
        }
      })
    } catch (e) {
      return new MoleculerError('Could not search for matching users', 500, 'Server Error')
    }

    if(emailCount > 0) {
      return new MoleculerError('User already exists', 409, 'User Exists')
    }

    try {
      createdUser = await this.actions.create(user)
    } catch(e) {
      return new MoleculerError('Could not create User', 500, 'Server Error')
    }

    try {
      ctx.call('v1.user.sendVerifyId', {email: ctx.params.email, verify_id: createdUser.verify_id})
    } catch(e) {
      console.log(e.message)
    }

    return {
      token: jwt.sign({
        _id: createdUser._id,
        verified: false
      }, privateKey)
    }
  }
}