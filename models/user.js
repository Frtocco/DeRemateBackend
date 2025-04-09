import { randomUUID } from 'node:crypto'
import { readJSON, writeJSON } from '../utils.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

const JWT_SECRET = 'clave_secreta'


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
    const emailExists = users.some(user => user.email === input.email);
    const userExists = users.some(user => user.username === input.username);

    if (emailExists || userExists) {
        throw new Error('Credentials already in use');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const id = randomUUID().toString();

    const token = jwt.sign(
      { id, username: input.username, email: input.email },
      JWT_SECRET
    );

    const newUser = {
      id,
      ...input,
      password: hashedPassword,
      jwt: token
    };

    users.push(newUser);
    writeJSON(usersFilePath, users);
    return newUser;
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

  static async authenticate(input) {
    
    const user = users.find(user => user.username === input.username);
    
    if (!user){ 
      return false; 
    }
    
    const passwordMatch = await bcrypt.compare(input.password, user.password);
    
    console.log("User " + input.username + " login attempt was " + passwordMatch)
    
    if (passwordMatch) {
      const tokenPayload = {
          id: user.id,
          username: user.username
      };

      const token = jwt.sign(tokenPayload, JWT_SECRET);
      
      const safeUser = {
        token: token,
        username: input.username,
        id: input.id
      }
      
      return {safeUser};
  }
    
    return false;
}

}