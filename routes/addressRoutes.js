const { AddAddress, GetAddress, RemoveAddress } = require('../controllers/addressController');
const { protect, allowedTo } = require('../middlewares/protectors');
const { AddAddressValidator, RemoveAddressValidator } = require('../validation/addressValidator');
const router = require('express').Router();

router.use(protect,allowedTo('user'))
router.route("/").put(AddAddressValidator,AddAddress)   
                .get(GetAddress)
                .delete(RemoveAddressValidator,RemoveAddress);

module.exports = router;