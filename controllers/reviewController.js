const {Review} = require("../models/Review");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

/**
 * @desc Get all reviews
 * @route /api/reviews
 * @method GET
 * @access public
 */
const getReviews = asyncHandler(
    async(req,res)=>{
        const pageNumber=req.query.pageNumber || 1;
        const limit=3;
        const data = await Review.find().sort({createdAt:-1}).skip(limit*pageNumber-limit).limit(limit);
        const counts = await Review.countDocuments();
        return res.status(200).json({message:"All reviews",data});
    }
)

/**
 * @desc Get review
 * @route /api/reviews/:id
 * @method GET
 * @access public
 */
const getReview = asyncHandler(
    async(req,res,next)=>{
        const data = await Review.findById(req.params.id);
        if(!data){
            return next(new ApiError(`No review with this id ${req.params.id}`,404));
        }
        return res.status(200).json(data);
    }
)


/**
 * @desc Create review
 * @route /api/reviews/
 * @method POST
 * @access private only logged user
 */
const createReview = asyncHandler(
    async(req,res)=>{
        const data = await Review.create(req.body);
        return res.status(201).json({message:"Review created successfully",data});
    }
)

/**
 * @desc Update review
 * @route /api/reviews/:id
 * @method PUT
 * @access private only owner user
 */
const updateReview = asyncHandler(
    async(req,res,next)=>{
        const data = await Review.findByIdAndUpdate(req.params.id,req.body,{new:true});
        if(!data){
            return next(new ApiError(`No review with this id ${req.params.id}`,404));
        }
        return res.status(200).json({message:"Review updated successfully",data});
    }
)


/**
 * @desc Delete review
 * @route /api/reviews/:id
 * @method DELETE
 * @access private only owner user or admin
 */
const deleteReview = asyncHandler(
    async(req,res,next)=>{
        const data = await Review.findByIdAndDelete(req.params.id);
        if(!data){
            return next(new ApiError(`No review with this id ${req.params.id}`,404));
        }
        return res.status(200).json({message:"Review deleted successfully"});
    }
)





module.exports ={
    getReviews,
    getReview,
    createReview,
    updateReview,
    deleteReview
}