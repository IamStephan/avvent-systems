'use strict'
const bcrypt = require('bcrypt')
const { MoleculerError } = require('moleculer').Errors

module.exports = {
  visibility: 'published',

  params: {
    password_reset_id: {
      type: 'string'
    },
    email: {
      type: 'email',
      normalize: true
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
    let user
    let updatedUser
    try {
      user = await this.actions.find({
        query: {
          email: ctx.params.email
        }
      })
    } catch(e) {
      return new MoleculerError('Could not fetch user', 500, 'Could not fetch user')
    }

    if(user.length === 0) {
      return new MoleculerError('User does not exist', 404, 'User does not exist')
    }

    if(!user[0].password_reset_id) {
      return new MoleculerError('User did not request password reset', 404, 'User did not request password reset')
    }

    if(user[0].password_reset_id !== ctx.params.password_reset_id) {
      return new MoleculerError('Not authorized', 401, 'Not authorized')
    }

    try {
      updatedUser = await this.actions.update({
        _id: user[0]._id,
        password: await bcrypt.hash(ctx.params.password, 5),
        password_reset_id: ''
      })
    } catch(e) {
      return new MoleculerError('Could not update user', 500, 'Could not update user')
    }

    return {
      message: 'Password has been reset'
    }
  }
}