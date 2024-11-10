import express from 'express'
let authRouter = express.Router();
import signUp ,{signin,signout,protectRoute,verifyUser} from './../controllers/authController.js';
/*
authRouter
.route('/forgotpassword')
.post(forgotpass)

authRouter
.route('/resetpassword/:token')
.patch(resetpass)

authRouter
.route('/signin'
.post(signin)



authRouter.use(protectRoute)



authRouter
.route('/updatepassword')
.patch(updatepass)

authRouter.use(isAuthorized(['admin']))
authRouter
.route('/')
.get(getUser)

*/

authRouter.post('/signup',signUp)


authRouter.post('/signin',signin)





authRouter.get('/signout',protectRoute,signout)



export default authRouter;
