const router = require("express").Router();
const { check } = require("express-validator");

const productControllers = require("../controllers/products");
const { checkValidToken, checkAdmin } = require("../middleware/authMiddleware");

router.get("/", productControllers.getAllProducts);
router.get("/category", productControllers.getAllCategory);
router.get("/:productID", productControllers.getSingleProduct);

router.use(checkValidToken, checkAdmin);

router.post(
  "/",
  [
    check("title").notEmpty(),
    check("description").notEmpty().isLength({ min: 10, max: 500 }),
    check("imageURL").notEmpty(),
    check("price").notEmpty().isNumeric(),
    check("category").notEmpty(),
  ],
  productControllers.addNewProduct
);
router.post(
  "/category",
  [check("title").notEmpty(), check("image").notEmpty()],
  productControllers.addNewCategory
);

router.patch("/:productID", productControllers.editSingleProduct);
router.patch("/category/:categoryID", productControllers.editSingleCategory);

router.delete("/", productControllers.deleteSingleProduct);

module.exports = router;
