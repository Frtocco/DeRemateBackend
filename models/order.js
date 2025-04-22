import { readJSON, writeJSON } from '../utils.js'

const ORDER_FILE_PATH = './json/order.json'
let orders = readJSON(ORDER_FILE_PATH)

export class OrderModel{
    static async getAll(){
        return orders
    }

    static async getPendings(){
        const pendingOrders = orders.filter((order) => order.status == 'Pending');
        return pendingOrders
    }

    static async getOrdersByRider(riderId){
        const riderOrders = orders.filter((order) => order.riderId == riderId);
        return riderOrders
    
    }

    static async chengeStatus(orderId, newStatus, riderId){
        
        const index = orders.findIndex((order) => order.orderId == orderId);
        
        orders[index].status = newStatus;
        orders[index].riderId = riderId

        writeJSON(ORDER_FILE_PATH,orders)

        return orders[index] 
    }
}
