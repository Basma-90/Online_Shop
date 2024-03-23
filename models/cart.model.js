const mongoose = require("mongoose");
const cartSchema = mongoose.Schema({
    name: String,
    price: Number,
    amount: Number,
    userId: String,
    productId: String,
    timestamp: Number
});

const CartItem = mongoose.model("cart", cartSchema);

exports.addNewItem = async (data) => {
    try {
        let item = new CartItem(data);
        await item.save();
    } catch (err) {
        throw err;
    }
};

exports.getItemsByUser = async (userId) => {
    try {
        const items = await CartItem.find({ userId: userId }, {}, { sort: { timestamp: 1 } });
        return items;
    } catch (err) {
        throw err;
    }
};

exports.editItem = async (id, newData) => {
    try {
        const items = await CartItem.updateOne({ _id: id }, newData);
        return items;
    } catch (err) {
        throw err;
    }
};

exports.deleteItem = async (id) => {
    try {
        await CartItem.findByIdAndDelete(id);
    } catch (err) {
        throw err;
    }
};

exports.getItemById = async (id) => {
    try {
        const item = await CartItem.findById(id);
        return item;
    } catch (err) {
        throw err;
    }
};

exports.isItemInCart= async (productId,userId)=>{
    try{
        const item = await CartItem.findOne({productId:productId,userId:userId});
        console.log("ts",item);
        console.log("ts",productId);
        return item;
    }
    catch(err){
        throw err;
    }
}

exports.updateItemAmount= async (productId,userId,amount)=>{
    try{
        let item = await CartItem.findOne({productId:productId,userId:userId});
        item.amount+=parseInt(amount);
        await item.save();
    }
    catch(err){
        throw err;
    }
}

exports.deleteAll= async (userId)=>{
    try{
        await CartItem.deleteMany({userId:userId});
    }
    catch(err){
        throw err;
    }
}

exports.getAllItems = async (filter) => {
    try {
        const items = await CartItem.find(filter);
        return items;
    } catch (err) {
        throw err;
    }
};


