const productsModel = require('../models/product.model');
const {validationResult}=require('express-validator');

exports.getProductByID= async(req,res,next)=>{
try{
    const id=req.params.id;
    const product=await productsModel.getProduct(id);
    res.render('product',{product:product,
    isUser:req.session.userId,
    error:req.flash('errors')[0],
    isAdmin:req.session.isAdmin
    });
}
catch(err){
    res.redirect('/error');
}
};

exports.getProduct= async(req,res,next)=>{
    try{
        const firstProduct= await productsModel.getFirstProduct();
        res.render('product',{product:firstProduct,
        isUser:req.session.userId,
        error:req.flash('errors')[0],
        isAdmin:req.session.isAdmin
        });
    }
    catch(err){
        res.redirect('/error');
    }
};

exports.addProduct= async(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        req.flash('errors',errors.array());
        return res.redirect(req.body.redirectTo)
    }
    const product= {
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        description: req.body.description,
        image: req.file.filename,
    };
    try{
        const result= await productsModel.addProduct(product);
        res.redirect('/');
    }
    catch(err){
        res.redirect('/error');
    }
}
