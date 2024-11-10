import express from 'express'
let userRouter = express.Router();
import { searchUser ,getUser} from '../controllers/userController.js';

userRouter.get('/searchUsers',searchUser)
userRouter.get('/:id',getUser)

export default userRouter