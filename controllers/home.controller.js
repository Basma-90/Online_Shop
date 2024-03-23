const productsModel = require('../models/product.model');

exports.getHome = async (req, res, next) => {
    try {
        let validCategories = ['watches','phones','Books','laptops'];
        let category = req.query.category;
        if (category && category !== 'all' && validCategories.includes(category)) {
            const products = await productsModel.getProductsByCategory(category);
            res.render('index', { products: products,
                isUser: req.session.userId,
                error: req.flash('errors')[0],
                isAdmin:req.session.isAdmin,
                pageTitle:"Home"
            });
        }
        else {
            const products = await productsModel.getAllProducts();
            res.render('index', { products: products ,
                isUser: req.session.userId,
                error: req.flash('errors')[0],
                isAdmin:req.session.isAdmin,
                pageTitle:"Home"
            });
        }
    }
    catch (err) {
        res.redirect('/error');
    }
}