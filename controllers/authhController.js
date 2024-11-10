import axios from 'axios';
import catchAsync from '../utils/catchAsync.js';
import Conversation from '../modals/conversationModal.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'
const secret = "gyhuijofgratnmp9yn7rt1usnb73uihejkmse"

const userModel = mongoose.connection.collection('usermodels');
// Proxy Middleware to Validate JWT
export const protectRoute = catchAsync(async (req, res, next) => {
    //console.log(JSON.stringify(req.cookies) +'<-cookies obj')
         if(!req.cookies.jwt){
           return res.status(401).json({
             message:'token not present'
           }) }
 
           let token = req.cookies.jwt
 
    
 
 // token veriication
   
 const decoded = jwt.verify(token, secret);
// console.log(decoded)
 
 // check if user still exists
 const ObjectId = mongoose.Types.ObjectId;

 const fuser = await userModel.findOne({ _id: new ObjectId(decoded.id) });
 
 //console.log('user info-> ', fuser)
 if(!fuser){
     return res.status(401).json({
         message:'user no longer exists'
     }) 
 }
 
 req.user = fuser
next();

    })




export const validateConversationAccess = catchAsync(async (req, res, next) => {
    const conversationId = req.params.id;
    const userId = req.user._id;

        const conversation = await Conversation.findOne({
            _id: conversationId,
            members: userId,
        });

        if (!conversation) {
            return res.status(403).json({ message: 'Unauthorized request' });
        }

        // User is a member, proceed to the next middleware or handler
        next();
    })
 