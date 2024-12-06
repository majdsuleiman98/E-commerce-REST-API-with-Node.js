const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
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
    image:{
        type:Object,
        default:{
            url:"",
            public_id:null,
        },
        required:true,
    }

},
{
    timestamps:true,
    toJSON:{virtuals: true,transform: (doc, ret) => { delete ret.id; }},
    toObject:{virtuals: true,transform: (doc, ret) => { delete ret.id; }},
})


brandSchema.virtual(
    'products',
    {
        ref:'Product',
        foreignField:'brand',
        localField:'_id'
    }
)

const Brand = mongoose.model('Brand',brandSchema);
module.exports = {Brand};