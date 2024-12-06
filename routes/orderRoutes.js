const { createOrder, GetOrdersOfUser, GetSpecificOrderOfUser, GetOrdersOfSeller, UpdateStatusOfOrder } = require('../controllers/orderController');
const { protect, allowedTo } = require('../middlewares/protectors');
const { CreateOrderValidator, getOrderValidator, UpdateStatusOfItemValidator } = require('../validation/orderValidator');
const router = require('express').Router();


router.use(protect)
router.route("/").post(allowedTo('user'),CreateOrderValidator,createOrder);
router.route("/").get(allowedTo('user'),GetOrdersOfUser);
router.route("/seller").get(allowedTo('seller'),GetOrdersOfSeller);
router.route("/:id").get(allowedTo('user'),getOrderValidator,GetSpecificOrderOfUser);
router.route("/update/").put(allowedTo('seller'),UpdateStatusOfItemValidator,UpdateStatusOfOrder);

module.exports = router;