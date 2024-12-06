const asyncHandler = require("express-async-handler");
const {Brand} = require("../models/Brand");
const ApiError = require("../utils/apiError");
const { cloudinaryRemoveImage } = require("../utils/cloudinary");
const { Product } = require("../models/Product");
const ApiFeatures = require("../utils/apiFeatures");
const { handleImageUpload, handleImageUpdate } = require("../utils/handleImageUpload");

/**
 * @desc Get all brands
 * @route /api/brands
 * @method GET
 * @access public
 */
const getBrands = asyncHandler(
    async(req,res)=>{
        const apifeatures = new ApiFeatures(Brand.find(),req.query)
        .Filter()
        .Paginate()
        .Sort()
        .Fields()
        .Search()
        const data = await apifeatures.mongooseQuery;
        res.status(200).json({data:data});
});

/**
 * @desc Get brand
 * @route /api/brands/:id
 * @method GET
 * @access public
 */
const getBrand = asyncHandler(
    async(req,res,next)=>{
        const data = await Brand.findById(req.params.id).populate('products');
        if(!data) {
            return next(new ApiError(`No brand with this id ${req.params.id}`,404));
        }
        res.status(200).json(data);
    }
)

/**
 * @desc Create new brand
 * @route /api/brands
 * @method POST
 * @access private only admin
 */
const createBrand = asyncHandler(
    async(req,res)=>{
        const imageData = await handleImageUpload(req.file);
        req.body.image = imageData;
        const data = await Brand.create(req.body);
        res.status(201).json({message:"Brand created successfully",data});
    }
)

/**
 * @desc Update brand
 * @route /api/brands/:id
 * @method PUT
 * @access private only admin
 */
const updateBrand = asyncHandler(
    async(req,res,next)=>{
        const data = await Brand.findByIdAndUpdate(req.params.id,req.body,{new:true});
        if(!data) {
            return next(new ApiError(`No brand with this id ${req.params.id}`,404));
        }
        res.status(200).json({message:"Brand updated successfully",data});
    }
)

/**
 * @desc Update image of brand
 * @router /api/brands/update-image/:id
 * @method PUT
 * @access private only admin
 */
const updateImageOfBrand = asyncHandler(
    async(req,res)=>{
        const data = await Brand.findById(req.params.id);
        if(!data) {
            return next(new ApiError(`No brand with this id ${req.params.id}`,404));
        }
        const imageData = await handleImageUpdate(data.image.public_id, req.file);
        const updatedbrand = await Brand.findByIdAndUpdate(req.params.id,{$set:{image: imageData}},{new:true});
        res.status(200).json({message: "Image of this brand updated successfully",updatedbrand});
    }
)

/**
 * @desc Delete brand
 * @route /api/brands/:id
 * @method DELETE
 * @access private only admin
 */
const deleteBrand = asyncHandler(
    async(req,res,next)=>{
        const data = await Brand.findByIdAndDelete(req.params.id);
        if(!data) {
            return next(new ApiError(`No brand with this id ${req.params.id}`,404));
        }
        await cloudinaryRemoveImage(data.image.public_id);
        await Product.deleteMany({brand:req.params.id});
        res.status(200).json({message:"Brand deleted successfully"});
    }
)


module.exports = {
    getBrands,
    getBrand,
    createBrand,
    updateBrand,
    deleteBrand,
    updateImageOfBrand
}