import { Router } from 'express';
import { UserModel } from '../models/user.js';
import {validateUser, validatePartialUser} from '../userSchema.js'

export const userRouter = Router();

userRouter.get('/', async (req, res) => {
    const users = await UserModel.getAll();
    console.log('Pegaron en la API')
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
// Register
userRouter.post('/', async (req, res) => {
    try{    
        const result = await validateUser(req.body);
        if(result.error) {
            res.status(422).json({message: result.error.message});
            return;
        }

        const newUser = await UserModel.create(req.body); 
        res.status(201).json(newUser);
    } catch(error) {
        res.status(400).json({message: error.message});
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
// Login 
userRouter.post('/login', async (req, res) => {
    try {

        const result = await validatePartialUser(req.body);
   
        if (result.error) {
            return res.status(422).json({ message: result.error.message });
        }

        const authResult = await UserModel.authenticate(req.body);

        if (authResult) {
            return res.status(200).json({
                message: 'Login successful',
                token: authResult.token,
                user: authResult.user
            });
        }

        return res.status(401).json({ message: 'Invalid credentials' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
