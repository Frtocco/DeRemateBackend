import { Router } from 'express'
import QRCode from 'qrcode'
import { OrderModel } from '../models/order.js'

export const qrRouter = Router()

qrRouter.get('/', async (req, res) => {
  const pendingOrders = await OrderModel.getPendings()
  const selectedOrderId = req.query.orderId || ''
  let qrHtml = ''
  if (selectedOrderId) {
    const qrDataUrl = await QRCode.toDataURL(selectedOrderId)
    qrHtml = `
      <h2 style="color:#333;">QR generado para Order ID: ${selectedOrderId}</h2>
      <img src="${qrDataUrl}" alt="QR" style="border:1px solid #ccc; padding:10px; width:300px; height:300px;"/>
    `
  }

  res.send(`
    <div style="font-family:sans-serif; max-width:500px; margin:40px auto;">
      <h2 style="color:#1976d2;">Órdenes Pendientes</h2>
      <ul style="list-style:none; padding:0;">
        ${pendingOrders.map(order => `
          <li style="margin-bottom:10px; background:#f5f5f5; padding:10px; border-radius:5px;">
            <form method="GET" action="/qr" style="display:inline;">
              <input type="hidden" name="orderId" value="${order.orderId}" />
              <strong>${order.orderId}</strong> - ${order.address}
              <button type="submit" style="margin-left:10px; padding:4px 10px; background:#1976d2; color:#fff; border:none; border-radius:3px; cursor:pointer;">
                Generar QR
              </button>
            </form>
          </li>
        `).join('')}
      </ul>
      ${qrHtml}
    </div>
  `)
})
