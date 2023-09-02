const JWT = require("jsonwebtoken");

const HTTPError = require("../models/Error");
const User = require("../models/User");

exports.checkValidToken = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      return next(new HTTPError("No token found", 401));
    }
    let decode = JWT.verify(token, process.env.SECRET_KEY);
    if (!decode) {
      return next(new HTTPError("No token found", 401));
    }
    adminEmail = decode.email;
    res.locals.user = decode.id;
    res.locals.isAdmin = decode.isAdmin;
    return next();
  } catch (error) {
    return next(new HTTPError(error, 404));
  }
};

exports.checkAdmin = async (req, res, next) => {
  let adminUser = res.locals.isAdmin;
  if (adminUser) {
    return next();
  } else {
    return next(
      new HTTPError("Routes are strictly protected for admin access only", 404)
    );
  }
};
