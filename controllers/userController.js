import  userModel from './../modals/userm.js'
import catchAsync from '../utils/catchAsync.js'

export const searchUser = catchAsync(async(req,res,next)=>{
    const query = req.query.query; // Access the 'query' parameter
    if (!query) {
        return res.status(200).json({
           users : []
           })       }
      
      const users = await userModel.find({ 
        $or: [
          { name: { $regex: query, $options: 'i' } }, 
          { username: { $regex: query, $options: 'i' } } 
        ]
      });

      return res.status(200).json({
       users
       }) 
      
})








export const getUser = catchAsync(async(req,res,next)=>{

  const user = await userModel.find({ 
    _id : req.params.id
  });
  
  res.status(200).json({
      message : 'userDetails',
      user 
  })
})