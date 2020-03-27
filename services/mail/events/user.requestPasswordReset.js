module.exports = {
  params: {
    to: {
      type: 'email',
      normalize: true
    },
    name: {
      type: 'string'
    },
    password_reset_id: {
      type: 'string'
    }
  },

  async handler(ctx) {
    try {
      await this.actions.send({
        to: ctx.params.to,
        template: 'request_password_reset',
        data: {
          name: ctx.params.name,
          password_reset_id: ctx.params.password_reset_id
        }
      })
    } catch(e) {
      console.log('could not send email')
    }
  }
}