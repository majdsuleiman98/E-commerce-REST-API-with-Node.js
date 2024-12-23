const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        minlength:3,
        maxlength:30
    },
    slug:{
        type:String,
        lowercase:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        minlength:8
    },
    phone:{
        type:String,
        required:true,
        trim:true,
    },
    image:{
        type:Object,
        default:{
            url:String,
            public_id:null,
        }
    },
    role:{
        type:String,
        enum:['admin','seller','user'],
        default:'user',
    },
    tax_number:{
        type:String,
        required:function(){
            return this.role == 'seller'
        },
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    otp:{
        code:String,
        expiry:Date
    },
    wishlist:[{
        type:mongoose.Schema.ObjectId,
        ref:'Product'
    }],
    addresses:[{
        Id:{
            type:mongoose.Schema.Types.ObjectId
        },
        type:{
            type:String,
            enum:['home','school','work'],
            default:'home'
        },
        city:String,
        region:String,
        street:String,
        buildingNo:String,
        apartmentNo:String
    }],
},{timestamps:true});

userSchema.pre('save',async function(next){
    if (!this.isModified('password')) return next();
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password,salt);
    next();
})

const User = mongoose.model('User',userSchema);
module.exports = {User};