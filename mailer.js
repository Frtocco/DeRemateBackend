import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '0885e930a19835',
    pass: 'd7973dc3e33bd4fb5ae7e6ecd84e4cb8'
  }
});

export const sendResetEmail = async (to, token) => {
  const resetLink = `http://localhost:1234/reset-password?token=${token}`


  const mailOptions = {
      from: 'no-reply@deremate.com',
      to,
      subject: 'Recuperación de contraseña - DeRemate',
      text: `Hola! Para restablecer tu contraseña, hacé click en este enlace: ${resetLink}`,
      html: `<p>Hola!</p><p>Para restablecer tu contraseña, hacé click en el siguiente enlace:</p><a href="${resetLink}">${resetLink}</a><p>Si no lo solicitaste, ignorá este mensaje.</p>`
  }

  await transporter.sendMail(mailOptions)
}
