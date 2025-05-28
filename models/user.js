import { randomUUID } from 'node:crypto'
import { readJSON, writeJSON } from '../utils.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { sendVerificationEmail } from '../mailer.js'

const JWT_SECRET = 'clave_secreta'

const usersFilePath = './json/users.json'
const users = readJSON(usersFilePath)

export class UserModel {
  static async getAll () {
    return users
  }

  static async getById (id) {
    return users.find(user => user.id === id)
  }

  static async create (input) {
    const emailExists = users.some(user => user.email === input.email)
    const userExists = users.some(user => user.username === input.username)

    if (emailExists || userExists) {
      throw new Error('Credentials already in use')
    }

    const hashedPassword = await bcrypt.hash(input.password, 10)
    const id = randomUUID().toString()

    const newUser = {
      id,
      isVerified: false,
      ...input,
      password: hashedPassword
    }

    users.push(newUser)

    writeJSON(usersFilePath, users)

    const tokenPayload = {
      id: newUser.id,
      username: newUser.username
    }

    const token = jwt.sign(tokenPayload, JWT_SECRET)

    const tokenJson = {
      token
    }

    return tokenJson
  }

  static async delete (id) {
    const index = users.findIndex(user => user.id === id)
    if (index >= 0) {
      users.splice(index, 1)
      writeJSON(usersFilePath, users)
      return true
    }
    return false
  }

  static async update (id, input) {
    const index = users.findIndex(user => user.id === id)
    if (index >= 0) {
      users[index] = { ...users[index], ...input }
      writeJSON(usersFilePath, users)
      return users[index]
    }
    return false
  }

  static async authenticate (input) {
    const user = users.find(user => user.username.toLowerCase() === input.username.toLowerCase())

    if (!user) {
      return false
    }

    const passwordMatch = await bcrypt.compare(input.password, user.password)

    console.log('User ' + input.username + ' login attempt was ' + passwordMatch)

    if (passwordMatch) {
      const tokenPayload = {
        id: user.id,
        username: user.username
      }

      const token = jwt.sign(tokenPayload, JWT_SECRET)

      const tokenJson = {
        token
      }

      return tokenJson
    }

    return false
  }

  static async getUserFromToken (input) {
    const token = input.token
    console.log(token)
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      console.log(decoded.id)
      const user = await this.getById(decoded.id)
      return user
    } catch (error) {
      console.error('Token inválido:', error.message)
      return null
    }
  }

  static async getUserFromUsername (userId) {
    const user = users.find(user => user.id === userId)
    if (!user) {
      return false
    }
    return user
  }

  static async requestPasswordReset (email) {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())

    if (!user) {
      throw new Error('No existe un usuario con ese correo')
    }

    const resetToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '15m' })

    return { resetToken, message: 'Token de recuperación generado con éxito' }
  }

  static async resetPassword (token, newPassword) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      const userId = decoded.id

      const user = users.find(u => u.id === userId)
      if (!user) {
        throw new Error('Usuario no encontrado')
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10)
      user.password = hashedPassword

      writeJSON(usersFilePath, users)
      return { message: 'Contraseña actualizada con éxito' }
    } catch (err) {
      throw new Error('Token inválido o expirado')
    }
  }

  static async getByEmail (email) {
    return users.find(user => user.email === email)
  }

  static async sendVerificationEmail (input) {
    console.log(input.email)
    const user = await this.getByEmail(input.email)
    const verificationToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '24h' })
    sendVerificationEmail(input.email, verificationToken)
  }

  static verifyUser (user) {
    user.isVerified = true
    this.update(user.id, user)
    return true
  }

  static async isUserVerified(input){
    const user = users.find(user => user.username.toLowerCase() === input.username.toLowerCase())
    return(user.isVerified)
  }
}
