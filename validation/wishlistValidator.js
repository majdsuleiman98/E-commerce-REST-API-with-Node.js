const {check} = require('express-validator');
const validatorMiddleware = require('../middlewares/validatorMiddleware');
const { isExistForeignKey } = require('./CustomValidators');
const { Product } = require('../models/Product');




exports.AddProductToWishListValidator = [
    check('productId')
        .notEmpty().withMessage('Product Id is required')
        .isMongoId().withMessage('Invalid ID format')
        .custom(isExistForeignKey('product',Product)),
    validatorMiddleware
]

exports.RemoveProductFromWishListValidator = [
    check('productId')
        .notEmpty().withMessage('Product Id is required')
        .isMongoId().withMessage('Invalid ID format'),
    validatorMiddleware
]