
import express from "express"
import {protectRoute} from "../controllers/authController.js"
import {getConversations,getConvMsg , createConversation} from "../controllers/conversationController.js"


const convRouter = express.Router();


convRouter.get('/',protectRoute, getConversations);
convRouter.get('/:id',protectRoute, getConvMsg);
convRouter.post('/',protectRoute, createConversation);


export default convRouter;