const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = 9000;

const { users, cards } = require("./Db");
const { userCreds } = require("./types");
const { alreadyExists, loginCheck } = require("./Middlewares/preCheck");

app.use(cors({ origin: "http://localhost:5173" })); //local testing
app.use(express.json());

app.post("/register", alreadyExists, async (req, res) => {
  try {
    const userPayload = {
      username: req.body.username,
      password: req.body.password,
    };
    const userDetails = {
      name: req.body.name,
      about: req.body.about,
      team: req.body.team,
      image: req.body.image,
    };
    const parsedPayload = userCreds.safeParse(userPayload);
    if (!parsedPayload) {
      console.log("failed on Password length");
      res.status(400).json({
        msg: "minimum password length must be 8",
      });
      return;
    }

    // putting it in mongo
    const UserCreationDbresponse = await users.create({
      username: userPayload.username,
      password: userPayload.password,
    });

    if (!UserCreationDbresponse) {
      throw new Error("in DB the User creation failed");
    }

    const CardCreationDbresponse = await cards.create({
      username: userPayload.username,
      name: userDetails.name,
      about: userDetails.about,
      team: userDetails.team,
      image: userDetails.image,
    });

    if (!CardCreationDbresponse) {
      throw new Error("In Db Card creation failed");
    }

    console.log("Card Creation Success");
    res.status(200).json({
      msg1: "User Creation Response from Mongo",
      update1: UserCreationDbresponse,
      msg2: "Card Creation Response from Mongo",
      update2: CardCreationDbresponse,
    });
  } catch (error) {
    console.error("Caught Error:", error);
    res.status(500).json({
      msg: "Internal Server Error",
      error: error.message,
    });
  }
});

app.post("/checkCard", loginCheck, async (req, res) => {
  const username = req.body.username;

  const gettingCard = await cards.findOne({
    username: username,
  });
  res.status(200).json(gettingCard);
});

app.get("/getImage", async (req, res) => {
  try {
    const imageResponse = await axios.get(
      "https://source.boringavatars.com/beam"
    );

    // Set CORS headers
    res.header("Access-Control-Allow-Origin", "http://localhost:5173"); // local frontend
    res.json(imageResponse.data);
  } catch (error) {
    console.error("Error fetching image:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Back End is on !! Listening to ${port}`);
});
