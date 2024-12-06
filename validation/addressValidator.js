const {check} = require('express-validator');
const validatorMiddleware = require('../middlewares/validatorMiddleware');
const { check_allowed_address_type } = require('./CustomValidators');



exports.AddAddressValidator = [
    check('type')
        .notEmpty().withMessage('address type is required')
        .custom(check_allowed_address_type),
    check('city')
        .notEmpty().withMessage('City is required'),
    check('region')
        .notEmpty().withMessage('Region is required'),
    check('street')
        .notEmpty().withMessage('Street is required'),
    check('buildingNo')
        .notEmpty().withMessage('Building number is required'),
    check('apartmentNo')
        .notEmpty().withMessage('Apartment number is required'),
    validatorMiddleware
]

exports.RemoveAddressValidator = [
    check('addressId')
        .notEmpty().withMessage('Address Id is required')
        .isMongoId().withMessage('Invalid ID format'),
    validatorMiddleware
]