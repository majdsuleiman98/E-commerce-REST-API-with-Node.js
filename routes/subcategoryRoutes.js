const router = require("express").Router();
const { protect, allowedTo } = require("../middlewares/protectors");
const { getSubcategories, createSubcategory, getSubcategory, updateSubcategory, deleteSubcategory } = require("../controllers/subcategoryController");
const { getSubcategoryValidator, createSubcategoryValidator, deleteSubcategoryValidator, updateSubcategoryValidator } = require("../validation/subcategoryValidator");

router.route("/")
        .get(getSubcategories)
        .post(protect,allowedTo('admin'),createSubcategoryValidator,createSubcategory);

router.route("/:id")
        .get(getSubcategoryValidator,getSubcategory)
        .put(protect,allowedTo('admin'),updateSubcategoryValidator,updateSubcategory)
        .delete(protect,allowedTo('admin'),deleteSubcategoryValidator,deleteSubcategory);


module.exports = router;