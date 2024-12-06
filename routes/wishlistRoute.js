const { AddToWishList, RemoveFromWishList, GetWishList } = require('../controllers/wishlistController');
const { protect, allowedTo } = require('../middlewares/protectors');
const { AddProductToWishListValidator, RemoveProductFromWishListValidator } = require('../validation/wishlistValidator');
const router = require('express').Router();


router.use(protect,allowedTo('user'))

router.route('')
        .put(AddProductToWishListValidator,AddToWishList)
        .delete(RemoveProductFromWishListValidator,RemoveFromWishList)
        .get(GetWishList)

module.exports = router;