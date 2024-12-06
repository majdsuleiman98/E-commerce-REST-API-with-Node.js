const {check} = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");
const { Subcategory } = require("../models/Subcategory");
const { Category } = require("../models/Category");
const {slugging,isUniqueField,isExistForeignKey} = require("./CustomValidators.js");




exports.getSubcategoryValidator = [
    check('id')
        .isMongoId().withMessage('Invalid subcategory id format'),
    validatorMiddleware
]

exports.createSubcategoryValidator = [
    check('name')
        .notEmpty().withMessage('Name is required')
        .isLength({min:3}).withMessage('Too short subcategory name')
        .isLength({max:30}).withMessage('Too long subcategory name')
        .custom(isUniqueField('name',Subcategory))
        .custom(slugging),
    check('category')
        .notEmpty().withMessage('Category is required')
        .isMongoId().withMessage('Invalid category id format')
        .custom(isExistForeignKey('category',Category)),
    validatorMiddleware
]

exports.updateSubcategoryValidator = [
    check('id')
        .isMongoId().withMessage('Invalid subcategory id format'),
    check('name')
        .optional()
        .isLength({min:3}).withMessage('Too short subcategory name')
        .isLength({max:30}).withMessage('Too long subcategory name')
        .custom(isUniqueField('name',Subcategory))
        .custom(slugging),
    check('category')
        .optional()
        .isMongoId().withMessage('Invalid category id format')
        .custom(isExistForeignKey('category',Category)),
    validatorMiddleware
]

exports.deleteSubcategoryValidator = [
    check('id')
        .isMongoId().withMessage('Invalid subcategory id format'),
    validatorMiddleware
]