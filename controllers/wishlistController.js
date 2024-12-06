const asyncHandler = require("express-async-handler")
const { User } = require("../models/User")



/**
 * @desc Add product to wish list
 * @route /api/wishlist
 * @method PUT
 * @access private only logged in user
 */
const AddToWishList = asyncHandler(
    async(req,res)=>{
    const user = await User.findByIdAndUpdate(req.user.id,{
        $addToSet:{
            wishlist:req.body.productId
        }
    },{new:true});
    res.status(200).json({message:'Product added to your wish list',data:user.wishlist});
})


/**
 * @desc Remove product to wish list
 * @route /api/wishlist
 * @method DELETE
 * @access private only logged in and owner user
 */
const RemoveFromWishList = asyncHandler(async(req,res)=>{
    const user = await User.findByIdAndUpdate(req.user.id,{
        $pull:{
            wishlist:req.body.productId
        }
    },{new:true});
    res.status(200).json({message:'Product removed to your wish list',data: user.wishlist});
})


/**
 * @desc Get wish list
 * @route /api/wishlist
 * @method GET
 * @access private only logged in and owner user
 */
const GetWishList = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user.id).populate('wishlist');
    res.status(200).json({message:'Your wish list',length:user.wishlist.length,data: user.wishlist});
})


module.exports = {
    AddToWishList,
    RemoveFromWishList,
    GetWishList
}