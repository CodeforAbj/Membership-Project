const { users } = require("../Db");

function alreadyExists(req, res, next) {
  // To check if user already exists or not
  const username = req.body.username;
  users
    .findOne({
      username: username,
    })
    .then((value) => {
      if (value) {
        console.log("RegiCheck Console log : User already exists");

        //409 is conflict
        res.status(409).json({
          msg: "User already exists",
        });
      } else {
        console.log("AlreadyExists check passed");
        next();
      }
    });
}

function loginCheck(req, res, next) {
  //Login Authtentication

  const username = req.body.username;
  const password = req.body.password;
  users
    .findOne({
      //Checking if user exists
      username: username,
    })
    .then((value) => {
      if (value) {
        //If it finds it exists checks password
        if (value.password === password) {
          next();
        } else {
          res.status(401).json({ msg: "wrong password" });
        }
      } else {
        res.status(404).json({
          msg: "User not found",
        });
      }
    });
}

module.exports = {
  alreadyExists,
  loginCheck,
};
