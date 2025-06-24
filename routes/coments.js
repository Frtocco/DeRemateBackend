import { Router } from 'express'
import { ComentModel } from '../models/coment.js'

export const comentRouter = Router()

comentRouter.get('/:orderId', async (req, res) => {
    console.log('Entrada en la ruta')
  const { orderId } = req.params
  const coment = await ComentModel.getComentByOrderID(orderId)
  console.log('devolver' + coment)
  return res.json(coment)
})
