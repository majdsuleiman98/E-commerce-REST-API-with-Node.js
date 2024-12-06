const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        minlength:3,
        maxlength:30,
    },
    slug: {
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
    toJSON:{virtuals:true,transform: (doc, ret) => { delete ret.id; }},
    toObject:{virtuals:true,transform: (doc, ret) => { delete ret.id; }}
})

//Get all subcategories when get one category
categorySchema.virtual(
    "subcategories",
    {
        ref:"Subcategory",
        localField:"_id",
        foreignField:"category"
    }
)


const Category = mongoose.model("Category",categorySchema);

module.exports = {
    Category
}