const productsModel = require('../models/products');

exports.getHome = async (req, res, next) => {
    try {
        let validCategories = ['watches','phones','Books','laptops'];
        let category = req.query.category;
        if (category && category !== 'all' && validCategories.includes(category)) {
            const products = await productsModel.getProductsByCategory(category);
            res.render('index', { products: products });
        }
        else {
            const products = await productsModel.getAllProducts();
            res.render('index', { products: products });
        }
    }
    catch (err) {
        console.log(error);
        res.send('Failed to fetch products');
    }
}