const jwt = require("jsonwebtoken");
const User = require("../Models/USer");
const AuthMiddleware = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "not ninja secret", (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("Login");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect("Login");
  }
};

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "not ninja secret", async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.locals.user = null;
        next();
      } else {
        console.log(decodedToken);
        let user = await User.findByPk(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};
module.exports = { AuthMiddleware, checkUser };
