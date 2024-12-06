const slugify = require("slugify");
const {Subcategory} = require("../models/Subcategory");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const { Product } = require("../models/Product");
const ApiFeatures = require("../utils/apiFeatures");


/**
 * @desc Get all subcategories
 * @route /api/subcategories
 * @method GET
 * @access public
 */
const getSubcategories = asyncHandler(
    async(req,res)=>{
        const apifeatures = new ApiFeatures(Subcategory.find(),req.query)
        .Filter()
        .Paginate()
        .Sort()
        .Fields()
        .Search()
        const data = await apifeatures.mongooseQuery;
        res.status(200).json({data:data});
})

/**
 * @desc Get one subcategory
 * @route /api/subcategories/:id
 * @method GET
 * @access public
 */
const getSubcategory = asyncHandler(
    async(req,res,next)=>{
        const data = await Subcategory.findById(req.params.id).populate('products');//.populate({path:'category',select:'name -_id'})
        if(!data) {
            return next(new ApiError(`No subcategory with this id ${req.params.id}`,404));
        }
        res.status(200).json(data);
})

/**
 * @desc Create new subcategory
 * @route /api/subcategories/:id
 * @method POST
 * @access private only admin
 */
const createSubcategory = asyncHandler(
    async(req,res)=>{
        const data = await Subcategory.create(req.body);
        res.status(201).json({message:'Subategory created successfully',data})
    }
)

/**
 * @desc Update subcategory
 * @route /api/subcategories/:id
 * @method PUT
 * @access private only admin
 */
const updateSubcategory = asyncHandler(
    async(req,res,next)=>{
        const data = await Subcategory.findByIdAndUpdate(req.params.id,req.body,{new:true});
        if(!data) {
            return next(new ApiError(`No subcategory with this id ${req.params.id}`,404));
        }
        res.status(200).json({message:'Subategory updated successfully',data});
    }
)

/**
 * @desc Delete subcategory
 * @route /api/subcategories/:id
 * @method DELETE
 * @access private only admin
 */
const deleteSubcategory = asyncHandler(
    async(req,res,next)=>{
        const data = await Subcategory.findByIdAndDelete(req.params.id);
        if(!data) {
            return next(new ApiError(`No subcategory with this id ${req.params.id}`,404));
        }
        await Product.deleteMany({subcategory:req.params.id});
        res.status(200).json({message:"Subcategory deleted successfully"});
    }
)



module.exports = {
    getSubcategories,
    getSubcategory,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory
}