import { Router } from 'express';
import { OrderModel } from '../models/order.js';

export const orderRouter = Router();

orderRouter.get('/', async (req,res) => {
    const orders = await OrderModel.getAll()
    res.json(orders)
})

orderRouter.get('/pendings', async (req,res) => {
    const pendingOrders = await OrderModel.getPendings()
    res.json(pendingOrders)
})

orderRouter.get('/history', async(req,res)=>{
    const { riderId } = req.query;
    console.log("Consulta de historial para este rider id: ",riderId);
    const orders = await OrderModel.getOrdersByRider(riderId)
    res.json(orders)
})

orderRouter.put('/:orderId', async(req, res) =>{
    const { orderId } = req.params;
    const { status, riderId } = req.body;

    const order = await OrderModel.chengeStatus(orderId, status,riderId)
    return res.json(order)
})