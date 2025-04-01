import { Router } from 'express';
import { UserModel } from '../models/user.js';
import {validateUser, validatePartialUser} from '../userSchema.js'

export const userRouter = Router();

userRouter.get('/', async (req, res) => {
    const users = await UserModel.getAll();
    res.json(users);
})

userRouter.get('/:id', async (req, res) => {
    const { id } = req.params;
    const foundUser = await UserModel.getById(id);
    if (foundUser) {
        res.json(foundUser);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

userRouter.post('/', async (req, res) => {
    const result = await validateUser(req.body);
    if(result.error) {
        res.status(422).json({message: result.error.message});
        return;
    }
    const newUser = await UserModel.create(req.body); 
    res.status(201).json(newUser); 
});

userRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const deletedUser = await UserModel.delete(id);
    if (deletedUser) {
        res.status(200).json({ message: 'User successfully deleted' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Actualizar un usuario por ID
userRouter.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const updatedUser = await UserModel.update(id, req.body); // Usar req.body para los datos a actualizar
    if (updatedUser) {
        res.status(200).json(updatedUser);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});
