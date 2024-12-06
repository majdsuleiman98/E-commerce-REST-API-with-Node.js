const asyncHandler = require("express-async-handler");
const Order = require("../models/Order")
const ApiError = require("../utils/apiError"); 
const Cart = require("../models/Cart");
const { Product } = require("../models/Product");
const { User } = require("../models/User");


/**
 * @desc Create order
 * @route /api/order
 * @method POST
 * @access private only logged user
 */
exports.createOrder = asyncHandler(
    async(req,res,next)=>{
        const cart = await Cart.findOne({user:req.user.id});
        if(!cart){
            return next(new ApiError('Cart not found',404));
        }
        const cartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalPrice;
        const order = await Order.create({
            user:req.user.id,
            Items:cart.Items,
            totalOrderPrice:cartPrice,
            shippingAddress:req.body.address,
        });
        if(order){
            const blukOptions = cart.Items.map((item)=>({
                updateOne:{
                    filter:{_id:item.product},
                    update:{$inc:{quantity: -item.quantity, sold: +item.quantity}}
                }
            }));
            await Product.bulkWrite(blukOptions,{});
            await Cart.findOneAndDelete({user:req.user.id});
        }
        res.status(201).json({message:"Order created successfully",order});
    }
)
/**
 * @desc Get orders of one user
 * @route /api/order
 * @method GET
 * @access private only logged user
 */
exports.GetOrdersOfUser = asyncHandler(
    async(req,res)=>{
        const orders = await Order.find({user:req.user.id}).populate({path:"Items.seller",select:"name"});
        res.status(200).json({message:"Your orders",orders});
    }
)

/**
 * @desc Get specific order of one user
 * @route /api/order/:id
 * @method GET
 * @access private only logged user
 */
exports.GetSpecificOrderOfUser = asyncHandler(
    async(req,res,next)=>{
        const order = await Order.findById(req.params.id).populate({path:"Items.seller",select:"name"});
        if(!order){
            return next(new ApiError(`Order not found with this ID ${req.params.id}`,404));            
        }
        const user = await User.findById(req.user.id);
        const shippingAddress = user.addresses.find(address => address._id.equals(order.shippingAddress));
        order._doc.shippingAddress = shippingAddress;
        res.status(200).json(order);        
})


/**
 * @desc Get orders of one seller
 * @route /api/orders/seller
 * @method GET
 * @access private only logged seller
 */
exports.GetOrdersOfSeller = asyncHandler(
    async(req,res)=>{
        const orders = await Order.find({"Items.seller":req.user.id}).lean();
        const sellerOrders = orders.map(order => ({
            _id: order._id,
            user: order.user,
            shippingAddress: order.shippingAddress,
            Items: order.Items.filter(item => item.seller.toString() === req.user.id)
        }));
        res.status(200).json({Orders:sellerOrders});
})

/**
 * @desc update status of one product by seller
 * @route /api/orders/seller
 * @method PUT
 * @access private only logged seller
 */
exports.UpdateStatusOfOrder = asyncHandler(
    async(req,res)=>{
        const { itemId, status } = req.body;
        const order = await Order.findOne({
            "Items._id": itemId,
            "Items.seller": req.user.id
        });
        if (!order) {
            return res.status(404).json({ message: "Order or item not found" });
        }
        const item = order.Items.find(item => item._id.toString() === itemId && item.seller.toString() === req.user.id);
        if (!item) {
            return res.status(403).json({ message: "You are not authorized to update this item" });
        }
        item.status = status;
        await order.save();
        res.status(200).json({message:"Item status changed successfully",item});
    }
)
