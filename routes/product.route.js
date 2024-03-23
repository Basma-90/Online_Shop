const router= require('express').Router();
const productController=require('../controllers/product.controller');
const bodyParser= require('body-parser');
const authGuard=require('./guards/auth.guard'); 
const check=require('express-validator').check;

router.get('/', productController.getProduct);
router.get('/:id', productController.getProductByID);

router.post('/',bodyParser.urlencoded({extended:true}),
check('name').not().isEmpty().withMessage('Name is required'),
check('amount').not().isEmpty().withMessage('Amount is required').isInt({min:1}).withMessage('Amount must be a number greater than 0'),
productController.addProduct);

module.exports=router;