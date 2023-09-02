const Reservation = require("../models/Reservation");
const HTTPError = require("../models/Error");

exports.addNewReservation = async (req, res, next) => {
  let userID = res.locals.user;
  let { date, seats, event } = req.body;

  let existingUser;

  try {
    existingUser = await Reservation.findOne({ user: userID });
  } catch (error) {
    return next(new HTTPError(error.message, 422));
  }

  if (existingUser) {
    return next(new HTTPError("Reservation is already done by the user", 401));
  }

  let createReservation = new Reservation({
    user: userID,
    date,
    seats,
    event,
  });

  try {
    await createReservation.save();
    return res
      .status(201)
      .json({ message: "Reservation created successfully" });
  } catch (error) {
    return next(
      new HTTPError(
        "An error occured while creating reservation, please try again later",
        422
      )
    );
  }
};

exports.getMyReservation = async (req, res, next) => {
  let userID = res.locals.user;
  let userReservation;
  try {
    userReservation = await Reservation.findOne({ user: userID }, "-user");
  } catch (error) {
    return next(new HTTPError(error.message, 422));
  }
  if (!userReservation) {
    return next(new HTTPError("No reservation found", 404));
  }
  return res.status(200).json({ userReservation });
};

exports.deleteReservation = async (req, res, next) => {
  let userID = res.locals.user;

  try {
    await Reservation.deleteOne({ user: userID });
    res.status(201).json({ message: "Reservation deleted successfully" });
  } catch (error) {
    return next(
      new HTTPError(
        "Error occured while deleting the reservation, please try again",
        422
      )
    );
  }
};

exports.getAllReservation = async (req, res, next) => {
  let reservations;
  try {
    reservations = await Reservation.find({}).populate("user", [
      "name",
      "email",
    ]);
  } catch (error) {
    return next(new HTTPError("Error occured while getting reservation", 422));
  }

  if (!reservations) {
    return next(new HTTPError("No reservation registed by the user", 401));
  }
};

exports.deleteReservationByID = async (req, res, next) => {
  let { reservationID } = req.params;
  try {
    await Reservation.findByIdAndDelete(reservationID);
    return res
      .status(200)
      .json({ message: "Reservation deleted successfully" });
  } catch (error) {
    return next(new HTTPError("Error occured while deleting reservation", 422));
  }
};
