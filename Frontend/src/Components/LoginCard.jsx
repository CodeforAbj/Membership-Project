import React from "react";
import config from "../config";
import axios from "axios";

function LoginCard({ switchView, userDetailsSetter }) {
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("inside handleLogin");
    const loginData = {
      username: document.getElementById("Lusernamefield").value,
      password: document.getElementById("Lpasswordfield").value,
    };

    const goLogin = async () => {
      try {
        console.log("Inside goLogin");
        const backendapi = `${config.BackendApi}/checkCard`;
        const LoginResponse = await axios.post(backendapi, loginData);

        if (LoginResponse.status === 200) {
          console.log("Login Success");
          //axios throws error for codeother than 2##
          alert("Login Success");
        }

        // Readable or IIFE (short by one line)

        // for displaying the card
        const cardToDisplay = {
          username: LoginResponse.data.username,
          name: LoginResponse.data.name,
          about: LoginResponse.data.about,
          team: LoginResponse.data.team,
          image: LoginResponse.data.image,
        };

        const updateUserDetails = () => {
          userDetailsSetter(cardToDisplay);
        }; //updates the card detailsto be passed
        updateUserDetails();

        //Login Done switch to next pane
        switchView("display");
      } catch (LoginError) {
        if (LoginError.response.status === 404) {
          alert("User Not Found");
        } else if (LoginError.response.status === 401) {
          alert("wrong password");
        } else {
          console.log(LoginError);
          alert("Unknown Error Loading Display");
        }
      }
    };
    goLogin();
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="Lusernamefield">Username:</label>
          <input type="text" id="Lusernamefield" />
        </div>
        <div>
          <label htmlFor="Lpasswordfield">Password:</label>
          <input type="password" id="Lpasswordfield" />
        </div>
        <div className="linearButtons">
          <button type="submit"> Login </button>
        </div>
      </form>
      <button onClick={() => switchView("register")}>Register</button>
    </div>
  );
}

export default LoginCard;
