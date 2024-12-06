const asyncHandler = require('express-async-handler');
const {Product} = require('../models/Product');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');
const { cloudinaryRemoveImage } = require("../utils/cloudinary");
const { handleImageUpdate, handleImageUpload } = require('../utils/handleImageUpload');

/**
 * @desc Get all products
 * @route api/products
 * @method GET
 * @access public
 */
const getProducts = asyncHandler(
    async(req,res)=>{
        const apifeatures = new ApiFeatures(Product.find(),req.query)
        .Filter()
        .Paginate()
        .Sort()
        .Fields()
        .Search()
        const data = await apifeatures.mongooseQuery;
        res.status(200).json({data:data});
    }
)
/**
 * @desc Get product
 * @route api/products/:id
 * @method GET
 * @access public
 */
const getProduct = asyncHandler(
    async(req,res,next)=>{
        const data = await Product.findById(req.params.id).populate("reviews");
        if(!data) {
            return next(new ApiError(`No product with this id ${req.params.id}`,404));
        }
        res.status(200).json(data);
    }
)

/**
 * @desc Create product
 * @route api/products/
 * @method POST
 * @access private only seller
 */
const createProduct = asyncHandler(
    async(req,res)=>{
        const imageData = await handleImageUpload(req.file);
        req.body.image = imageData;
        const data = await Product.create(req.body);
        res.status(201).json({message:'Product created successfully',data});
    }
)

/**
 * @desc Update product
 * @route api/products/:id
 * @method PUT
 * @access private only owner seller
 */
const updateProduct = asyncHandler(
    async(req,res,next)=>{
        const data = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true});
        if(!data) {
            return next(new ApiError(`No product with this id ${req.params.id}`,404));
        }
        res.status(200).json({message:'Product updated successfully',data});
    }
)

/**
 * @desc Delete product
 * @route api/products/:id
 * @method DELETE
 * @access private only owner seller or admin
 */
const deleteProduct = asyncHandler(
    async(req,res,next)=>{
        const data = await Product.findByIdAndDelete(req.params.id);
        if(!data){
            return next(new ApiError(`No product with this id ${req.params.id}`,404));
        }
        await cloudinaryRemoveImage(data.image.public_id);
        res.status(200).json({message:'Product deleted successfully'})
    }
)

/**
 * @desc Get products of one seller
 * @route api/products/my-products
 * @method GET
 * @access private only owner seller
 */
const getMyProducts = asyncHandler(
    async(req,res)=>{
        const apifeatures = new ApiFeatures(Product.find({seller:req.user.id}),req.query)
        .Filter()
        .Paginate()
        .Sort()
        .Fields()
        .Search()
        const data = await apifeatures.mongooseQuery;
        res.status(200).json({data:data});
    }
)


/**
 * @desc Update image of product
 * @router /api/products/update-image/:id
 * @method PUT
 * @access private owner seller
 */
const updateImageOfProduct = asyncHandler(
    async(req,res)=>{
        const product = await Product.findById(req.params.id);
        if(!product) {
            return res.status(404).json({message:`product not found with this ID ${req.params.id}`});
        }
        const imageData = await handleImageUpdate(data.image.public_id, req.file);
        const updatedproduct = await Product.findByIdAndUpdate(req.params.id,{$set:{ image: imageData }},{new:true});
        res.status(200).json({message: "Image of this product updated successfully",updatedproduct});
    }
)

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getMyProducts,
    updateImageOfProduct
}
