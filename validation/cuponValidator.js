const {check} = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");
const { Cupon } = require("../models/Cupon");
const { isUniqueField } = require("./CustomValidators");

exports.createCuponValidator = [
    check('code')
        .notEmpty().withMessage('code is required')
        .isString().withMessage('code must be string')
        .isUppercase().withMessage('code must be uppercase')
        .custom(isUniqueField('code',Cupon)),
    check('discount')
        .notEmpty().withMessage('discount is required')
        .isNumeric().withMessage('discount must be a number')
        .isFloat({min:0,max:100}).withMessage('value must be between 0 and 100'),
    check('expirationDate')
        .notEmpty().withMessage('expiration Date is required')
        .isDate().withMessage('expiration Date must be Date'),
    validatorMiddleware
]

exports.updateCuponValidator = [
    check('id')
        .isMongoId().withMessage('Invalid cupon id format'),
    check('code')
        .optional()
        .isString().withMessage('code must be string')
        .isUppercase().withMessage('code must be uppercase')
        .custom(isUniqueField('code',Cupon)),
    check('discount')
        .optional()
        .isNumeric().withMessage('discount must be a number')
        .isFloat({min:0,max:100}).withMessage('value must be between 0 and 100'),
    check('expirationDate')
        .optional()
        .isDate().withMessage('expiration Date must be Date'),
    validatorMiddleware
]

exports.getCuponValidator = [
    check('id')
        .isMongoId().withMessage('Invalid cupon id format'),
    validatorMiddleware
] 

exports.deleteCuponValidator = [
    check('id')
        .isMongoId().withMessage('Invalid cupon id format'),
    validatorMiddleware
] 