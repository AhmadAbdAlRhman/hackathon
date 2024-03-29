const express = require('express');
const sequelize = require("./config/database");
const user  = require('./Models/USer');
const session = require("express-session");
const path = require("path");
const cookieParser = require("cookie-parser");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const bodyParser = require("body-parser");
const rout = require("./route/rout");
const app = express();
require("dotenv").config();
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(express.json()); //it takes any json data that cones along with a request is passes it into a javascript object for us so then we can use it
app.use(bodyParser.urlencoded({ extended: true })); //body-parser is a middleware in Express designed to handle and parse data sent in the body of HTTP requests.
app.use(rout);
app.use(
  session({
    secret: "some secret",
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
      db: sequelize,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
const port = process.env.PORT;
sequelize.sync()
.then(()=>{
app.listen(2020, (req, res) => {
  console.log(`http://localhost:port`);
});
}).catch((err)=>{
    console.log(err);
})
