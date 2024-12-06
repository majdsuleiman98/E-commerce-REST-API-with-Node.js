const asyncHandler = require('express-async-handler');
const {User} = require('../models/User');
const ApiError = require('../utils/apiError');
const jwt = require('jsonwebtoken');
const { Product } = require('../models/Product');

const protect = asyncHandler(
    async(req,res,next)=>{
        let token;
        if(req.headers.authorization) {
            token = req.headers.authorization.split(' ')[1];
            try {
                const decode = jwt.verify(token,process.env.JWT_SECRET_KEY);
                req.user = decode;
                const user = await User.findById(req.user.id);
                if(!user) {
                    return next(new ApiError('This user does not exist',401));
                }
                next();
            } catch (error) {
                return next(new ApiError('Invalid token!!',401));
            }
            
        }
        else{
            return next(new ApiError('Yor are not login. Please login to get access this route',401));
        }
    }
);

const allowedTo = (...roles) =>
    asyncHandler(
        async(req,res,next)=>{
            if(!roles.includes(req.user.role)){
                return next(new ApiError('You not allowed to access this route',403));
            }
            next();
        }
    )


module.exports = {
    protect,
    allowedTo,
}