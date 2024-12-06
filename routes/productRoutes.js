const router = require('express').Router();
const { getProducts, getProduct, deleteProduct, createProduct, updateProduct, getMyProducts, updateImageOfProduct } = require('../controllers/productController');
const { protect, ProtectOwner, allowedTo } = require('../middlewares/protectors');
const { upload } = require('../middlewares/uploadPhoto');
const { getProductValidator, deleteProductValidator, createProductValidator, updateProductValidator, updateImageProductValidator } = require('../validation/productValidator');


router.get('/my-products',protect,allowedTo('seller'),getMyProducts)

router.route('/')
        .get(getProducts)
        .post(protect,allowedTo('seller'),upload.single('image'),createProductValidator,createProduct);

router.route('/:id')
        .get(getProductValidator,getProduct)
        .delete(protect,allowedTo('seller','admin'),deleteProductValidator,deleteProduct)
        .put(protect,allowedTo('seller'),updateProductValidator,updateProduct)

router.route("/update-image/:id")
        .put(protect,allowedTo('seller'),upload.single('image'),updateImageProductValidator,updateImageOfProduct);

module.exports = router;