import express from 'express';
import { getUsers, getUser, createUser, userValidator, modifyUser, deleteUser } from '../controllers/userControllers.js';

const usersRouter = express.Router();

usersRouter.get('/', getUsers);
usersRouter.get('/:id', getUser);
usersRouter.post('/',userValidator, createUser);
usersRouter.put('/:id',userValidator, modifyUser);
usersRouter.delete('/:id', deleteUser);



export default usersRouter;