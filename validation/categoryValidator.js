const {check} = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");
const {Category} = require("../models/Category");
const {slugging,isUniqueField,CheckImage} = require("./CustomValidators.js");


exports.getCategoryValidator = [
    check('id')
        .isMongoId().withMessage('Invalid category id format'),
    validatorMiddleware
]

exports.createCategoryValidator = [
    check('name')
        .notEmpty().withMessage('Name is required')
        .isLength({min:3}).withMessage('Too short category name')
        .isLength({max:30}).withMessage('Too long category name')
        .custom(isUniqueField('name',Category))
        .custom(slugging),
    check('image')
        .custom(CheckImage),
    validatorMiddleware
]

exports.updateCategoryValidator = [
    check('id')
        .isMongoId().withMessage('Invalid category id format'),
    check('name')
        .optional()
        .isLength({min:3}).withMessage('Too short category name')
        .isLength({max:30}).withMessage('Too long category name')
        .custom(isUniqueField('name',Category))
        .custom(slugging),
    validatorMiddleware
]

exports.updateImageCategoryValidator = [
    check('id')
        .isMongoId().withMessage('Invalid category id format'),
    check('image')
        .custom(CheckImage),
    validatorMiddleware
]

exports.deleteCategoryValidator = [
    check('id')
        .isMongoId().withMessage('Invalid category id format'),
    validatorMiddleware
]



