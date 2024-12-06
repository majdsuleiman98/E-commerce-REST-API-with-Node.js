const { AddToCart, GetLoggedUserCart, RemoveItemFromCart, CleanCart, UpdateQuantity, ApplyCupon } = require('../controllers/cartController');
const { protect, allowedTo } = require('../middlewares/protectors');
const { addToCartValidator, RemoveItemFromCartValidator, UpdateItemQuantityValidator, ApplyCuponValidator } = require('../validation/cartValidator');
const router = require('express').Router();


router.use(protect,allowedTo('user'));
router.route('/add-to-cart').post(addToCartValidator,AddToCart);
router.route('/my-cart').get(GetLoggedUserCart);
router.route('/remove-item/:itemId').put(RemoveItemFromCartValidator,RemoveItemFromCart);
router.route('/clean-cart').delete(CleanCart);
router.route('/update-quantity/:itemId').put(UpdateItemQuantityValidator,UpdateQuantity);
router.route('/apply-cupon').put(ApplyCuponValidator,ApplyCupon);
module.exports = router;