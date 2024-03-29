const router = require('express').Router();
const bodyParser = require("body-parser")
const authController = require('../controllers/auth.controller');
const check = require('express-validator').check;
const authGuard = require('./guards/auth.guard');

router.get('/login',authGuard.notAuth, authController.getLogin);
router.get('/signup',authGuard.notAuth, authController.getSignup);

router.post("/signup",
    authGuard.notAuth,
    check('name').not().isEmpty().withMessage('Name is required'),
    check('email').not().isEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
    check('password').not().isEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    check('confirmPassword').custom((value, { req }) => { if (value === req.body.password) return true; else throw 'Password and confirm password does not a match' }),
    bodyParser.urlencoded({ extended: true }),
    authController.postSignup);

router.post("/login",
    authGuard.notAuth,
    check('email').not().isEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
    check('password').not().isEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    bodyParser.urlencoded({ extended: true }),
    authController.postLogin);

router.all('/logout',authGuard.isAuth, authController.logout)

module.exports = router;