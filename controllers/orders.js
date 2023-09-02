const HTTPError = require("../models/Error");
const Order = require("../models/Order");

exports.addToCart = async (req, res, next) => {
  let userID = res.locals.user;
  let { orders, shippingAddress, totalPrice } = req.body;

  const createOrder = new Order({
    user: userID,
    orderItems: orders.map((order) => {
      return {
        ...order,
        product: order.productId,
      };
    }),
    totalPrice,
    shippingAddress,
  });

  try {
    await createOrder.save();
    return res.status(201).json({ message: "Order placed successfully" });
  } catch (error) {
    console.log(error);
    return next(
      new HTTPError(
        "An error occured while placing the order, please try again later",
        422
      )
    );
  }
};

exports.getAllOrders = async (req, res, next) => {
  let allOrders;
  try {
    allOrders = await Order.find({}, ["-orderItems", "-totalPrice"])
      .populate("user", "name")
      .populate("orderItems.product", ["title", "imageURL", "price"]);
    res.status(200).json({ orders: allOrders });
  } catch (error) {
    return next(
      new HTTPError(
        "An unknown error occured while finding orders. Please try again later",
        422
      )
    );
  }
  if (!allOrders) {
    return next(new HTTPError("No orders available currently", 401));
  }
};

exports.getMyOrders = async (req, res, next) => {
  let { userID } = req.params;
  let orders;
  try {
    orders = await Order.find({ user: userID })
      .populate("orderItems.product", ["title", "price", "imageURL"])
      .populate("user", "name");
    return res.status(200).json({ orders });
  } catch (error) {
    console.log(error.message);
    return next(new HTTPError("An internal error occured", 422));
  }
};

exports.editOrderStatus = async (req, res, next) => {
  let { orderID } = req.params;
  let { paymentStatus, deliveryStatus } = req.body;
  let selectedOrder;
  try {
    selectedOrder = await Order.findById(orderID);
  } catch (error) {
    return next(new HTTPError("An error occured, please try again later", 422));
  }
  if (!selectedOrder) {
    return next(new HTTPError("Order couldn't be found", 401));
  }
  selectedOrder.paymentStatus = paymentStatus;
  selectedOrder.deliveryStatus = deliveryStatus;

  try {
    await selectedOrder.save();
    res.status(200).json({ message: "Order updated successfully" });
  } catch (error) {
    return next(
      new HTTPError("An error occured while updating order status", 404)
    );
  }
};

exports.deleteOrders = async (req, res, next) => {
  let { orderID } = req.params;

  try {
    await Order.findByIdAndDelete(orderID);
    return res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.log(error);
    return next(
      new HTTPError(
        "An error occured while deleting order, please try again later",
        422
      )
    );
  }
};
