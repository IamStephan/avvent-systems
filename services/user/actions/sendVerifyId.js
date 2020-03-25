const nodemailer = require('nodemailer')
const { MoleculerError } = require('moleculer').Errors;

module.exports = {
  visibility: 'public',

  params: {
    email: {
      type: 'email',
      normalize: true
    },
    verify_id: {
      type: 'string'
    }
  },

  async handler(ctx) {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'avventsystemstest@gmail.com',
        pass: '135798642Awe'
      }
    })

    let mailOptions = {
      to: ctx.params.email,
      subject: 'Welcome, please verify you account',
      text: ctx.params.verify_id
    }

    try {
      transporter.sendMail(mailOptions)
    } catch(e) {
      console.log(`Email not sent to: ${ctx.params.email}`)
    }
  }
}