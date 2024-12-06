const router = require('express').Router();
const { protect, allowedTo } = require("../middlewares/protectors");
const { createUser, getUser, updateUser, deleteUser, getUsers, changePassword, getLoggedUserProfile, changeLoggedUserPassword, updateLoggedUserProfile, deleteLoggedUserProfile, updateImageUserProfile } = require('../controllers/userController');
const { createUserValidator, getUserValidator, deleteUserValidator, updateUserValidator, changePasswordValidator, updaetImageUserValidator } = require('../validation/userValidator');
const { upload } = require('../middlewares/uploadPhoto');



router.get('/get-user-profile',protect,getLoggedUserProfile,getUser);
router.put('/change-my-password',protect,changeLoggedUserPassword,changePasswordValidator,changePassword)
router.put('/update-user-profile',protect,updateLoggedUserProfile,updateUserValidator,updateUser);
router.delete('/delete-user-profile',protect,deleteLoggedUserProfile,deleteUserValidator,deleteUser);
router.put("/update-image",protect,upload.single("image"),updaetImageUserValidator,updateImageUserProfile)

router.route('/')
        .get(protect,allowedTo('admin'),getUsers)
        .post(protect,allowedTo('admin'),createUserValidator,createUser);

router.route('/:id')
        .get(protect,allowedTo('admin'),getUserValidator,getUser)
        .put(protect,allowedTo('admin'),updateUserValidator,updateUser)
        .delete(protect,allowedTo('admin'),deleteUserValidator,deleteUser);

router.route('/change-password/:id').put(protect,allowedTo('admin'),changePasswordValidator,changePassword);




module.exports = router;