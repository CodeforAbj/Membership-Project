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
      persistent: false,
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
      persistent: false,
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
      persistent: false,
    });

    if (!CardCreationDbresponse) {
      throw new Error("In Db Card creation failed");
    }

    console.log("Card Creation Success");
    res.status(200).json({
      msg1: "User Registration success",
    });
  } catch (error) {
    console.error(" Registration Caught Error:", error);
    res.status(500).json({
      msg: "Internal Server Error",
      error: error.message,
    });
  }
});

app.post("/checkCard", loginCheck, async (req, res) => {
  const username = req.body.username;
  try {
    const fetchedCard = await cards.findOne({
      username: username,
    });

    // Since it didn't failed in login its hardly any chance that this segment can fail thus no else needed. Yet ... sigh
    if (fetchedCard) {
      res.status(200).json(fetchedCard);
    } else {
      console.log("Fetching card error: ", fetchedCard); // which will be null
      res.status(404).json({ msg: "Details Not found" });
    }
  } catch (error) {
    console.log("Error in mongoose/mongo : ", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
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

app.delete("/deleteUser/:username", async (req, res) => {
  try {
    const index = await users.findOneAndDelete({
      username: req.params.username,
    });
    const cardDRes = await cards.findOneAndDelete({
      username: req.params.username,
    });
    res.status(200).json(index);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.patch("/update", async (req, res) => {
  console.log("Update requested");
  try {
    const userDetails = await cards.findOne({ username: req.body.username });

    if (!userDetails) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the fields based on the request body
    userDetails.name = req.body.name;
    userDetails.about = req.body.about;
    userDetails.team = req.body.team;

    // Save the updated user document
    const saveResponse = await userDetails.save();

    res.status(200).json({ msg: "Update Success" });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Back End is on !! Listening to ${port}`);
});
