const router = require('express').Router();
const { Register, Login, Beseller, Verify, ResendOtp} = require('../controllers/authController');
const { RegisterValidator, LoginValidator, BesellerValidator } = require('../validation/authValidator');



router.route('/register').post(RegisterValidator,Register)
router.route('/login').post(LoginValidator,Login)
router.route('/be-seller').post(BesellerValidator,Beseller)
router.route('/verify').post(Verify)
router.route('/resend-otp').post(ResendOtp)
module.exports = router;