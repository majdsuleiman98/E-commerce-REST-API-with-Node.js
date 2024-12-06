const router = require("express").Router();
const {getReviews,getReview,createReview,updateReview,deleteReview}=require("../controllers/reviewController");
const { protect, allowedTo } = require("../middlewares/protectors");
const { createReviewValidator, getReviewValidator, updateReviewValidator, deleteReviewValidator } = require("../validation/reviewValidator");

router.route("/")
        .get(getReviews)
        .post(protect,allowedTo("user"),createReviewValidator,createReview)

router.route("/:id")
        .get(getReviewValidator,getReview)
        .put(protect,allowedTo("user"),updateReviewValidator,updateReview)
        .delete(protect,allowedTo("user","admin"),deleteReviewValidator,deleteReview)

module.exports = router;