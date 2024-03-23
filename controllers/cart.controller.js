const cartModel = require("../models/cart.model");
const { validationResult } = require("express-validator");
const Order = require("../models/order.model")

exports.getCart = async (req, res, next) => {
    try {
        const items = await cartModel.getItemsByUser(req.session.userId);
        res.render("cart", {
            items: items,
            isUser: true,
            isAdmin: req.session.isAdmin,
            pageTitle: "Cart",
            isAdmin:req.session.isAdmin,
            error:req.flash('errors')[0]
        });
    } catch (err) {
        res.redirect('/error');
    }
};

exports.postCart = async (req, res, next) => {
    try {
        if (validationResult(req).isEmpty()) {

            const existingCartItem = await cartModel.isItemInCart(req.body.productId, req.session.userId);
            console.log(req.session.userId);
            console.log("ts", existingCartItem);
            if (req.session.userId !== null && existingCartItem && existingCartItem.productId === req.body.productId) {
                await cartModel.updateItemAmount(req.body.productId, req.session.userId, req.body.amount);
            }
            else {
                await cartModel.addNewItem({
                    name: req.body.name,
                    price: req.body.price,
                    amount: req.body.amount,
                    productId: req.body.productId,
                    userId: req.session.userId,
                    timestamp: Date.now()
                });
            }
            res.redirect("/cart");
        } else {
            req.flash("errors", validationResult(req).array());
            res.redirect(req.body.redirectTo);
        }
    } catch (err) {
        res.redirect("/error");
    }
};

exports.postSave = async (req, res, next) => {
    try {
        if (validationResult(req).isEmpty()) {
            await cartModel.editItem(req.body.cartId, {
                amount: req.body.amount,
                timestamp: Date.now()
            });
            res.redirect("/cart");
        } else {
            req.flash("errors", validationResult(req).array());
            res.redirect("/cart");
        }
    } catch (err) {
        res.redirect('/error');
    }
};

exports.postDelete = async (req, res, next) => {
    try {
        await cartModel.deleteItem(req.body.cartId);
        res.redirect("/cart");
    } catch (err) {
        res.redirect('/error');
    }
};

exports.postDeleteAll = async (req, res, next) => {
    try {
        await cartModel.deleteAll(req.session.userId);
        res.redirect("/cart");
    }
    catch (err) {
        res.redirect('/error');
    }
}

exports.checkOut = async (req, res, next) => {
    try {
        // Validate the request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash("errors", errors.array());
            return res.redirect("/cart/verify-orders?order=" + JSON.stringify(req.body));
        }

        // Extract data from the request body
        const { name, price, amount, userId, productId, address } = req.body;

        // Check if arrays have the same length
        const arrayLength = name.length;
        if (
            arrayLength !== price.length ||
            arrayLength !== amount.length ||
            arrayLength !== userId.length ||
            arrayLength !== productId.length
        ) {
            throw new Error('Arrays must have the same length');
        }

        // Create orders for each item
        for (let i = 0; i < arrayLength; i++) {
            const orderData = {
                name: name[i],
                price: parseFloat(price[i]),
                amount: parseInt(amount[i]),
                userId: userId[i],
                productId: productId[i],
                address: address
            };
            await Order.addNewOrder(orderData);
        }

        // Redirect to the checkout page
        res.redirect("/cart/checkout");
    } catch (err) {
        // Redirect to the error page if an error occurs
        res.redirect('/error');
    }
}


exports.getOrderVerify = async (req, res, next) => {
    try {
        const cartItems = await cartModel.getAllItems({ userId: req.session.userId });
        res.render("verify-orders", {
            items: cartItems,
            isUser: true,
            isAdmin: req.session.isAdmin,
            pageTitle: "Verify Order",
            error: req.flash("errors")[0]
        });
    } catch (err) {
        res.redirect('/error');
    }
};

exports.getOrders = async (req, res, next) => {
    try {
        const orders = await Order.getOrdersByUser( req.session.userId );
        res.render("orders", {
            pageTitle: "Orders",
            isUser: true,
            isAdmin: req.session.isAdmin,
            items: orders,
            error:req.flash('errors')[0]
        });
    }
    catch (err) {
        res.redirect('/error');
    }
};


