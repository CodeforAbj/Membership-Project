const mongoose = require("mongoose");
const config = require("./config");
mongoose.connect(config.mongoURL);
const userSchema = mongoose.Schema({
  username: String,
  password: String,
  persistent: Boolean,
});
const cardSchema = mongoose.Schema({
  username: String,
  name: String,
  about: String,
  team: String,
  image: String,
  persistent: Boolean,
});
const users = mongoose.model("users", userSchema);
const cards = mongoose.model("cards", cardSchema);
module.exports = {
  users,
  cards,
};
