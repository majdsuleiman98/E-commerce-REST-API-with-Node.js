const asyncHandler = require("express-async-handler");
const {User} = require("../models/User");
const ApiError = require("../utils/apiError");
const bcryptjs = require('bcryptjs');
const { Product } = require("../models/Product");
const { cloudinaryRemoveImage } = require("../utils/cloudinary");
const ApiFeatures = require("../utils/apiFeatures");
const { handleImageUpdate } = require("../utils/handleImageUpload");


/**
 * @desc Get all users
 * @route /api/users
 * @method GET
 * @access private only admin
 */
const getUsers = asyncHandler(
    async(req,res)=>{
        const apifeatures = new ApiFeatures(User.find(),req.query)
        .Filter()
        .Paginate()
        .Sort()
        .Fields()
        .Search()
        const data = await apifeatures.mongooseQuery;
        res.status(200).json({data:data});
})

/**
 * @desc Get user
 * @route /api/users/:id
 * @method GET
 * @access private only admin
 */
const getUser = asyncHandler(
    async(req,res,next)=>{
        const data = await User.findById(req.params.id);
        if(!data) {
            return next(new ApiError(`No user with this id ${req.params.id}`,404));
        }
        res.status(200).json(data);
    }
)


/**
 * @desc Create new users
 * @route /api/users
 * @method POST
 * @access private only admin
 */
const createUser = asyncHandler(
    async(req,res)=>{
        const data = await User.create(req.body);
        res.status(201).json({message:"User created successfully",data})
    }
)

/**
 * @desc Update users
 * @route /api/users/:id
 * @method PUT
 * @access private only admin
 */
const updateUser = asyncHandler(
    async(req,res,next)=>{
        const data = await User.findByIdAndUpdate(req.params.id,req.body,{new:true});
        if(!data) {
            return next(new ApiError(`No user with this id ${req.params.id}`,404));
        }
        res.status(200).json({message:"User updated successfully",data});
    }
)

/**
 * @desc Change password
 * @route /api/users/change-password/:id
 * @method PUT
 * @access private only admin
 */
const changePassword = asyncHandler(
    async(req,res,next)=>{
        const data = await User.findByIdAndUpdate(req.params.id,{
            password: await bcryptjs.hash(req.body.password,10)
        },{new:true});
        if(!data) {
            return next(new ApiError(`No user with this id ${req.params.id}`,404));
        }
        res.status(200).json({message:"User password change successfully",data});
    }
)

/**
 * @desc Delete user
 * @route /api/users/:id
 * @method DELETE
 * @access private only admin
 */
const deleteUser = asyncHandler(
    async(req,res,next)=>{
        const data = await User.findByIdAndDelete(req.params.id);
        if(!data) {
            return next(new ApiError(`No user with this id ${req.params.id}`,404));
        }
        await cloudinaryRemoveImage(data.image.public_id);
        if(data.role === "seller"){
            await Product.deleteMany({seller:req.params.id});
        }
        res.status(200).json({message:"User deleted successfully"})
    }
)

/**
 * @desc Get profile of user
 * @route /api/users/get-profile
 * @method GET
 * @access private only user himself
 */
const getLoggedUserProfile = asyncHandler(
    async(req,res,next)=>{
        req.params.id = req.user.id;
        next();
    }
)

/**
 * @desc Update password of logged user
 * @route /api/users/change-my-password
 * @method PUT
 * @access private only user himself
 */
const changeLoggedUserPassword = asyncHandler(
    async(req,res,next)=>{
        req.params.id = req.user.id;
        next();
    }
)

/**
 * @desc Update profile of user
 * @route /api/users/update-profile
 * @method PUT
 * @access private only user himself
 */
const updateLoggedUserProfile = asyncHandler(
    async(req,res,next)=>{
        req.params.id = req.user.id;
        next();
    }
)

/**
 * @desc Delete profile of user
 * @route /api/users/delete-profile
 * @method DELETE
 * @access private only user himself
 */
const deleteLoggedUserProfile = asyncHandler(
    async(req,res,next)=>{
        req.params.id = req.user.id;
        next();
    }
)

/**
 * @desc Update iamge of profile
 * @route /api/users/update-image
 * @method PUT
 * @access private only user himself
 */
const updateImageUserProfile = asyncHandler(
    async(req,res)=>{
        const user = await User.findById(req.user.id);
        if(!user) {
            return res.status(404).json({message:`User not found with this ID ${req.params.id}`});
        }
        const imageData = await handleImageUpdate(data.image.public_id, req.file);
        await User.findByIdAndUpdate(req.user.id,{$set:{image: imageData}},{new:true});
        res.status(200).json({message:"Image uploaded successfully"});
    }
)


module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    changePassword,
    getLoggedUserProfile,
    changeLoggedUserPassword,
    updateLoggedUserProfile,
    deleteLoggedUserProfile,
    updateImageUserProfile
}