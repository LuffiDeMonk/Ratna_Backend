const mongoose = require("mongoose");

const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User" },
    orderItems: [
      {
        _id: false,
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
        },
      },
    ],
    totalPrice: { type: Number, required: true, default: 0.0 },
    shippingAddress: {
      contact: { type: String, required: true },
      address: { type: String, required: true },
      landmarks: { type: String },
    },
    paymentStatus: { type: Number, default: 0 }, //0=unpaid 1=paid
    deliveryStatus: { type: Number, default: 0 }, //0=pending, 1=delivered, 2=cancelled
  },
  {
    timestamps: { updatedAt: false, createdAt: true },
  }
);

module.exports = mongoose.model("Order", orderSchema);
