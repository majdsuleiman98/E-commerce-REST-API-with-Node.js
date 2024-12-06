const asyncHandler = require('express-async-handler');
const { Cupon } = require('../models/Cupon');
const ApiError = require('../utils/apiError');


/**
 * @desc Get all cupons
 * @route /api/cupons
 * @method GET
 * @access private only admin
 */
const GetCupons = asyncHandler(
    async(req,res)=>{
        const data = await Cupon.find();
        res.status(200).json({data:data})
})


/**
 * @desc Get one cupon
 * @route /api/cupons/:id
 * @method GET
 * @access private only admin
 */
const GetCupon = asyncHandler(
    async(req,res,next)=>{
        const data = await Cupon.findById(req.params.id);
        if(!data) {
            return next(new ApiError(`No cupon with this id ${req.params.id}`,404));
        }
        res.status(200).json({data:data})
})


/**
 * @desc Create new cupon
 * @route /api/cupons
 * @method POST
 * @access private only admin
 */
const CreateCupon = asyncHandler(
    async(req,res)=>{
        const data = await Cupon.create(req.body);
        res.status(201).json({message:'Cupon created successfully',data})
})


/**
 * @desc Update cupon
 * @route /api/cupons/:id
 * @method PUT
 * @access private only admin
 */
const UpdateCupon = asyncHandler(
    async(req,res,next)=>{
        const data = await Cupon.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        if(!data) {
            return next(new ApiError(`No cupon with this id ${req.params.id}`,404));
        }
        res.status(201).json({message:'Cupon updated successfully',data})
})



/**
 * @desc Create new cupon
 * @route /api/cupons
 * @method POST
 * @access private only admin
 */
const DeleteCupon = asyncHandler(
    async(req,res,next)=>{
        const data = await Cupon.findByIdAndDelete(req.params.id);
        if(!data) {
            return next(new ApiError(`No cupon with this id ${req.params.id}`,404));
        }
        res.status(201).json({message:'Cupon deleted successfully'})
})


/**
 * @desc Validate cupon by code
 * @route /api/cupons/validate
 * @method POST
 * @access private only admin
 */
const ValidateCupon = asyncHandler(
    async(req,res,next)=>{
        const cupon = await Cupon.isValidCupon(req.body.code);
        if(!cupon) {
            return next(new ApiError(`Invalid or expired coupon code ${req.body.code}`,400));
        }
        res.status(200).json(cupon);
})


module.exports = {
    CreateCupon,
    GetCupons,
    GetCupon,
    UpdateCupon,
    DeleteCupon,
    ValidateCupon
}