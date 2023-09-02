const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  title: { type: String, required: true },
  image: { type: String, reqiured: true },
});

module.exports = mongoose.model("Category", CategorySchema);
