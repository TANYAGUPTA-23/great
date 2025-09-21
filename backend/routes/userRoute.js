import express from 'express';
import {loginUser , registerUser , adminLogin} from '../controllers/userController.js';

const userRouter = express.Router(); //lets you group routes for users.

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)


export default userRouter;