const {check} = require('express-validator');
const {Brand} = require('../models/Brand');
const validatorMiddleware = require('../middlewares/validatorMiddleware');
const {slugging,isUniqueField, CheckImage} = require("./CustomValidators");


exports.getBrandValidator = [
    check('id')
        .isMongoId().withMessage('Invalid brand id format'),
    validatorMiddleware
] 

exports.createBrandValidator = [
    check('name')
        .notEmpty().withMessage('Name is required')
        .isLength({min:3}).withMessage('Too short brand name')
        .isLength({max:30}).withMessage('Too long brand name')
        .custom(isUniqueField('name',Brand))
        .custom(slugging),
    check('image')
        .custom(CheckImage),
    validatorMiddleware
] 

exports.updateBrandValidator = [
    check('id')
        .isMongoId().withMessage('Invalid brand id format'),
    check('name')
        .optional()
        .isLength({min:3}).withMessage('Too short brand name')
        .isLength({max:30}).withMessage('Too long brand name')
        .custom(isUniqueField('name',Brand))
        .custom(slugging),
    validatorMiddleware
] 

exports.updateImageBrandValidator = [
    check('id')
        .isMongoId().withMessage('Invalid category id format'),
    check('image')
        .custom(CheckImage),
    validatorMiddleware
]

exports.deleteBrandValidator = [
    check('id')
        .isMongoId().withMessage('Invalid brand id format'),
    validatorMiddleware
] 