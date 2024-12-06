const router = require("express").Router();
const { protect, allowedTo } = require("../middlewares/protectors");
const { getBrands, createBrand, getBrand, updateBrand, deleteBrand, updateImageOfBrand } = require("../controllers/brandController");
const { createBrandValidator, getBrandValidator, updateBrandValidator, deleteBrandValidator, updateImageBrandValidator } = require("../validation/brandValidator");
const {upload} = require('../middlewares/uploadPhoto');


router.route('/')
        .get(getBrands)
        .post(protect,allowedTo('admin'),upload.single('image'),createBrandValidator,createBrand)

router.route('/:id')
        .get(getBrandValidator,getBrand)
        .put(protect,allowedTo('admin'),updateBrandValidator,updateBrand)
        .delete(protect,allowedTo('admin'),deleteBrandValidator,deleteBrand)

router.route("/update-image/:id")
        .put(protect,allowedTo('admin'),upload.single('image'),updateImageBrandValidator,updateImageOfBrand);

module.exports = router;