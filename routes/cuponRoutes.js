const { CreateCupon, GetCupons, GetCupon, UpdateCupon, DeleteCupon, ValidateCupon } = require('../controllers/cuponController');
const { protect, allowedTo } = require('../middlewares/protectors');
const { createCuponValidator, getCuponValidator, deleteCuponValidator, updateCuponValidator } = require('../validation/cuponValidator');
const router = require('express').Router();

router.use(protect,allowedTo('admin'))

router.route('/')
        .post(createCuponValidator,CreateCupon)
        .get(GetCupons)

router.route('/:id')
        .get(getCuponValidator,GetCupon)
        .put(updateCuponValidator,UpdateCupon)
        .delete(deleteCuponValidator,DeleteCupon)

router.route('/validate').post(ValidateCupon)

module.exports = router;