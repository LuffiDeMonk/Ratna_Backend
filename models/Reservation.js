const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;

const reservationSchema = new Schema({
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true },
  seats: { type: Number, required: true, default: 1 },
  event: { type: String, required: true },
});

module.exports = mongoose.model("Reservation", reservationSchema);
