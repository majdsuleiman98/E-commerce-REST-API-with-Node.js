const {check} = require('express-validator');
const validatorMiddleware = require('../middlewares/validatorMiddleware');
const { checkowneroforder } = require('./CustomValidators');

exports.CreateOrderValidator = [
    check('address')
        .notEmpty().withMessage("Address is required")
        .isMongoId().withMessage('Invalid address id format'),
    validatorMiddleware
]


exports.getOrderValidator = [
    check('id')
        .isMongoId().withMessage('Invalid order id format')
        .custom(checkowneroforder),
    validatorMiddleware
] 

exports.UpdateStatusOfItemValidator = [
    check('itemId')
        .isMongoId().withMessage('Invalid order id format'),
    check('status')
        .custom((val)=>{
            if(["pending", "shipped", "delivered", "cancelled"].includes(val.toLowerCase())){
                return true;
            }
            throw new Error('This status type is not allowed');
        }),
    validatorMiddleware
]