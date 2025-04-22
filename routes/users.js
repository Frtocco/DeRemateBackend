import { Router } from 'express';
import { UserModel } from '../models/user.js';
import { validateUser, validatePartialUser } from '../userSchema.js';
import { sendResetEmail } from '../mailer.js';
import { randomUUID } from 'node:crypto';
import { readFile, writeFile } from 'fs/promises';

const writeJSON = async (path, data) => {
  try {
    await writeFile(path, JSON.stringify(data, null, 2));
    console.log('Archivo JSON actualizado con éxito.');
  } catch (error) {
    console.error('Error al escribir el archivo JSON:', error);
  }
};

const readJSON = async (path) => {
  try {
    const data = await readFile(path, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer el archivo JSON:', error);
    return [];
  }
};

export const userRouter = Router();

userRouter.get('/', async (req, res) => {
  const users = await UserModel.getAll();
  console.log('Pegaron en la API');
  res.json(users);
});

userRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  const foundUser = await UserModel.getById(id);
  if (foundUser) {
    res.json(foundUser);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Register
userRouter.post('/', async (req, res) => {
  try {
    const result = await validateUser(req.body);
    if (result.error) {
      res.status(422).json({ message: result.error.message });
      return;
    }

    const token = await UserModel.create(req.body);
    res.status(201).json(token);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete user by id
userRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const deletedUser = await UserModel.delete(id);
  if (deletedUser) {
    res.status(200).json({ message: 'User successfully deleted' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Edit user by id
userRouter.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const updatedUser = await UserModel.update(id, req.body);
  if (updatedUser) {
    res.status(200).json(updatedUser);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// check JWT
userRouter.post('/jwt', async (req, res) => {
  const token = req.body;
  console.log(token);
  try {
    const user = await UserModel.getUserFromToken(token);

    if (user) {
      return res.status(200).json(user);
    }

    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    console.error('Error al verificar token:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Login
userRouter.post('/login', async (req, res) => {
  try {
    const result = await validatePartialUser(req.body);

    if (result.error) {
      return res.status(422).json({ message: result.error.message });
    }

    const authResult = await UserModel.authenticate(req.body);

    if (authResult) {
      return res.status(200).json(authResult);
    }

    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Forgot password
userRouter.post('/forgot-password', async (req, res) => {
  console.log('Se recibió solicitud de recuperación:', req.body);
  const { email } = req.body;

  const users = await readJSON('./json/users.json'); // Cargar los usuarios

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(200).json({ message: 'Si el correo está registrado, recibirás un email' });
  }

  const token = randomUUID();
  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 1000 * 60 * 10; // 10 minutos

  try {
    await writeJSON('./json/users.json', users); // Guardar el cambio en el archivo JSON
    await sendResetEmail(email, token);
    return res.status(200).json({ message: 'Email enviado' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al enviar el email' });
  }
});

// Send email verification
userRouter.post('/emailVerification', async (req, res) => {
  console.log('pegamos en la verificacion')
  try{
    await UserModel.sendVerificationEmail(req.body);
    console.log('deberia andar')
    return res.status(200).json({ message: 'Email enviado correctamente' });
  }catch(error){
    console.error(error);
    return res.status(500).json({ message: 'Error al enviar el email' });
  }

});
//Verificar al usuario cuando clickea el link enviado
userRouter.get('/verify/', async (req, res) => {
  const token = req.query.token;

  if (!token) {
    return res.status(400).send('Falta el token');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).send('Usuario no encontrado');
    }
    user.isVerified = true;
    await updateUser(userId, user);
    return res.status(200);
  } catch (error) {
    console.error(error);
    return res.status(400).send('Token inválido o expirado');
  }
})

// Reset password
userRouter.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token y nueva contraseña requeridos' });
  }

  try {
    const result = await UserModel.resetPassword(token, newPassword);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
