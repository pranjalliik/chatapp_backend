import dotenv from 'dotenv'
dotenv.config({path : './config.env'})

import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
const saltRounds = 10;
import crypto from 'crypto'




const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true ,
      /*  validate: function(){
            return  validator.validate(this.email) ;
        }*/
    },
    password:{
        type:String,
        required:true,
        select :false
    },
    confirmPassword:{
        type:String,
       required:true,

        validate: function(){
            return this.confirmPassword == this.password;
        }
    },
    photo:{
        type:String,
        default:'user'
    },
   resetToken : String,
   passwordresetexpires : Date,
});

userSchema.methods.createResetToken =async function(){
const token =  crypto.randomBytes(32).toString("hex");
//console.log('Generated Reset Token:', resetToken);
this.resetToken = crypto
                .createHash('sha256')
                .update(token)
                .digest('hex'); 

this.passwordresetexpires = Date.now() + 10 * 60 *1000;

return token;

}

/*
userSchema.methods.resetpasswordHandler = function(password,confirmpassword){
this.password=password;
this.confirmPassword = confirmpassword
this.resetToken= undefined;
}*/

userSchema.pre('save',function(next){
      if(!this.isModified('confirmPassword')) return next();

    this.confirmPassword = undefined;
    next()
});


userSchema.pre('save', async function(next) {
 
   
    if(!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(saltRounds);
   const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  
});

 userSchema.methods.correctPassword = async function(
    candidatePassword,userPassword){
 

    let matched =   bcrypt.compareSync(candidatePassword,userPassword )
     return matched;
}


const userModel = mongoose.model('userModel',userSchema);

export default userModel ;

