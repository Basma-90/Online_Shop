const productsModel = require("../models/product.model");
const ordersModel = require("../models/order.model");
const { validationResult } = require("express-validator");
const userModel=require("../models/auth.model");

exports.getAdd = (req, res, next) => {
    res.render("add-product", {
        validationErrors: req.flash("validationErrors"),
        isUser: true,
        isAdmin: true,
        productAdded: req.flash("added")[0],
        pageTitle: "Add Product"
    });
};

exports.postAdd = async (req, res, next) => {
    try {
        if (validationResult(req).isEmpty()) {
            req.body.image = req.file.filename;
            await productsModel.addNewProduct(req.body);
            req.flash("added", true);
            res.redirect("/admin/add");
        } else {
            req.flash("validationErrors", validationResult(req).array());
            res.redirect("/admin/add");
        }
    } catch (err) {
        res.redirect('/error');
    }
};

exports.getOrders = async (req, res, next) => {
    try {
        const items = await ordersModel.getAllOrders();
        const email= await userModel.getEmail(items[0].userId);
        res.render("manage-orders", {
            pageTitle: "Manage Orders",
            isUser: true,
            isAdmin: true,
            items: items,
            email:email
        });
    } catch (err) {
        res.redirect('/error');
    }
};

exports.postOrders = async (req, res, next) => {
    try {
        await ordersModel.editOrder(req.body.orderId, req.body.status);
        res.redirect("/admin/orders");
    } catch (err) {
        res.redirect('/error');
    }
};
