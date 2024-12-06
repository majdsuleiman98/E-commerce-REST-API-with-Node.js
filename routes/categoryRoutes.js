const router = require("express").Router();
const { protect, allowedTo } = require("../middlewares/protectors");
const { createCategory, getCategories, getCategory, updateCategory, deleteCategory, updateImageOfCategory } = require("../controllers/categoryController");
const { getCategoryValidator, createCategoryValidator, updateCategoryValidator, deleteCategoryValidator, updateImageCategoryValidator } = require("../validation/categoryValidator");
const {upload} = require('../middlewares/uploadPhoto');


router.route("/")
        .post(protect,allowedTo('admin'),upload.single('image'),createCategoryValidator,createCategory)
        .get(getCategories);

router.route("/:id")
        .get(getCategoryValidator,getCategory)
        .put(protect,allowedTo('admin'),updateCategoryValidator,updateCategory)
        .delete(protect,allowedTo('admin'),deleteCategoryValidator,deleteCategory);

router.route("/update-image/:id")
        .put(protect,allowedTo('admin'),upload.single('image'),updateImageCategoryValidator,updateImageOfCategory);
        

module.exports=router;