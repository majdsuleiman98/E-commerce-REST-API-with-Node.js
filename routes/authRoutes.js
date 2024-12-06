const router = require('express').Router();
const { Register, Login, Beseller } = require('../controllers/authController');
const { RegisterValidator, LoginValidator, BesellerValidator } = require('../validation/authValidator');



router.route('/register').post(RegisterValidator,Register)
router.route('/login').post(LoginValidator,Login)
router.route('/be-seller').post(BesellerValidator,Beseller)

module.exports = router;