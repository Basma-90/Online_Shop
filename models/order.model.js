const mongoose = require("mongoose");
const cartModel = require("./cart.model");

const orderSchema = mongoose.Schema({
  name: [String],
  price: [Number],
  amount: [Number],
  userId: [String],
  productId: [String],
  timestamp: [Number],
  address: String,
  status: {
    type: String,
    default: "pending",
  },
});

const Order = mongoose.model("order", orderSchema);
exports.Order = Order;

exports.addNewOrder = async (data) => {
  try {
    await cartModel.deleteAll(data.userId);
    data.timestamp = Date.now();
    let order = new Order(data);
    await order.save();
  } catch (err) {
    throw err;
  }
};

exports.add = async (data) => {
  try {
    await cartModel.deleteItem(data.cartId);
    data.timestamp = Date.now();
    let order = new Order(data);
    await order.save();
  } catch (err) {
    throw err;
  }
};

exports.getOrdersByUser = async (userId) => {
  try {
    const items = await Order.find(
      { userId: userId },
      {},
      { sort: { timestamp: 1 } }
    );
    return items;
  } catch (err) {
    throw err;
  }
};

exports.cancelOrder = async (id) => {
  try {
    await Order.findByIdAndDelete(id);
  } catch (err) {
    throw err;
  }
};

exports.getAllOrders = async () => {
  try {
    const items = await Order.find({}, {}, { sort: { timestamp: 1 } });

    return items;
  } catch (err) {
    throw err;
  }
};

exports.editOrder = async (id, newStatus) => {
  try {
    const items = await Order.updateOne({ _id: id }, { status: newStatus });

    return items;
  } catch (err) {
    throw err;
  }
};

exports.addItems = async (itemsArray) => {
  try {
    for (let item of itemsArray) {
      let order = new Order(item);
      await order.save();
    }
  } catch (err) {
    console.log(err);
  }
};

exports.getOrdersByStatus= async(status)=>{
  try{
      const orders = await Order.find({status:status});
      return orders;
  }
  catch(err){
    console.log(err);
  }
}


