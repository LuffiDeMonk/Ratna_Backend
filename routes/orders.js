const router = require("express").Router();

const orderControllers = require("../controllers/orders");
const { checkValidToken, checkAdmin } = require("../middleware/authMiddleware");

router.use(checkValidToken);
router.get("/:userID", orderControllers.getMyOrders);
router.post("/", orderControllers.addToCart);

router.use(checkAdmin);
router.get("/", orderControllers.getAllOrders);
router.patch("/:orderID", orderControllers.editOrderStatus);
router.delete("/:orderID", orderControllers.deleteOrders);

module.exports = router;
