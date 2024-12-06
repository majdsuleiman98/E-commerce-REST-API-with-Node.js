const asyncHandler = require("express-async-handler");
const { User } = require("../models/User");

/**
 * @desc Add address
 * @route /api/address
 * @method PUT
 * @access private only logged in user
 */
const AddAddress = asyncHandler(async(req,res)=>{
    const user = await User.findByIdAndUpdate(req.user.id,{
        $addToSet:{
            addresses:req.body
        }
    },{new:true});
    res.status(200).json({message:"Address added successfully",data:user.addresses});
})

/**
 * @desc Remove address
 * @route /api/address
 * @method DELETE
 * @access private only logged in user
 */
const RemoveAddress = asyncHandler(async(req,res)=>{
    const user = await User.findByIdAndUpdate(req.user.id,{
        $pull:{
            addresses:{_id:req.body.addressId}
        }
    },{new:true});
    res.status(200).json({message:"Address removed successfully",data:user.addresses});
})


/**
 * @desc Get addresses of user
 * @route /api/address
 * @method GET
 * @access private only logged in user
 */
const GetAddress = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user.id);
    res.status(200).json({message:"Your addresses",data:user.addresses});
})


module.exports = {
    AddAddress,
    RemoveAddress,
    GetAddress
}