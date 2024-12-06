const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    Items:[{
        product:{
            type:mongoose.Schema.ObjectId,
            ref:"Product"
        },
        seller: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        },
        color:String,
        price:Number,
        quantity:{
            type:Number,
            default:1
        }
    }],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    totalPrice:Number,
    totalPriceAfterDiscount:Number
},
{
    timestamps:true
});

const Cart = mongoose.model('Cart',cartSchema);
module.exports = Cart;