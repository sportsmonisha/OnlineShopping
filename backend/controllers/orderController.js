const catchAsyncError = require('../middlewares/catchAsyncError');
const Order = require('../models/orderModel');
const Product = require('../models/productModel'); 
const ErrorHandler = require('../utils/errorHandler');
//Create New Order - api/v1/order/new
exports.newOrder =  catchAsyncError( async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user.id
    })

    res.status(200).json({
        success: true,
        order
    })
});

// Get single Order--api/v1/order/:
exports. getSingleOrder = catchAsyncError(async(req,res,next) =>{
    const order = await Order.findById(req.params.id).populate('user','name email');
    
    if(!order) {
        return next(new ErrorHandler(`Order not found with this id:${req.params.id}`,404));
    }

    res.status(200).json({
        success:true,
        order
    })

})

// Get loggedin User order -- api/v1/myOrder
exports.myOrder = catchAsyncError(async(req,res,next)=>{
    const orders = await Order.find({user:req.user.id})

    res.status(200).json({
        success:true,
        orders
    })
})

//  Get All Orders --api/v1/orders
exports.orders = catchAsyncError(async(req,res,next)=>{
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach(order =>{
        totalAmount += order.totalPrice
    })

    res.status(200).json({
        success:true,
        totalAmount,
        orders
    })
})

//Admin Update Order -- api/v1/update/:id
exports.updateOrder = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);
    
        if(order.orderStatus === 'Delivered'){
        return next(new ErrorHandler('Order has been aready delivered!',400));
    }
    
    await Promise.all(order.orderItems.map(async orderItem => {
        await updateStock(orderItem.product, orderItem.quantity);
    }));

 // updating the product stock of each order item
  // order.orderItems.forEach(async (orderItem) =>{
    //     console.log("Order Item:", orderItem);
    //     await updateStock(orderItem.product, orderItem.quantity);
    // });
    order.orderStatus = req.body.orderStatus;
    order.deliveredAt = Date.now();
    await order.save();

    res.status(200).json({
        success:true
    });
});


async function updateStock (productId, quantity) {
    const product = await Product.findById(productId);

    if(!product){
        console.log("Product not found:", productId);
        return;
    }
    console.log("Current stock:", product.stock);
    product.stock = product.stock - quantity;

try{
   await product.save({validateBeforeSave: false});
}catch(error){
   console.log("Updated stock:", product.stock-quantity);
}};

// Admin :Delete Order--api/v1/order/:id
exports.deleteOrder = catchAsyncError(async(req,res,next)=>{
 const order = await Order.findById(req.params.id);

 if(!order){
    return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`,400));
 }

 await order.deleteOne();
 res.status(200).json({
    success:true
 })
})