const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

//models
const Product = require("../models/Product");
const Category = require("../models/Category");
const HTTPError = require("../models/Error");

exports.getAllCategory = async (req, res, next) => {
  let categories;
  try {
    categories = await Category.find({}, ["title", "image"]);
    return res.status(201).json({ categories });
  } catch (error) {
    return next(new HTTPError(error, 402));
  }
};

exports.getAllProducts = async (req, res, next) => {
  let products;
  try {
    products = await Product.find({}).populate("category", "title");
    return res.status(201).json({ products });
  } catch (error) {
    return next(new HTTPError(error, 402));
  }
};

exports.getSingleProduct = async (req, res, next) => {
  let productID = req.params.productID;

  let selectedProduct;
  try {
    selectedProduct = await Product.findById(productID);
    res.status(201).json({ selectedProduct });
  } catch (error) {
    console.log(error, 422);
  }
  if (!selectedProduct) return next(new HTTPError("Invalid product id", 401));
};

exports.addNewProduct = async (req, res, next) => {
  const isError = validationResult(req);
  if (!isError.isEmpty()) {
    return next(
      new HTTPError("Please check all the fields before submission", 404)
    );
  }
  const { title, description, price, category, imageURL } = req.body;
  let newProduct = new Product({
    title,
    description,
    price,
    category,
    imageURL,
  });
  try {
    await newProduct.save();
    res.status(201).json({ message: "New Product Created" });
  } catch (error) {
    return next(new HTTPError(error, 422));
  }
};

exports.deleteSingleProduct = async (req, res, next) => {
  let productID = req.params.productID;
  try {
    await Product.findByIdAndDelete(productID);
    return res.status(201).json({ message: "Product Deleted Successfully" });
  } catch (error) {
    return next(new HTTPError(error, 422));
  }
};

exports.editSingleProduct = async (req, res, next) => {
  let productID = req.params.productID;
  let { title, description, imageURL, price, category } = req.body;

  try {
    await Product.findByIdAndUpdate(
      { _id: productID },
      { title, description, imageURL, price, category }
    );
    res.status(200).json({ message: "Product Updated Successfully" });
  } catch (error) {
    return next(new HTTPError(error, 422));
  }
};

exports.addNewCategory = async (req, res, next) => {
  const isError = validationResult(req);
  if (!isError.isEmpty()) {
    return next(
      new HTTPError("Please check all the fields before submission", 404)
    );
  }
  const { title, image } = req.body;
  let modifiedTitle = title.toLowerCase();

  const category = new Category({
    title: modifiedTitle,
    image,
  });

  let exitstedCategory;
  try {
    existedCategory = await Category.findOne({
      title: modifiedTitle,
    });
  } catch (error) {
    return next(new HTTPError(error, 422));
  }
  if (existedCategory) {
    return next(new HTTPError("Category already present", 401));
  }

  try {
    await category.save();
    res.status(201).json({ message: "Category added successfully" });
  } catch (error) {
    return next(new HTTPError(error, 422));
  }
};

exports.editSingleCategory = async (req, res, next) => {
  let categoryID = req.params.categoryID;

  let { title, image } = req.body;

  try {
    await Category.findByIdAndUpdate({ _id: categoryID }, { title, image });
    res.status(200).json({ message: "Category updated successfully" });
  } catch (error) {
    return next(new HTTPError(error, 422));
  }
};
