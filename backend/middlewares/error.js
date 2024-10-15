module.exports = ((err,req,res,next)=>{
    console.error(`Error stack: ${err.stack}`);
    err.statusCode = err.statusCode || 500;
    err.message = err. message || 'Internal server Error';

    

    if(process.env.NODE_ENV == 'development'){
    res.status(err.statusCode).json({
        success: false,
        message:err.message,
        stack:err.stack,
        // error:err
     });
        
    }

    if(process.env.NODE_ENV === 'production'){
        let error = {...err};
        let message = err.message;
        // let error = new Error(message);
        
        if(err.name ===  'ValidatorError'){
            message = Object.values(err.errors).map(value => value.message);
            error = new Error(message);
            err.statusCode = 400;
            err.message = `Validation Error: ${message.join(', ')}`;
            
        }
        if(err.name === 'CastError'){
            message = `Resource not found: ${err.path}`;
            // error = new Error(message);
            err.statusCode = 400;
        }

        if(err.code === 11000) {
            error.message = `Duplicate field value: ${Object.keys(err.keyValue)}`;
            // error = new Error(message);
            err.statusCode = 400;
        }
         
        
        if(err.name === 'JsonWebTokenError') {
             error. message = 'JSON web Token is invalid. Try again';
            // error = new Error(message);
            err.statusCode = 400;
        }

        if(err.name === 'TokenExpiredError') {
            error. message = 'JSON web Token is expired. Try again';
            // error = new Error(message);
            err.statusCode = 400;
        }

    //    return res.status(err.statusCode).json({
            // success: false,
            // message:error.message || 'Internal server Error',
        // });
    }else{
        return res.status(err.statusCode).json({
            success:false,
            // error:err,
            message:err.message,
            // stack:err.stack
            });
        }
        

});