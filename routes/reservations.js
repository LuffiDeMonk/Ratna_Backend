const router = require("express").Router();

const ReservationControllers = require("../controllers/reservations");
const { checkValidToken, checkAdmin } = require("../middleware/authMiddleware");

router.use(checkValidToken);

router.get("/", ReservationControllers.getMyReservation);
router.post("/", ReservationControllers.addNewReservation);
router.delete("/", ReservationControllers.deleteReservation);

router.use(checkAdmin);

router.get("/all", ReservationControllers.getAllReservation);
router.delete("/:reservationID", ReservationControllers.deleteReservationByID);

module.exports = router;
