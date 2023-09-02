const router = require("express").Router();
const { check } = require("express-validator");

const userControllers = require("../controllers/users");
const { checkValidToken, checkAdmin } = require("../middleware/authMiddleware");

//adding new user to the database
router.post(
  "/register",
  [
    check("name").notEmpty().isLength({ max: 20 }),
    check("email").notEmpty().isEmail(),
    check("password").notEmpty().isLength({ min: 8 }),
  ],
  userControllers.addNewUser
);

//login user
router.post(
  "/login",
  [
    check("email").notEmpty().isEmail(),
    check("password").notEmpty().isLength({ min: 8 }),
  ],
  userControllers.loginUser
);

//restrict the routes below it to admin only
router.use(checkValidToken, checkAdmin);

//edit user information
router.patch(
  "/",
  [
    check("name").notEmpty().isLength({ max: 20 }),
    check("email").notEmpty().isEmail(),
  ],
  userControllers.updateUser
);

//delete specific user
router.delete("/", userControllers.deleteUser);

//get all users
router.get("/", userControllers.getAllUsers);

module.exports = router;
