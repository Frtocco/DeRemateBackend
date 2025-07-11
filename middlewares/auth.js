import jwt from 'jsonwebtoken'
const JWT_SECRET = 'clave_secreta'

export function authMiddleware (req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded // Generar el nombre de usuario a partir del token
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}
