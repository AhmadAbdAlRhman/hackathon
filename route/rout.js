const express = require("express"),
  router = express.Router(),
  { AuthMiddleware, checkUser } = require("../middleware/Auth"),
  control = require("../controller/Auth");

router.get("*", checkUser);
router.get("/", control.getIndex);

router.get("/Home", AuthMiddleware, control.getHome);
//Login
router.get("/login", control.getLogin);

router.post("/login", control.postLogin);
//register
router.get("/Register", control.getRegister);

router.post("/Register", control.postRegister);
//profile
router.get("/Register", control.getProfile);

router.post("/Register", control.postProfile);

//logout
router.get("/logout", control.getLogout);
//restpassword
router.post("/forgot-password", control.sendToken);
router.post("/reset-password/:token", control.reSetPassword);
router.get("/resetpassword", control.getresetpassword);
module.exports = router;
