import { randomUUID } from 'node:crypto'
import { readJSON, writeJSON } from '../utils.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

const JWT_SECRET = 'clave_secreta'


const usersFilePath = './json/users.json'
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

    const newUser = {
      id,
      isVerified: false,
      ...input,
      password: hashedPassword
    };

    users.push(newUser);
    
    writeJSON(usersFilePath, users);
    
    const tokenPayload = {
      id: newUser.id,
      username: newUser.username
    }

    const token = jwt.sign(tokenPayload, JWT_SECRET);
      
      const tokenJson = {
        token: token
      }

    return tokenJson;
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
    
    const user = users.find(user => user.username.toLowerCase() === input.username.toLowerCase());
    
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
      
      const tokenJson = {
        token: token
      }
      
      return tokenJson;
  }
    
    return false;
}
  static async getUserFromToken(input){
    const token = input.token
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return this.getUserFromUsername(decoded.id)
    } catch (error) {
        console.error('Token inválido:', error.message);
        return null;
    }
  }
  
  static async getUserFromUsername(userId){
    const user = users.find(user => user.id.toLowerCase() === userId.toLowerCase());
    if(!user){
      return false
    }
    return user
  }

}