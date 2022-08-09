import nodemailer from 'nodemailer'

const sendEmail = async options => {
    const transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "82d971f57c88f1",
          pass: "326959ae9a784f"
        }
    });

    const mailOptions = {
        from: 'Odedina Adewunmi <odgunnerz@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    await transport.sendMail(mailOptions)
}

export default sendEmail

  