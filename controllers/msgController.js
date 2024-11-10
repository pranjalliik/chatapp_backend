import Conversation from "../modals/conversationModal.js";
import Message from "../modals/messageModal.js";
import catchAsync from "../utils/catchAsync.js";

// add middleware to chaeck if user logged in.
/*
export const getConversationMsg = catchAsync(async (req,res,next)=>{
   
    let id = req.params.id;




let msg = await Message.find({conversation : id}).sort({ createdAt: 1 });

console.log(msg)

return  res.json({
     message : "conversation messages",
     data: msg
 })

}
)*/



export const addMsgToConversation = catchAsync(async ( req,res,next) => {

        // Check if a conversation exists with both members
        let senderId = req.user._id
        let conversationId = req.body.conversation
        let text = req.body.text
        const conversation = await Conversation.findOne({
           _id :conversationId,
           members : senderId
        });

        if (!conversation) {
            throw new Error('Unauthorized: Conversation not found or access denied.');
        }

        // If conversation exists, add the message to the conversation
        // Assuming a separate Message model or schema for messages
        const newMessage = await Message.create({
            text: text,
            conversation: conversationId,
             sender: senderId,
           });

        conversation.lastMsg = newMessage._id;
        await conversation.save();
  
        return  res.json({
            message : "msg creeated",
           msg : newMessage
               
          })
   
});

