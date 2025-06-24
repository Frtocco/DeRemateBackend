import { readJSON } from '../utils.js'

const ORDER_FILE_PATH = './json/coments.json'
const coments = readJSON(ORDER_FILE_PATH)

export class ComentModel {
  static async getAll () {
    return coments
  }

  static async getComentByOrderID (orderID) {
    const coment = coments.filter((coment) => coment.orderId == orderID)
    return coment[0]
  }
}
