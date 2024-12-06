const ApiError = require("../utils/apiError");

const notfoundHandler = (req,res,next)=>{
    const error = new ApiError(`Can't find this route ${req.originalUrl}`,404);
    next(error);
}

module.exports = notfoundHandler;