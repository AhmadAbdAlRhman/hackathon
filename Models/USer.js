const Sequelize = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcrypt");

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  age: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  weight: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  height: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  Gender: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  sports: {
    type: Sequelize.STRING,
    tags: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    },
  },
  photo_data: {
    type: Sequelize.BLOB,
    allowNull: true,
  },
});

User.login = async (username, password) => {
  await User.findOne({ where: { username: username } })
    .then((user) => {
      if (!user) {
        return res.status(400).json("There isn't like this username");
      }
      user
        .checkedPassword(password)
        .then((validPassword) => {
          if (!validPassword) {
            return res.status(400).json("Wrong password");
          } else {
            return user;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

User.checkedPassword = async (password) => {};
module.exports = User;
