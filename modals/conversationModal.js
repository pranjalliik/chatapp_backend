import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema({
members: [ {   type : mongoose.Schema.ObjectId, ref : 'userModal', }],
lastMsg :  {   type : mongoose.Schema.ObjectId, ref : 'messageModal', },
isGroup : {type : Boolean,default : false},
name : {type : String},
photo : {type :String}
});

const Conversation = mongoose.models.Conversation || mongoose.model('conversationModal', ConversationSchema);

export default Conversation;
