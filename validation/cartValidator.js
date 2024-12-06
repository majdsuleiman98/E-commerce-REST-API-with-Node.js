const {check} = require('express-validator');
const validatorMiddleware = require('../middlewares/validatorMiddleware');
const { Product } = require('../models/Product');
const { isExistForeignKey, check_color_rules } = require('./CustomValidators');


exports.addToCartValidator = [
    check('ProductId')
        .notEmpty().withMessage('Product is required')
        .isMongoId().withMessage('Invalid ID format')
        .custom(isExistForeignKey('Product',Product)),
    check('color')
        .custom(check_color_rules),
    validatorMiddleware
]



exports.RemoveItemFromCartValidator = [
    check('itemId')
        .isMongoId().withMessage('Invalid Item id format'),
    validatorMiddleware
]

exports.UpdateItemQuantityValidator = [
    check('itemId')
        .isMongoId().withMessage('Invalid Item id format'),
    check('quantity')
        .notEmpty().withMessage('Quantity is required')
        .isInt({min:1}).withMessage('Quantity must be numeric value and grater than one'),
    validatorMiddleware
]

exports.ApplyCuponValidator = [
    check('cupon')
        .notEmpty().withMessage('cupon is required')
]