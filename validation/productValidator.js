const {check} = require('express-validator');
const {Category} = require('../models/Category');
const {Brand} = require('../models/Brand');
const validatorMiddleware = require('../middlewares/validatorMiddleware');
const {
    slugging,isExistForeignKey,prevent_enter_Field,check_discount_price,CheckImage,
    check_subcategories,checkSubcategoriesBelongToCategory,checkOwnerSeller,checkDeleteProductPirmision} = require('./CustomValidators');


exports.createProductValidator = [
    check('name')
        .notEmpty().withMessage('Name is required')
        .isLength({min:3}).withMessage('Too short product name')
        .isLength({max:30}).withMessage('Too long product name')
        .custom(slugging),
    check('description')
        .notEmpty().withMessage('Description is required')
        .isLength({min:20}).withMessage('Too short product description'),
    check('quantity')
        .notEmpty().withMessage('Quantity is required')
        .isNumeric().withMessage('Quantity must be a number')
        .isInt({min:1}).withMessage('Quantity must be greater than 1'),
    check('sold')
        .custom(prevent_enter_Field),
    check('price')
        .notEmpty().withMessage('Price is required')
        .isNumeric().withMessage('Price must be a number')
        .isFloat({min:1.0}).withMessage('Pricemust be greater than 1'),
    check('price_after_discount')
        .optional()
        .isNumeric().withMessage('Price must be a number')
        .toFloat()
        .custom(check_discount_price),
    check('colors')
        .optional()
        .isArray().withMessage('Colors sould be array of string'),
    check('image_cover')
        .custom(CheckImage),
    check('category')
        .notEmpty().withMessage('Category is required')
        .isMongoId().withMessage('Invalid ID format')
        .custom(isExistForeignKey('category',Category)),
    check('subcategory')
        .notEmpty().withMessage('subcategory is required')
        .isArray().withMessage('subcategory must be array of Ids')
        .custom(check_subcategories)
        .custom(checkSubcategoriesBelongToCategory),
    check('brand')
        .optional()
        .isMongoId().withMessage('Invalid ID format')
        .custom(isExistForeignKey('brand',Brand)),
    check('ratings_average')
        .custom(prevent_enter_Field),
    check('ratings_quantity')
        .custom(prevent_enter_Field),
    (req, res, next) => {
        req.body.seller = req.user.id;
        next();
        },
    validatorMiddleware
]

exports.updateProductValidator = [
    check('id')
        .isMongoId().withMessage('Invalid review id format')
        .custom(checkOwnerSeller),
    check('name')
        .optional()
        .isLength({min:3}).withMessage('Too short product name')
        .isLength({max:30}).withMessage('Too long product name')
        .custom(slugging),
    check('description')
        .optional()
        .isLength({min:20}).withMessage('Too short product description'),
    check('quantity')
        .optional()
        .isNumeric().withMessage('Quantity must be a number')
        .isInt({min:1}).withMessage('Quantity must be greater than 1'),
    check('sold')
        .custom(prevent_enter_Field),
    check('price')
        .optional()
        .isNumeric().withMessage('Price must be a number')
        .isFloat({min:1.0}).withMessage('Pricemust be greater than 1'),
    check('price_after_discount')
        .optional()
        .isNumeric().withMessage('Price must be a number')
        .toFloat()
        .custom(check_discount_price),
    check('colors')
        .optional()
        .isArray().withMessage('Colors sould be array of string'),
    check('category')
        .optional()
        .isMongoId().withMessage('Invalid ID format')
        .custom(isExistForeignKey('category',Category)),
    check('subcategory')
        .optional()
        .isMongoId().withMessage('Invalid ID format')
        .custom(check_subcategories),
    check('brand')
        .optional()
        .isMongoId().withMessage('Invalid ID format')
        .custom(isExistForeignKey('brand',Brand)),
    check('ratings_average')
        .custom(prevent_enter_Field),
    check('ratings_quantity')
        .custom(prevent_enter_Field),
    check('seller')
        .custom(prevent_enter_Field),
    validatorMiddleware
]

exports.getProductValidator = [
    check('id')
        .isMongoId().withMessage('Invalid product id format'),
    validatorMiddleware
]

exports.deleteProductValidator = [
    check('id')
        .isMongoId().withMessage('Invalid review id format')
        .custom(checkDeleteProductPirmision),
    validatorMiddleware
]

exports.updateImageProductValidator = [
    check('id')
        .isMongoId().withMessage('Invalid product id format')
        .custom(checkOwnerSeller),
    check('image')
        .custom(CheckImage),
    validatorMiddleware
]