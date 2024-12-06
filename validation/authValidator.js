const {check} = require('express-validator');
const {User} = require('../models/User');
const validatorMiddleware = require('../middlewares/validatorMiddleware');
const {slugging,isUniqueField,isPasswordConfirmed,prevent_enter_Field} = require("./CustomValidators");


exports.RegisterValidator = [
    check('name')
        .notEmpty().withMessage('Name is required')
        .isLength({min:3}).withMessage('Too short user name')
        .isLength({max:30}).withMessage('Too long user name')
        .custom(slugging),
    check('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email address')
        .custom(isUniqueField('email',User)).withMessage('User already exists with this email'),
    check('password')
        .notEmpty().withMessage('Password is required')
        .isLength({min:8}).withMessage('Password must be at least 8 characters')
        .custom(isPasswordConfirmed),
    check('passwordConfirm')
        .notEmpty().withMessage('Password confirmation required'),
    check('phone')
        .notEmpty().withMessage('Phone number is required')
        .isMobilePhone('tr-TR').withMessage('Invalid phone number'),
    validatorMiddleware
] 

exports.LoginValidator = [
    check('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email address'),
    check('password')
        .notEmpty().withMessage('Password is required')
        .isLength({min:8}).withMessage('Password must be at least 8 characters'),
    validatorMiddleware
] 

exports.BesellerValidator = [
    check('name')
        .notEmpty().withMessage('Name is required')
        .isLength({min:3}).withMessage('Too short user name')
        .isLength({max:30}).withMessage('Too long user name')
        .custom(slugging),
    check('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email address')
        .custom(isUniqueField('email',User))
        .withMessage('User already exists with this email'),
    check('password')
        .notEmpty().withMessage('Password is required')
        .isLength({min:8}).withMessage('Password must be at least 8 characters')
        .custom(isPasswordConfirmed),
    check('passwordConfirm')
        .notEmpty().withMessage('Password confirmation required'),
    check('phone')
        .notEmpty().withMessage('Phone number is required')
        .isMobilePhone('tr-TR').withMessage('Invalid phone number'),
    check('tax_number')
        .notEmpty().withMessage('Tax number is required'),
    check('role')
        .custom(prevent_enter_Field),
    validatorMiddleware
]