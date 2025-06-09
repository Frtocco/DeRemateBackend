import { Router } from 'express'
import { OrderModel } from '../models/order.js'
import { authMiddleware } from '../middlewares/auth.js'

export const orderRouter = Router()

orderRouter.get('/', authMiddleware, async (req, res) => {
  const orders = await OrderModel.getAll()
  res.json(orders)
})

orderRouter.get('/pendings', authMiddleware, async (req, res) => {
  const pendingOrders = await OrderModel.getPendings()
  res.json(pendingOrders)
})

orderRouter.get('/history', authMiddleware, async (req, res) => {
  const userId = req.user.id
  const { status } = req.query;

  console.log('Consulta de historial para este user id: ', userId)
  const orders = await OrderModel.getOrdersByRider(userId, status)
  res.json(orders)
})

orderRouter.put('/:orderId', authMiddleware, async (req, res) => {
  console.log('Entra');
  
  const { orderId } = req.params;
  const riderId = req.user.id
  const status = req.body.status
  
  const order = await OrderModel.chengeStatus(orderId, status, riderId)
  return res.status(200).json(order)
})
