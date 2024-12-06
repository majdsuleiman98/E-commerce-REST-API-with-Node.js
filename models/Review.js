const mongoose = require("mongoose");


const reviewSchema = new mongoose.Schema({
    title:{
        type:String
    },
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5,
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
    },
    product:{
        type:mongoose.Schema.ObjectId,
        ref:"Product",
        required:true,
    }
},{timestamps:true})


reviewSchema.pre(/^find/,function(next){
    this.populate({path:"user",select:"name image"});
    next();
})

const Review = mongoose.model("Review",reviewSchema);
module.exports={Review};