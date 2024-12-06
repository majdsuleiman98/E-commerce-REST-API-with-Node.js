const {check, body} = require('express-validator');
const {User} = require('../models/User');
const validatorMiddleware = require('../middlewares/validatorMiddleware');
const {slugging, isUniqueField,isCurrentPasswordMatched,isPasswordConfirmed,check_allowed_roles,tax_number_for_seller, CheckImage, prevent_enter_Field} = require("./CustomValidators.js");
const bcryptjs = require('bcryptjs');


exports.createUserValidator = [
    check('name')
        .notEmpty().withMessage('Name is required')
        .isLength({min:3}).withMessage('Too short user name')
        .isLength({max:30}).withMessage('Too long user name')
        .custom(slugging),
    check('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email address')
        .custom(isUniqueField('email',User)),
    check('password')
        .notEmpty().withMessage('Password is required')
        .isLength({min:8}).withMessage('Password must be at least 8 characters')
        .custom(isPasswordConfirmed),
    check('passwordConfirm')
        .notEmpty().withMessage('Password confirmation required'),
    check('phone')
        .notEmpty().withMessage('Phone number is required')
        .isMobilePhone('tr-TR').withMessage('Invalid phone number'),
    check('role')
        .optional()
        .custom(check_allowed_roles),
    check('tax_number')
        .custom(tax_number_for_seller),
    validatorMiddleware
] 

exports.updateUserValidator = [
    check('id')
        .isMongoId().withMessage('Invalid user id format'),
    check('name')
        .optional()
        .isLength({min:3}).withMessage('Too short user name')
        .isLength({max:30}).withMessage('Too long user name')
        .custom(slugging),
    check('email')
        .optional()
        .isEmail().withMessage('Invalid email address')
        .custom(isUniqueField('email',User)),
    check('phone')
        .optional()
        .isMobilePhone('tr-TR').withMessage('Invalid phone number'),
    check('role')
        .custom(prevent_enter_Field),
    validatorMiddleware
] 

exports.changePasswordValidator = [
    check('id')
        .isMongoId().withMessage('Invalid user id format'),
    body('currentPassword')
        .notEmpty()
        .withMessage('You must enter your current password')
        .custom(isCurrentPasswordMatched),
    body('password')
        .notEmpty()
        .withMessage('You must enter new password')
        .isLength({min:8}).withMessage('Password must be at least 8 characters')
        .custom(isPasswordConfirmed),
    body('passwordConfirm')
        .notEmpty()
        .withMessage('You must confirm the new password'),
        validatorMiddleware
]

exports.updaetImageUserValidator = [
    check('image')
        .custom(CheckImage),
    validatorMiddleware
] 

exports.getUserValidator = [
    check('id')
        .isMongoId().withMessage('Invalid user id format'),
    validatorMiddleware
] 

exports.deleteUserValidator = [
    check('id')
        .isMongoId().withMessage('Invalid user id format'),
    validatorMiddleware
] 