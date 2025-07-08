import { readJSON, writeJSON } from '../utils.js'

const ORDER_FILE_PATH = './json/order.json'
const orders = readJSON(ORDER_FILE_PATH)

export class OrderModel {
  static async getAll () {
    return orders
  }

  static async getPendings () {
    const pendingOrders = orders.filter((order) => order.status === 'Pending')
    return pendingOrders
  }

  static async getOrderById (orderId) {
    const resp = orders.filter((order) => order.orderId === orderId)
    return resp[0]
  }

  static async getOrdersByRider (riderId, statusFilter = null) {
    let riderOrders

    if (statusFilter) {
      riderOrders = orders.filter((order) => order.riderId === riderId && order.status == statusFilter)
    } else {
      riderOrders = orders.filter((order) => order.riderId === riderId)
    }
    return riderOrders
  }

  static async chengeStatus (orderId, newStatus, riderId) {
    const index = orders.findIndex((order) => order.orderId === orderId)

    orders[index].status = newStatus
    
    if(newStatus == 'In Progress'){
      let confirmationCode = Math.floor(1000 + Math.random() * 9000);
      orders[index] = {
        ...orders[index],
        riderId: riderId,
        confirmationCode: confirmationCode
      }
    }

    writeJSON(ORDER_FILE_PATH, orders)

    return orders[index]
  }
}
