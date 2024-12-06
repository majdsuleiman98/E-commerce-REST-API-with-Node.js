const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const { Product } = require('../models/Product');
const { Cupon } = require('../models/Cupon');
const ApiError = require('../utils/apiError');



const claculate_totalPrice = (cart)=>{
    let total_price = 0.0;
    cart.Items.forEach((item)=> {total_price += item.price * item.quantity});
    cart.totalPrice = total_price;
    cart.totalPriceAfterDiscount = undefined;
}

/**
 * @desc Add Product to cart
 * @route /api/cart
 * @method POST
 * @access private only logged user
 */
const AddToCart = asyncHandler(
    async(req,res)=>{
        const{ProductId,color}=req.body;
        const product = await Product.findById(ProductId);
        let cart = await Cart.findOne({user:req.user.id});
        if(!cart){
            cart = await Cart.create({
                user:req.user.id,
                Items:[{product:ProductId,seller:product.seller,color,price:product.price}]
            })
        }
        else{
            const productIndex = cart.Items.findIndex(item=>item.product.toString() === ProductId && item.color === color);
            //if product exists, quantity of product will be updated
            if(productIndex>-1)
            {
                const cartItem = cart.Items[productIndex];
                cartItem.quantity +=1;
            }
            //if product doesn't exist, product will be pushed to Items of cart
            else
            {
                cart.Items.push({product:ProductId,seller:product.seller,color,price:product.price});
            }  
        }
        claculate_totalPrice(cart);
        await cart.save();
        res.status(200).json({cart});
    }
)


/**
 * @desc Get cart of logged user
 * @route /api/cart/my-cart
 * @method GET
 * @access private only logged user
 */
const GetLoggedUserCart = asyncHandler(
    async(req,res,next)=>{
        const cart = await Cart.findOne({user:req.user.id}).populate({path:"Items.product",select:"name image slug"}).populate({path:"Items.seller",select:"name"});
        if(!cart){
            return next(new ApiError('Your cart is empty',404))
        }
        res.status(200).json({cart,cartLength:cart.Items.length});
    }
)

/**
 * @desc Remove item from cart
 * @route /api/cart/remove-item/itemId
 * @method PUT
 * @access private only logged user
 */
const RemoveItemFromCart = asyncHandler(
    async(req,res,next)=>{
        const cart = await Cart.findOneAndUpdate({user:req.user.id},{
            $pull:{
                Items:{_id:req.params.itemId}
            }
        },{new:true});
        if(!cart){
            return next(new ApiError('Your cart is empty',404));
        }
        claculate_totalPrice(cart);
        await cart.save();
        res.status(200).json({cart,cartLength:cart.Items.length});
    }
)

/**
 * @desc Remove cart
 * @route /api/cart/clean-cart
 * @method DELETE
 * @access private only logged user
 */
const CleanCart = asyncHandler(
    async(req,res,next)=>{
        const cart = await Cart.findOneAndDelete({user:req.user.id});
        if(!cart){
            return next(new ApiError('Your cart is empty',404));
        }
        res.status(200).json({message:'Cart Removed successfully'});
    }
)

/**
 * @desc Update quantity of specific item
 * @route /api/cart/update-quantity/itemId
 * @method PUT
 * @access private only logged user
 */
const UpdateQuantity = asyncHandler(
    async(req,res,next)=>{
        const cart = await Cart.findOne({user:req.user.id});
        if(!cart){
            return next(new ApiError('Your cart is empty',404));
        }
        const itemIndex = cart.Items.findIndex(item=>item._id.toString() === req.params.itemId);
        if(itemIndex<0){
            return next(new ApiError('Item nout found with this Id {req.params.itemId}',404));
        }
        cart.Items[itemIndex].quantity = req.body.quantity;
        claculate_totalPrice(cart);
        await cart.save();
        res.status(200).json({message:'Quantity of item updated successfully',cart});
    }
)

/**
 * @desc Apply cupon on cart
 * @route /api/cart/apply-cupon
 * @method PUT
 * @access private only logged user
 */
const ApplyCupon = asyncHandler(
    async(req,res,next)=>{
        const cupon = await Cupon.isValidCupon(req.body.cupon);
        if(!cupon){
            return next(new ApiError(`Invalid or expired coupon code ${req.body.code}`,400));
        }
        const cart = await Cart.findOne({user:req.user.id});
        cart.totalPriceAfterDiscount = (cart.totalPrice - (cart.totalPrice * cupon.discount)/100).toFixed(2);
        await cart.save();
        res.status(200).json({message:"Cupon applied successfully",cart});
    })

module.exports = {
    AddToCart,
    GetLoggedUserCart,
    RemoveItemFromCart,
    CleanCart,
    UpdateQuantity,
    ApplyCupon
}