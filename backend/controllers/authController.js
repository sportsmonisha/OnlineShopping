const catchAsyncError = require('../middlewares/catchAsyncError');
const User = require('../models/userModel');
const sendEmail = require('../utils/email');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwt');
const crypto = require('crypto')

// Register User -/api/v1/register
exports.registerUser = catchAsyncError(async(req,res,next) => {
    const {name, email, password} = req.body

    let avatar;

    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

    if(req.file){
        avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`; // Corrected here
    }

    const user = await User.create({
        name,
        email,
        password,
        avatar
    });
     sendToken(user,201,res)
    //  console.log(user)

    // const token = user.getJwtToken();

    //   res.status(201).json({
    //     success:true,
    //     user,
    //     token
    // })
})

// Login User -/api/v1/login
exports.loginUser = catchAsyncError(async (req,res,next)=>{
    const {email,password} = req.body;

    if(!email || !password){
        return next(new ErrorHandler('please enter email & password',400) )
    }

    // finding the user database
   const user = await User.findOne({email}).select('+password');

   if(!user){
    return next(new ErrorHandler('Invalid email or password',401))
   }
   
// validate
   const isPasswordValid = await user.isValidPassword(password);
   if(!isPasswordValid) {
     return next(new ErrorHandler('Invalid email or password',401))
   }

    sendToken(user,201,res);
    // console.log(user);

// const token = user.getJwtToken();

//       res.status(201).json({
//         success:true,
//         user,
//         token
//     })
});

// logout user--api/v1/logout

exports.logoutUser = (req,res,next) =>{
    res.cookie('token',null,{
        expires: new Date(Date.now()),
        httpOnly:true
    })
    .status(200)
    .json({
        success:true,
        message: "loggedout"
    })
};
// ForgotPassword--api/v1/password/forgot
exports.forgotPassword = catchAsyncError(async(req,res,next) =>{
   const user = await User. findOne({email:req.body.email});

   if(!user){
    return next(new ErrorHandler('User not found with this email',404))
   }
   
   const resetToken = user.getResetPasswordToken();
   await user.save({validateBeforeSave:false});

   let BASE_URL = process.env.FRONTEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }
   
    //Create reset url
    // const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    const resetUrl = `${BASE_URL}/password/reset/${resetToken}`;

    const message = `your password reset url is as follows :\n\n
    ${resetUrl} \n\n If you have not requested this email, then ingore it.`;

    try{

         await sendEmail({
            email: user.email,
            subject: "Shop Password Recovery",
            message,
        });

        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email}`,
        })

    }catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpire = undefined;
        await user.save({validateBeforeSave: false});

        return next(new ErrorHandler(error.message),500)
    }
});

// ResetPassword--api/v1//password/reset/token
exports.resetPassword = catchAsyncError(async (req,res,next)=>{
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordTokenExpire: {
        $gt : Date.now()
    }
  })

   if(!user){
     return next(new ErrorHandler('Password reset token is invalid or expired'));
   }

   if(req.body.password !== req.body.confirmPassword) {
     return next(new ErrorHandler('Password does not Password'));
   }

   user.password = req.body.password;
   user.resetPasswordToken = undefined;
   user.resetPasswordTokenExpire = undefined;
   await user.save({validateBeforeSave:false});

   sendToken(user,201,res)
})


// Get User Profile--api/v1/myprofile
exports.getUserProfile = catchAsyncError(async(req,res,next) => {
    const user = await User.findById(req.user.id)
    res.status(200).json({
        success:true,
        user
    })
});

// Change Password--/api/v1/password/change
exports.changePassword = catchAsyncError(async(req,res,next) => {
    const user = await User.findById(req.user.id).select('+password');

    // check old Password
    if(await user.isValidPassword(req.body.oldPassword)){
        return next(new ErrorHandler('Old password is incorrect',401));
    }

    // assigning new Password
    user.password = req.body.password;
    await user.save();
    
    res.status(200).json({
        success:true,
        message: 'Password change'

    })
})

// Update Profile -/api/v1/update
exports.updateProfile = catchAsyncError(async(req,res,next)=>{
    let newUserData = {
        name:req.body.name,
        email:req.body.email,
    }

    let avatar;

    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

    if(req.file){
        avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`; // Corrected here
        newUserData = {...newUserData,avatar}
    }

   const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
    })

    res.status(200).json({
        success:true,
        user,
    });
});

// Admin:Get All Users---/api/v1/admin/users
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
         success: true,
         users,
    });
 });

// Admin: Get Specific User--/api/v1/admin/user/id
exports.getUser = catchAsyncError(async(req,res,next) => {
  const user = await User.findById(req.params.id);

  if(!user){
        return next(new ErrorHandler(`User not found with this id ${req.params.id}`,404 ));
  }
  res.status(200).json({
    success:true,
    user,
  });
});

// Admin: Update User---/api/v1/admin/user/id
exports.updateUser = catchAsyncError(async(req,res,next)=>{
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }

   const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
    })

    res.status(200).json({
        success:true,
        user
    })
});

// Admin: Delete User--api/v1/admin/user/id
exports.deleteUser = catchAsyncError(async(req,res,next) =>{
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User not found with this id ${req.params.id}`))
    }
    await user.deleteOne();
    res.status(200).json({
        success:true
    })
})
