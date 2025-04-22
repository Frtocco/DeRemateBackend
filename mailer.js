import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'deremate764@gmail.com',
    pass: 'qaizvqigmfrolqrd'
  }
});

export const sendVerificationEmail = async (to, token) => {
  const verificationLink = `http://localhost:1234/users/verify?token=${token}`

  console.log(verificationLink)

  const mailBody = {
    from: 'deremate764@gmail.com',
    to,
    subject: 'Verificar email - DeRemate',
    text: `Hola! Para restablecer tu contraseña, hacé click en este enlace: ${verificationLink}`,
    html: `<p>Hola!</p><p>Para verifica tu email, hacé click en el siguiente enlace:</p><a href="${verificationLink}">${verificationLink}</a>`
  }

  await transporter.sendMail(mailBody)

}

export const sendResetEmail = async (to, token) => {
  const resetLink = `http://localhost:1234/reset-password?token=${token}`

  const mailOptions = {
    from: 'deremate764@gmail.com',
    to,
    subject: 'Recuperación de contraseña - DeRemate',
    text: `Hola! Para restablecer tu contraseña, hacé click en este enlace: ${resetLink}`,
    html: `<p>Hola!</p><p>Para restablecer tu contraseña, hacé click en el siguiente enlace:</p><a href="${resetLink}">${resetLink}</a><p>Si no lo solicitaste, ignorá este mensaje.</p>`
  }

  await transporter.sendMail(mailOptions)
}
