const mongoose = require("mongoose");


const subcategorySchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        unique:true,
        minlength:3,
        maxlength:30
    },
    slug:{
        type:String,
        lowercase:true
    },
    category:{
        type:mongoose.Schema.ObjectId,
        ref:'Category',
        required:true
    }
},
{
    timestamps:true,
    toJSON:{virtuals:true,transform: (doc, ret) => { delete ret.id; }},
    toObject:{virtuals:true,transform: (doc, ret) => { delete ret.id; }}

})

subcategorySchema.virtual(
    'products',
    {
        ref:'Product',
        localField:'_id',
        foreignField:'subcategory',
    }
)

const Subcategory = mongoose.model('Subcategory',subcategorySchema);

module.exports = {
    Subcategory
}