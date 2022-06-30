const nodeMailer = require('nodemailer');

class MailSender {
  constructor() {
    this._transporter = nodeMailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  sendMail(targetMail, type, content) {
    const message = {
      from: 'GiveTakeApp <admin@givetakeandroid.com>',
      to: targetMail,
      subject: type,
      text: content,
    };

    return this._transporter.sendMail(message);
  }
}

module.exports = MailSender;
