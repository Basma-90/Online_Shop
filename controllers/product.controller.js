const productsModel = require('../models/products');

exports.getProductByID= async(req,res,next)=>{
try{
    const id=req.params.id;
    const product=await productsModel.getProduct(id);
    res.render('product',{product:product});
}
catch(err){
    console.log(err);
    res.send('Failed to fetch product');
}
};

exports.getProduct= async(req,res,next)=>{
    try{
        const firstProduct= await productsModel.getFirstProduct();
        res.render('product',{product:firstProduct});
    }
    catch(err){
        console.log(err);
        res.send('Failed to fetch product');
    }
};
