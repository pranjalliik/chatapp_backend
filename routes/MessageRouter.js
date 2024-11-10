import express from "express"
import {protectRoute} from "../controllers/authhController.js"
import { addMsgToConversation } from "../controllers/msgController.js";

const msgRouter = express.Router();



msgRouter.post('/',protectRoute, addMsgToConversation);


export default msgRouter;

