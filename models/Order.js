const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    Items:[{
        product:{
            type:mongoose.Schema.ObjectId,
            ref:"Product",
        },
        seller: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        },
        color:String,
        price:Number,
        quantity:Number,       
        status: {
            type: String,
            enum: ["pending", "shipped", "delivered", "cancelled"],
            default: "pending",
        }
    }],
    shippingAddress:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User.addresses"
    },
    totalOrderPrice:{
        type:Number
    },
},{
    timestamps:true
});

orderSchema.pre(/^find/,function(next){
    this.populate({path:"Items.product",select:"name image"});
    next();
})

const Order = mongoose.model("Order",orderSchema);
module.exports = Order;