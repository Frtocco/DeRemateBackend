import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'deremate764@gmail.com',
    pass: 'uadeinformatica'
  }
});

export const sendResetEmail = async (to, token) => {
  const resetLink = `https://29c4-170-239-171-153.ngrok-free.app/reset-password?token=${token}`


  const mailOptions = {
    from: 'deremate764@gmail.com',
    to,
    subject: 'Recuperación de contraseña - DeRemate',
    text: `Hola! Para restablecer tu contraseña, hacé click en este enlace: ${resetLink}`,
    html: `<p>Hola!</p><p>Para restablecer tu contraseña, hacé click en el siguiente enlace:</p><a href="${resetLink}">${resetLink}</a><p>Si no lo solicitaste, ignorá este mensaje.</p>`
  }

  await transporter.sendMail(mailOptions)
}
