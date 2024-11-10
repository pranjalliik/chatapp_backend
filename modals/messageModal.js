import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    text : {type : String} ,
conversation:  {   type : mongoose.Schema.ObjectId, ref : 'conversationModal', },
sender :  {   type : mongoose.Schema.ObjectId, ref : 'userModal', },
createdAt: { type: Date, default: Date.now },

});

const Message = mongoose.models.Message || mongoose.model('messageModal', MessageSchema);

export default Message;
