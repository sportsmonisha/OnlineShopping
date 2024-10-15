const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


const userScheme = new mongoose.Schema({
    name : {
        type:String,
        require:[true,'please enter name']
    },
    email:{
        type:String,
        required:[true,'please enter email'],
        unique:true,
        validate:[validator.isEmail,'please enter  vaild email address']
    },
    password:{
        type:String,
        required:[true,'please enter password'],
        maxlength:[6,'Password cannot exceed 6 charecters'],
        select:false
    },
    avatar:{
        type:String,
       
    },
    role:{
        type:String,
        default:'user'
    },
    resetPasswordToken:String,
    resetPasswordTokenExpire:Date,
    createrAt:{
        type:Date,
        default:Date.now
    }
})

userScheme.pre('save',async function (next) {
    if(!this.isModified('password')){
         next();
    }
    if(!this.password){
        throw new Error('Password i required to hash');
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next();
    
})

userScheme.methods.getJwtToken = function(){
   return jwt.sign({id:this.id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_TIME
    })
}

userScheme.methods.isValidPassword = async function(enteredPassword){
return bcrypt.compare(enteredPassword,this.password)
}

// resetPassword
   userScheme.methods.getResetToken = function(){
    
    // generate Token
   const token = crypto.randomBytes(20).toString('hex');
   
  //'generate Hash and set to resetPasswordToken
  this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
  

  //set token expire time
  this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000;

  return token;
  

};

let model = mongoose.model('User',userScheme);

module.exports = model;
 