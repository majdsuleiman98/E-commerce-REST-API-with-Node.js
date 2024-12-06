const {Category} = require("../models/Category");
const { cloudinaryRemoveImage } = require("../utils/cloudinary");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const { Product } = require("../models/Product");
const ApiFeatures = require("../utils/apiFeatures");
const { Subcategory } = require("../models/Subcategory");
const { handleImageUpload, handleImageUpdate } = require("../utils/handleImageUpload");

/**
 * @desc Get all categories
 * @route /api/categories
 * @method GET
 * @access public
 */
const getCategories = asyncHandler(
    async (req,res)=>{
        const apifeatures = new ApiFeatures(Category.find(),req.query)
        .Filter()
        .Paginate()
        .Sort()
        .Fields()
        .Search()
        const data = await apifeatures.mongooseQuery;
        res.status(200).json({data:data});
})

/**
 * @desc Get one category
 * @route /api/categories/:id
 * @method GET
 * @access public
 */
const getCategory = asyncHandler(
    async(req,res,next)=>{
        const data = await Category.findById(req.params.id).populate('subcategories');
        if(!data) {
            return next(new ApiError(`No category with this id ${req.params.id}`,404));
        }
        res.status(200).json(data);
})

/**
 * @desc Create new category
 * @route /api/categories
 * @method POST
 * @access private only admin
 */
const createCategory = asyncHandler(
    async (req,res)=>{
        const imageData = await handleImageUpload(req.file);
        req.body.image = imageData;
        const data = await Category.create(req.body);
        res.status(201).json({message:"Category created successfully",data});   
})

/**
 * @desc Update category
 * @route /api/categories/:id
 * @method PUT
 * @access private only admin
 */
const updateCategory =  asyncHandler(
    async(req,res,next)=>{  
        const data = await Category.findByIdAndUpdate(req.params.id,req.body,{new:true});
        if(!data) {
            return next(new ApiError(`No category with this id ${req.params.id}`,404));
        }     
        res.status(200).json({message:"Category updated successfully",data})
})

/**
 * @desc Update image of category
 * @router /api/categories/update-image/:id
 * @method PUT
 * @access private only admin
 */
const updateImageOfCategory = asyncHandler(
    async(req,res)=>{
        const category = await Category.findById(req.params.id);
        if(!category) {
            return res.status(404).json({message:`Category not found with this ID ${req.params.id}`});
        }
        const imageData = await handleImageUpdate(data.image.public_id, req.file);
        const updatedcategory = await Category.findByIdAndUpdate(req.params.id,{$set:{image: imageData}},{new:true});
        res.status(200).json({message: "Image of this category updated successfully",updatedcategory});
    }
)

/**
 * @desc Delete category
 * @route /api/categories/:id
 * @method DELETE
 * @access private only admin
 */
const deleteCategory = asyncHandler(
    async(req,res,next)=>{
        const data = await Category.findByIdAndDelete(req.params.id);
        if(!data) {
            return next(new ApiError(`No category with this id ${req.params.id}`,404)); 
        }
        await cloudinaryRemoveImage(data.image.public_id);
        await Subcategory.deleteMany({category:req.params.id});
        await Product.deleteMany({category:req.params.id});
        res.status(200).json({message:"Category deleted successfully"})
})


module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    updateImageOfCategory
}


