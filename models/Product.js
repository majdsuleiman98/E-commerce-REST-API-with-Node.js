const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        minlength:3,
        maxlength:30
    },
    slug:{
        type:String,
        lowercase:true
    },
    description:{
        type:String,
        required:true,
        trim:true,
        minlength:20
    },
    quantity:{
        type:Number,
        required:true,
        min:1
    },
    sold:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        required:true,
        min:1
    },
    price_after_discount:{
        type:Number,
        min:0
    },
    colors:[String],
    image:{
        type:Object,
        default:{
            url:"",
            public_id:null,
        },
        required:true,
    },
    category:{
        type:mongoose.Schema.ObjectId,
        ref:'Category',
        required:true
    },
    subcategory:[{
        type:mongoose.Schema.ObjectId,
        ref:'Subcategory',
        required:true
    }],
    brand:{
        type:mongoose.Schema.ObjectId,
        ref:'Brand',
    },
    seller:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    ratings_average:{
        type:Number,
        min:1,
        max:5
    },
    ratings_quantity:{
        type:Number,
        default:0
    }
},
{
    timestamps:true,
    toJSON:{virtuals:true,transform: (doc, ret) => { delete ret.id; }},
    toObject:{virtuals:true,transform: (doc, ret) => { delete ret.id; }}
});

//Get all reviews when get one product
productSchema.virtual(
    "reviews",
    {
        ref:"Review",
        localField:"_id",
        foreignField:"product"
    }
)

const Product = mongoose.model('Product',productSchema);
module.exports = {Product}