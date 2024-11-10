import Conversation from "../modals/conversationModal.js";
import Message from "../modals/messageModal.js";
import catchAsync from "../utils/catchAsync.js";
import { addMsgToConversation } from "./msgController.js";
import mongoose from "mongoose";


const userModel = mongoose.connection.collection('usermodels');

export const getConversations = catchAsync(async (req,res,next)=>{
   
let user = req.user._id

const conversations = await Conversation.find({
  members: { $in: [user] }
})
  .populate({
    path: 'lastMsg',
    select: 'text conversation sender createdAt'
  })
  .exec();

// Sort conversations based on lastMsg.createdAt in descending order
conversations.sort((a, b) => {
  if (a.lastMsg && b.lastMsg) {
    return new Date(b.lastMsg.createdAt) - new Date(a.lastMsg.createdAt);
  }
  return 0;
});




  const populatedConversations = await Promise.all(
    conversations.map(async (conversation) => {
      // Fetch and filter member details, excluding the user with `req.user._id`
      const memberDetails = await Promise.all(
        conversation.members
          .filter(memberId => !memberId.equals(req.user._id)) // Exclude `req.user._id`
          .map(memberId => userModel.findOne({ _id: memberId }))
      );
  
      return {
        ...conversation.toObject(),
        members: memberDetails
      };
    })
  );
  



return  res.json({
     message : "user conversation ",
     data: populatedConversations
 })

}
)

export const getConvMsg = catchAsync(async(req,res,next)=>{

  let sender = req.user._id;
  let receiver = req.params.id;

  const conversation = await Conversation.findOne({
    members: { $all: [sender, receiver] },
    isGroup: false,
}).lean();

if(conversation){
  let msg = await Message.find({conversation : conversation._id}).sort({ createdAt: 1 });


return  res.json({
     message : "conversation messages",
     msg,conversation
        
 })

}

return  res.json({
   msg : [] ,
   conversation
  

})

})



export const createConversation = catchAsync(async(req,res,next)=>{

     let  sender = req.user._id

     let  receiver = req.body.receiver
   let  conversation = await Conversation.create({
        members: [sender , receiver]
      });




      const memberDetails = await Promise.all(
        conversation.members
          .filter(memberId => !memberId.equals(req.user._id)) // Exclude `req.user._id`
          .map(memberId => userModel.findOne({ _id: memberId })) // Query the `userModel` collection
      );
      
      // Add the populated members back to the conversation object
      conversation = {
        ...conversation.toObject(),
        members: memberDetails
      };

return  res.status(200).json({
  message : "conversation creeated",
 conversation : conversation
     
})

})