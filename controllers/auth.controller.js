const { validationResult } = require('express-validator');
const authModel = require('../models/auth.model');

exports.getLogin = (req, res, next) => {
    res.render('login', { error: req.flash('error')[0] ,
    errors: req.flash('errors'),
    isUser: req.session.userId,
    isAdmin:false,
    pageTitle:"Login"
});
}

exports.getSignup = (req, res, next) => {
    res.render('signup', {
        error: req.flash('error')[0],
        errors: req.flash('errors'),
        isUser: req.session.userId,
        isAdmin:false,
        pageTitle:"Signup"
    });
}


exports.postSignup = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array());
            req.flash('errors', errors.array());
            return res.redirect('/signup');
        }
        const { name, email, password } = req.body;
        await authModel.createUser(name, email, password);
        res.redirect('/login');
    }
    catch (err) {
        req.flash('error', err.message);
        res.redirect('/signup');
    }
}

exports.postLogin = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array());
            req.flash('errors', errors.array());
            return res.redirect('/login');
        }
        const { email, password } = req.body;
        const user = await authModel.login(email, password);
        req.session.userId = user._id;
        req.session.isAdmin=user.isAdmin;
        res.redirect('/');
    }
    catch (err) {
        req.flash('error', err.message);
        console.log(err);
        res.redirect('/login');
    }
}

exports.logout = async (req, res, next) => {
    try {
        req.session.destroy();
        res.redirect('/login');
    }
    catch (err) {
        console.log(err);
        res.redirect('/');
    }
}
