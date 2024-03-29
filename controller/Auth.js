const User = require("../Models/USer");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "not ninja secret", {
    expiresIn: maxAge,
  });
};

getIndex = (req, res, next) => {
  req.status(200).json("The start page");
};

getHome = (req, res, next) => {
  req.status(200).json("The home page");
};

getLogin = (req , res ,next) => {
  req.status(200).json("The login page");
};

postLogin = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({ where: { username: username } })
    .then((user) => {
      if (!user) {
        res.redirect("/Register");
      } else {
        isValid = bcrypt.compare(password, user.password);
        if (isValid) {
          const token = createToken(user.id);
          res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
          res.redirect("/Home");
        } else {
          res.redirect("/Login");
        }
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
};

getRegister = (req, res, next) => {
  req.status(200).json("The register page");
};

postRegister = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({ where: { username: username } }).then((user) => {
    if (user) {
      res.redirect("Register");
    } else {
      const salt = 10;
      bcrypt.hash(password, salt).then((hashedPassword) => {
        const userData = {
          email: email,
          password: hashedPassword,
          salt: salt,
        };
        User.create(userData)
          .then((user) => {
            res.redirect("Profile?username");
          })
          .catch((err) => {
            console.log(err);
            res.status(400).redirect("Register");
          });
      });
    }
  });
};

getProfile = (req ,res ,next) =>{
  req.status(200).json("The profile page");
}
postProfile = (req, res, next) => {
  upload.single('photo');
  const username = req.params.username;
  const name = req.body.name;
  const age = req.body.age;
  const gander = req.body.gender;
  const weight = req.body.weight;
  const height = req.body.height;
  const sport = req.body.sport;
  const photo = req.file.buffer;
  // const
  User.findOne({ where: { username: username } }).then((user) => {
    if (user) {
      const DataUser = {
        name: name,
        age: age,
        Gender : gander,
        weight : weight, 
        height : height,
        sports : sport,
        photo : photo
      };
      user.save(DataUser);
      const token = createToken(user.id);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json("Done");
    }
    else{
      res.status(400).json("There isn't like this user to save  the data.");
    }
  });
};

sendToken = async (req, res, next) => {
  const email = req.body.email;
  const user = await User.findOne({ where: { email: email } });
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resToken = resetToken;
  user.resTokenExpiration = Date.now() + 3600000;
  //send Email with reset link
  const transporter = await nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "process.env.EMAIL",
      pass: "process.env.APP_PASSWORD",
    },
    tls: {
      rejectUnauthorized: true,
    },
  });
  const MailOptions = {
    from: "process.env.EMAIL",
    to: email,
    subject: "password reset",
    html: `click <a href="http://localhost:3000/reset-password/${resetToken}">here</a> to reset your password`,
  };
  await transporter.sendMail(MailOptions, (err, info) => {
    if (err) {
      console.log(err);
      return res.status(500).redirect("resetpassword");
    } else {
      console.log(info.response);
      return res.status(200).redirect("/");
    }
  });
};

reSetPassword = (res, req, next) => {
  const token = req.params.token;
  const password = req.body.password;

  const user = User.findOne({
    where: { resToken: token, resetTokenExpiration: { $gt: Date.now() } },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.password = bcrypt.hash(password, 10);
  user.resToken = null;
  user.resetTokenExpiration = null;

  res.status(200).json({ message: "Password reset successfully" });
};

getresetpassword = (req, res, next) => {
  res.render("resetpassword", { pageTitle: "forgetPassword" });
};

getLogout = (req, res, next) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

module.exports = {
  getIndex,

  getHome,

  getRegister,
  getLogin,

  postLogin,
  postRegister,

  getProfile,
  postProfile,

  getLogout,

  sendToken,
  reSetPassword,
  getresetpassword,
};
