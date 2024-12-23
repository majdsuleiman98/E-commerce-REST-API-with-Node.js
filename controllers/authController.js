const asyncHandler = require('express-async-handler');
const {User} = require('../models/User');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const ApiError = require('../utils/apiError');
const { generateOTP, sendOTP } = require('../utils/emailSender');



/**
 * @desc Register user
 * @route /api/auth/register
 * @method POST
 * @access public
 */
const Register = asyncHandler(
    async(req,res)=>{
        const [otp, otpExpiry] = generateOTP();
        const user = await User.create({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            phone:req.body.phone,
            otp: {
                code: otp,
                expiry: otpExpiry,
            },
        });
        await sendOTP(req.body.email, otp);
        res.status(201).json({ 
            message: 'Registration successful. Please verify your email with the OTP sent.'
        });
})

/**
 * @desc Verify user email
 * @route /api/auth/verify
 * @method POST
 * @access public
 */
const Verify = asyncHandler(
    async(req,res)=>{
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.otp.code !== otp || new Date() > user.otp.expiry) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
        user.isVerified = true;
        user.otp = undefined; 
        await user.save();
        const token = jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET_KEY,{expiresIn:process.env.JWT_EXPIRE_TIME});
        res.status(201).json({message:'You are registered successfully',user,token});
})


/**
 * @desc Resen OTP to user email
 * @route /api/auth/resend-otp
 * @method POST
 * @access public
 */
const ResendOtp = asyncHandler(
    async(req,res)=>{
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const [otp, otpExpiry] = generateOTP();
        user.otp = {
            code: otp,
            expiry: otpExpiry,
        };
        await user.save();
        await sendOTP(email, otp);
        res.json({ message: 'New OTP sent successfully' });
})


/**
 * @desc Login user
 * @route /api/auth/login
 * @method POST
 * @access public
 */
const Login = asyncHandler(
    async(req,res,next)=>{
        const user = await User.findOne({email:req.body.email});
        if(!user || !(await bcryptjs.compare(req.body.password,user.password))) {
            return next(new ApiError('Incorrect email or password',401));
        }
        const token = jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET_KEY,{expiresIn:process.env.JWT_EXPIRE_TIME});
        res.status(200).json({message:'You are logged in successfully',user,token});
    }
)

/**
 * @desc Be seller
 * @route /api/auth/be-seller
 * @method POST
 * @access public
 */
const Beseller = asyncHandler(
    async(req,res)=>{
        const seller = await User.create({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            phone:req.body.phone,
            tax_number: req.body.tax_number,
            role:'seller'
        });
        res.status(201).json({message:'You are seller now.Please login',seller});
    }
)


module.exports = {
    Register,
    Login,
    Beseller,
    Verify,
    ResendOtp
}