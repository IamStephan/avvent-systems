module.exports = {
  params: {
    to: {
      type: 'email',
      normalize: true
    },
    name: {
      type: 'string'
    },
    verify_id: {
      type: 'string'
    }
  },

  async handler(ctx) {
    try {
      this.actions.send({
        to: ctx.params.to,
        template: 'verify',
        data: {
          name: ctx.params.name,
          verify_id: ctx.params.verify_id
        }
      })
    } catch (e) {
      console.log('could not send email')
    }

  }
}