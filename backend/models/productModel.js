const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please entre the product name"],
        trim:true,
        maxlength:[100,"product name cannot exceed 100 characters"]
    },
    price:{
        type:Number,
        required:true,
        default:0.0
    },
    description:{
        type:String,
        required:[true,"please enter product description"]
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
        {
            image:{
                type:String,
                required:true
            }
        }
    ],
    category:{
        type:String,
        required:[true,"please enter product caregory"],
        enum: { 
            values: [
                'Oil',
                'Snacks',
                'Fruits & Veg',
                'Fast Food',
                'Meats',
                'Nuts',
                'Breakfast',
                'Kitchen'
            ],
            message:"please select correct category"
        }
    },
    seller:{
        type:String,
        require:[true,"please enter product seller"]
    },
    stock:{
        type:Number,
        required:[true,"please enter product stock"],
        maxlength:[20,"product stock cannot exceed 20"]

    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User'
            },
            rating:{
                type:String,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId
    },
    createrAt:{
        type:Date,
        default:Date.now()
    }    
})



let schema=mongoose.model('Product',productSchema)

module.exports = schema
