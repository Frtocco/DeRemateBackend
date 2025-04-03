import express from 'express';
import https from 'https';
import fs from 'fs';
import { userRouter } from './routes/users.js';

const app = express();
app.use(express.json());
app.disable('x-powered-by');

app.use('/users', userRouter);

const PORT = process.env.PORT ?? 1234;

// Cargar los certificados
const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
};

// Crear el servidor HTTPS
https.createServer(options, app).listen(PORT, () => {
  console.log(`Server listening on https://localhost:${PORT}`);
});