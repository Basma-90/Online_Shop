const cartModel = require("../models/cart.model");
const orderModel = require("../models/order.model");
const { validationResult } = require("express-validator");
const authModel= require("../models/auth.model")

exports.getOrderVerify = async (req, res, next) => {
    try {
        const cartItem = await cartModel.getItemById(req.query.order);
        res.render("verify-order", {
            cart: cartItem,
            isUser: true,
            isAdmin: req.session.isAdmin,
            pageTitle: "Verify Order",
            error: req.flash("errors")[0]
        });
    } catch (err) {
        res.redirect('/error');
    }
};

exports.getOrder = async (req, res, next) => {
    try {
        const items = await orderModel.getOrdersByUser(req.session.userId);
        res.render("orders", {
            pageTitle: "Orders",
            isUser: true,
            isAdmin: req.session.isAdmin,
            items: items,
            error:req.flash('errors')[0],
            pageTitle:"Orders"
        });
    } catch (err) {
        console.log(err);
        res.redirect('/error');
    }
};

exports.postOrder = async (req, res, next) => {
    try {
        if (validationResult(req).isEmpty()) {
            await orderModel.add(req.body);
            res.redirect("/orders");
        } else {
            req.flash("errors", validationResult(req).array());
            res.redirect("/verify-order?order=" + req.body.cartId);
        }
    } catch (err) {
        console.log(err);
        res.redirect("/error");
    }
};

exports.postCancel = async (req, res, next) => {
    try {
        await orderModel.cancelOrder(req.body.orderId);
        res.redirect("/orders");
    } catch (err) {
        res.redirect("/error");
    }
};

exports.filterStatus = async (req, res, next) => {
    try {
        let status = req.query.status;
        let orders;

        if (status && status != 'all') {
            orders = await orderModel.getOrdersByStatus(status);
        } else {
            orders = await orderModel.getAllOrders();
        }

        const pageTitle = "Manage Orders";
        let email = null;
        let items = [];

        if (orders && orders.length > 0) {
            email = await authModel.getEmail(orders[0].userId);
            items = orders;
        }

        return res.render('manage-orders', {
            isUser: req.session.userId,
            error: req.flash('errors')[0],
            isAdmin: req.session.isAdmin,
            items: items,
            email: email,
            pageTitle: pageTitle
        });
    } catch (err) {
        res.redirect('/error');
    }
};

exports.filterUsers = async (req, res, next) => {
    try {
        let emailInput = req.query.emailInput;
        let userId = await authModel.getUserId(emailInput);
        let orders = await orderModel.getOrdersByUser(userId);

        const pageTitle = "Manage Orders";
        let email = null;
        let items = [];

        if (orders && orders.length > 0) {
            email = await authModel.getEmail(orders[0].userId);
            items = orders;
        }

        return res.render('manage-orders', {
            isUser: req.session.userId,
            error: req.flash('errors')[0],
            isAdmin: req.session.isAdmin,
            items: items,
            email: email,
            pageTitle: pageTitle
        });
    } catch (err) {
        res.redirect('/error');
    }
};
