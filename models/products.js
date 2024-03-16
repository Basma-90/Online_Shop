const mongoose = require('mongoose');
require('dotenv').config();

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    }
});


const Product = mongoose.model('Product', productSchema);
module.exports = Product;
const getAllProducts = async () => {
    try {
        return await  Product.find();
    } catch (error) {
        throw new Error(error);
    }
};

const getProductsByCategory = async (category) => {
    try {
        return await Product.find({category : category});
    }
    catch (error) {
        throw new Error(error);
    }
};

const getProduct = async (id) => {
    try {
        return await Product.findById(id);
        
    }
    catch (error) {
        throw new Error(error);
    }
};

const getFirstProduct = async () => {
    try {
        return await Product.findOne();
    }
    catch (error) {
        throw new Error(error);
    }
};

module.exports = {
    getAllProducts,
    getProductsByCategory,
    getProduct,
    getFirstProduct
};



