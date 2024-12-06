const { check, body } = require("express-validator");
const {Review} = require("../models/Review");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

exports.getReviewValidator = [
    check('id')
        .isMongoId().withMessage('Invalid review id format'),    
    validatorMiddleware
]

exports.createReviewValidator = [
    check('title')
        .optional(),
    check('rating')
        .notEmpty().withMessage('rating is required')
        .isFloat({min:1,max:5}).withMessage('value must be between 1 and 5'),
    check('product')
        .notEmpty().withMessage('Product id is required')
        .isMongoId().withMessage('Invalid product id format')
        .custom(async(val,{req})=>{
            req.body.user = req.user.id;
            const review = await Review.findOne({user:req.user.id,product:req.body.product});
            if(review){
                throw new Error("You alrady created a review for this product")
            }
            return true;
        }),    
    validatorMiddleware
]

exports.updateReviewValidator = [
    check('id')
        .isMongoId().withMessage('Invalid review id format')
        .custom(async(val,{req})=>{
            const review =await Review.findById(val);
            if(!review){
                throw new Error("Review not found")
            }
            if(review.user._id.toString() !== req.user.id){
                throw new Error("Only owner user can update this review");
            }
            return true;
        }),
    check('title')
        .optional(),
    check('rating')
        .optional()
        .isFloat({min:1,max:5}).withMessage('value must be between 1 and 5'),
    validatorMiddleware
]

exports.deleteReviewValidator = [
    check('id')
        .isMongoId().withMessage('Invalid review id format')
        .custom(async(val,{req})=>{
            if(req.user.role==="user"){
                const review =await Review.findById(val);
            if(!review){
                throw new Error("Review not found")
            }
            if(review.user._id.toString() !== req.user.id){
                throw new Error("Only owner user can update this review");
            }
            return true;
            }
        }),    
    validatorMiddleware
]