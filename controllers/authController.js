import  userModel from './../modals/userm.js'
 import createResetToken  from '../modals/userm.js'
//const Email = require('../utils/email')
import Conversation from '../modals/conversationModal.js';

import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import catchAsync from './../utils/catchAsync.js'
import AppError from '../utils/appError.js'
const secret = "gyhuijofgratnmp9yn7rt1usnb73uihejkmse"
const saltRounds = 10;


const  signToken = id =>{
 return   jwt.sign({id },secret,{expiresIn: "1d"})
}

 let signUp = catchAsync(async(req,res,next)=>{
                
       let user = await userModel.create({
        name : req.body.name,
        username : req.body.username,
        password : req.body.password,
        confirmPassword : req.body.confirmPassword,
       });
        
       const token = signToken(user._id)
       const cookieopt = {
        expires: new Date(
          Date.now() + 1 * 24 *60 * 60 *1000), httpOnly : true , secure : true, sameSite : 'None' 
        }
   res.cookie('jwt',token,cookieopt)
  
       if(user){

       

           res.status(200).json({
               
               message:"user signed up",
               data : user ,
              
           })
       }
       else{
           res.json({
               message:"error "
           })
       }
  
   })

   export const signin = catchAsync(async(req,res,next)=>{
         let {username,password} = req.body
         const user = await userModel.findOne({username}).select('+password');
         if(!user || !(await user.correctPassword(password,user.password))){
                return res.status(401).json({
                   message:'wrong credentials'
                   }) 
                 }else{
             const token = signToken(user._id);
               const cookieopt = {
               expires: new Date(
               Date.now() + 1 * 24 *60 * 60 *1000), httpOnly:true , secure : true , sameSite : 'None' 
      
               }
           res.cookie('jwt',token,cookieopt)
           
             return res.status(200).json({
             message:'signin ',  
             user : user,
            
            }) 
            }

             })
   
             

             export const signout = catchAsync(async(req,res,next)=>{

              res.cookie('jwt',' ',{maxAge:1});
              res.json({
               message: "logged out"
              })
                    })


                    export const protectRoute = catchAsync(async (req, res, next) => {


                      //console.log(JSON.stringify(req.cookies) +'<-cookies obj')
                           if(!req.cookies.jwt){
                             return res.status(401).json({
                               message:'token not present'
                             }) }
                   
                             let token = req.cookies.jwt
                   
                      
                   
                   // token veriication
                   
                   const decoded = jwt.verify(token, secret);
                   
                   // check if user still exists
                   const fuser = await userModel.findById(decoded.id)
                   //console.log('user info-> ', fuser)
                   if(!fuser){
                       return res.status(401).json({
                           message:'user no longer exists'
                       }) 
                   }
                   
                   req.user = fuser
                   
                  next();
      
                      })
                    
                   export const verifyUser = catchAsync(async (req, res, next) => {


                        //console.log(JSON.stringify(req.cookies) +'<-cookies obj')
                             if(!req.cookies.jwt){
                               return res.status(401).json({
                                 message:'token not present'
                               }) }
                     
                               let token = req.cookies.jwt
                     
                        
                     
                     // token veriication
                     
                     const decoded = jwt.verify(token, secret);
                     
                     // check if user still exists
                     const fuser = await userModel.findById(decoded.id)
                     //console.log('user info-> ', fuser)
                     if(!fuser){
                         return res.status(401).json({
                             message:'user no longer exists'
                         }) 
                     }
                     
                     req.user = fuser
                     
                     res.json({
                      message: "route is protected",
                      data : fuser
                     })
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

   /*
   module.exports.isAuthorized =  function isAuthorized(roles) {
    
    return async function(req, res, next) {
      try {
        //console.log(req.user._id);
        
        if (roles.includes(req.user.role)) {
          if(req.user.role === 'admin'){
          next();
          }else  if(req.user.role === 'manager'){
           
            let tourId = req.params.id;
            let tour = await tourModel.findById(tourId); 
            let managerId = tour.manager;
            if(String(managerId[0]._id) === String(req.user._id)){
              next();
            } else{
        

              res.status(401).json({
                message: "manager not allowed"
              });
            }

          }
        } else {

          res.status(401).json({
            message: "not allowed"
          });
        }
      } catch (err) {
        res.status(500).json({
          message: err.message
        });
      }
    };
   }

  

  

/*
module.exports.forgotpass =async function forgotpass(req,res){
  try{
    
    const email = req.body.email;
    const user = await userModel.findOne({email})
    
    
    if(!user){
      res.json({
        message: "user not preseent"
      })
    }

    let token = await user.createResetToken();


  
      await user.save({validateBeforeSave :false})
    try {
    const reseturl = `localhost:3000/users/resetpassword/${token}` ;

    const msg = ` link ${reseturl}`

    await new Email(user, reseturl).sendPasswordReset();
    res.status(200).json({
      message: "mail sent to user"
    })
  }catch(err){
    user.resetToken = undefined
    user.passwordresetexpires = undefined
    await user.save({ validateBeforeSave : false})
    res.json({
      message: err.message,
      
})
  }
  }catch(err){
    res.json({
      message: err.message,
      
})
  }
}

exports.resetpass = catchAsync(async(req,res,next)=>{

  let resetToken = req.params.token
  hashedtoken = crypto
                .createHash('sha256')
                .update(resetToken)
                .digest('hex'); 

  const user = await userModel.findOne({resetToken :hashedtoken,
    passwordresetexpires : {$gt : Date.now()}
  });
  
  if(!user){
    return res.json({
      message:'token expired'
      }) 
  }

//

  user.password = req.body.password,
  user.confirmPassword = req.body.confirmPassword,
  user.resetToken = undefined
  user.passwordresetexpires = undefined
  await user.save()

const token = signToken(user._id)
const cookieopt = {
 expires: new Date(
   Date.now() + 10 * 24 *60 * 60 *1000),httpOnly:true
 
}
res.cookie('jwt',token,cookieopt)
      res.json({
        message: "password set",
        token : token
      })


})


export const updatepass = catchAsync(async(req,res,next)=>{

      let {password} = req.body
      const user = await userModel.findOne({username : req.user.username}).select('+password');
      if(!user || !(await user.correctPassword(password,user.password))){
          return res.status(401).json({
             message:'wrong credentialssss'
             }) 
           }else{
              user.password = req.body.newpassword,
              user.confirmPassword = req.body.confirmPassword

              const updatedpassworduser = await user.save()
              const token = signToken(user._id)
     const cookieopt = {
      expires: new Date(
        Date.now() + 2 * 24 *60 * 60 *1000),httpOnly:true
      
    }
 res.cookie('jwt',token,cookieopt)

     if(updatedpassworduser){
         res.json({
             
             message:"user signed up",
             data: user,
             token
         })
     }
     else{
         res.json({
             message:"error "
         })
     }

 }
})





// send jwt in cookie f=valid for 1 day
// after authentication add username inthe store so that i can acces user details
// now if i dont use persist store then if i refresh of switch tab i would need to login again even though i have an already existing jwt cookie with me
// but if i use persist store then the details of the user store would  be */



export default signUp
