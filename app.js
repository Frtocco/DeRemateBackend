import express from 'express' // require -> commonJS
import { userRouter } from './routes/users.js'
import { orderRouter } from './routes/orders.js'
import { corsMiddleware } from './middlewares/cors.js'
import { qrRouter } from './routes/qrcode.js'

const app = express()
app.use(corsMiddleware())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.disable('x-powered-by')

app.use('/users', userRouter)
app.use('/orders', orderRouter)

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})

app.use('/qr', qrRouter)
