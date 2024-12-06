const mongoose = require('mongoose');


const cuponSchema = new mongoose.Schema({
    code:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        uppercase:true
    },
    discount:{
        type:Number,
        required:true,
        min:0,
        max:100
    },
    expirationDate:{
        type:Date,
        required:true
    }
},
{
    timestamps:true
});


cuponSchema.statics.isValidCupon = async function(code){
    const cupon = await this.findOne({code});
    if(!cupon || cupon.expirationDate < new Date()){
        return null;
    }
    return cupon;
}


const Cupon = mongoose.model('Cupon',cuponSchema);
module.exports = {Cupon};