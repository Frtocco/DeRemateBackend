import express, { json } from 'express' // require -> commonJS
import { userRouter } from './routes/users.js'
import { orderRouter } from './routes/orders.js'
import { comentRouter } from './routes/coments.js'

const app = express()
app.use(express.json())
app.disable('x-powered-by')

app.use('/users', userRouter)
app.use('/orders', orderRouter)
app.use('/coments', comentRouter)

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
