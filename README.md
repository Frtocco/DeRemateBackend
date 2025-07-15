# Backend para App de Pedidos con Validación de Usuario

Este backend provee los servicios necesarios para una app móvil de pedidos. Maneja el registro, autenticación de usuarios, validación vía email y operaciones relacionadas a pedidos, todo de forma segura mediante JWT y contraseñas encriptadas.

## 🚀 Funcionalidades principales

- 🔐 Registro y login con JWT
- ✉️ Validación de cuenta vía email con token
- 🔁 Cambio de contraseña seguro
- 📦 Gestión de pedidos asociados a usuarios
- 🔑 Contraseñas encriptadas (bcrypt)
- 🔒 Persistencia segura de sesiones (JWT)
- 📄 Almacenamiento en archivos JSON (sin base de datos)

## 🛠️ Tecnologías utilizadas

- Node.js
- Express
- JSON Web Tokens (JWT)
- bcryptjs
- nodemailer
- uuid

## 📩 Validación por email

Se genera un token firmado y se envía al correo del usuario con un enlace de verificación. Al hacer clic, el servidor valida el token y activa la cuenta.

## 🧪 Seguridad

- Hash de contraseñas con salt dinámico (bcrypt)
- Tokens firmados con clave secreta y expiración
- Sanitización básica de datos

## ▶️ Cómo ejecutar

bash
npm install
npm run dev
npm install bcrypt
npm install nodemailer
