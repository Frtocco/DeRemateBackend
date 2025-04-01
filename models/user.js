import { randomUUID } from 'node:crypto'
import { readJSON, writeJSON } from '../utils.js'

const usersFilePath = './users.json'
let users = readJSON(usersFilePath)

export class UserModel {
  static async getAll() {
    return users
  }

  static async getById(id) {
    return users.find(user => user.id === id)
  }

  static async create(input) {
    const newUser = {
      id: randomUUID().toString(),
      ...input
    }
    users.push(newUser)
    writeJSON(usersFilePath, users)
    return newUser
  }

  static async delete(id) {
    const index = users.findIndex(user => user.id === id)
    if (index >= 0) {
      users.splice(index, 1)
      writeJSON(usersFilePath, users)
      return true
    }
    return false
  }

  static async update(id, input) {
    const index = users.findIndex(user => user.id === id)
    if (index >= 0) {
      users[index] = { ...users[index], ...input }
      writeJSON(usersFilePath, users)
      return users[index]
    }
    return false
  }
}