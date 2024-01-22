import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { SvgLoader } from "react-svgmt";

function App() {
  const [view, setView] = useState("login");
  const [userDetails, setUserDetails] = useState(null);

  const switchView = (newView) => {
    setView(newView);
  };
  const setDisplay = (newData) => {
    setUserDetails(newData);
  };
  return (
    <>
      <div>
        <RajniJokes trigger={view} />
      </div>
      <div id="mainContainer">
        <Card>
          {view === "login" && (
            <LoginCard switchView={switchView} passuserData={setDisplay} />
          )}
          {view === "register" && <RegistrationCard switchView={switchView} />}
          {view === "display" && (
            <DisplayCard switchView={switchView} userData={userDetails} />
          )}
        </Card>
      </div>
    </>
  );
}

function Card({ children }) {
  return <div className="card">{children}</div>;
}

function RegistrationCard({ switchView }) {
  const [imageByBoringImage, setImageByBoringImage] = useState(
    '<svg viewBox="0 0 80 80" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" width="80" height="80"><mask id="mask__bauhaus" maskUnits="userSpaceOnUse" x="0" y="0" width="80" height="80"><rect width="80" height="80" rx="160" fill="#FFFFFF"></rect></mask><g mask="url(#mask__bauhaus)"><rect width="80" height="80" fill="#F0AB3D"></rect><rect x="10" y="30" width="80" height="10" fill="#C271B4" transform="translate(0 0) rotate(74 40 40)"></rect><circle cx="40" cy="40" fill="#C20D90" r="16" transform="translate(3 -3)"></circle><line x1="0" y1="40" x2="80" y2="40" stroke-width="2" stroke="#92A1C6" transform="translate(-8 -8) rotate(148 40 40)"></line></g></svg>'
  );

  useEffect(() => {
    const getImage = async () => {
      try {
        const imageResponse = await axios.get("http://localhost:9000/getImage");
        setImageByBoringImage(imageResponse.data);
      } catch (error) {
        console.error("Error fetching image:", error.message);
      }
    };

    getImage();
  }, []);

  const handleSubmission = async (e) => {
    e.preventDefault();

    const newFormData = {
      username: document.getElementById("Rusernamefield").value,
      password: document.getElementById("Rpasswordfield").value,
      name: document.getElementById("name").value,
      about: document.getElementById("about").value,
      team: document.getElementById("team").value,
      image: imageByBoringImage,
    };

    const submitData = async () => {
      console.log("Inside SubmitData");
      const backendapi = "http://localhost:9000/register";

      try {
        const regiResponse = await axios.post(backendapi, newFormData);
        console.log("-------------------------After Post Req-----------------");
        if (regiResponse.status === 200) {
          alert("success", regiResponse.data);
          switchView("login");
        } else {
          // Lesson learnt axios only succeed when status is 2## elseit throws error
          console.log(
            "Inside else of submit data and it will get here for 2** except 200 "
          );
          alert("Something went wrong");
        }
      } catch (error) {
        // Handle Axios error
        if (error.response && error.response.status === 409) {
          console.log("User already exists");
          alert("User already exists");
        } else {
          console.error("An unexpected error occurred:", error);
          alert("Something went wrong");
        }
      }
    };
    console.log("Before Submit Data");
    submitData();
    console.log("After SubmitData");
  };

  return (
    <>
      <SvgLoader svgXML={imageByBoringImage}></SvgLoader>
      <form onSubmit={handleSubmission}>
        <div>
          <label htmlFor="Rusernamefield">Username:</label>
          <input type="text" id="Rusernamefield" name="username" />
        </div>

        <div>
          <label htmlFor="Rpasswordfield">Password:</label>
          <input type="password" id="Rpasswordfield" name="password" />
        </div>

        <div>
          <label htmlFor="name">Your Name:</label>
          <input type="text" id="name" name="name" />
        </div>

        <div>
          <label htmlFor="about">About:</label>
          <textarea id="about" rows="5" cols="30" name="about" />
        </div>

        <div>
          <label htmlFor="team">Select Team:</label>
          <select id="team" name="team">
            <option value="Fermions">Fermions</option>
            <option value="Magnetrons">Magnetrons</option>
            <option value="Bosons">Bosons</option>
            <option value="Neutrinos">Neutrinos</option>
          </select>
        </div>
        <button type="submit" id="Rbutton">
          Register
        </button>
      </form>
      <button onClick={() => switchView("login")}>Back To Login</button>
    </>
  );
}

function LoginCard({ switchView, passuserData }) {
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
        const backendapi = "http://localhost:9000/checkCard";
        const LoginResponse = await axios.post(backendapi, loginData);

        if (LoginResponse.status === 200) {
          console.log("Login Success");
          //axios throws error for codeother than 2##
          alert("Login Success");
        }

        // Readable or IIFE (short by one line)

        // for displaying the card
        const cardToDisplay = {
          name: LoginResponse.data.name,
          about: LoginResponse.data.about,
          team: LoginResponse.data.team,
          image: LoginResponse.data.image,
        };
        passuserData(cardToDisplay); //updates the card detailsto be passed

        //Login Done switch to next pane
        switchView("display");
      } catch (LoginError) {
        if (LoginError.status === 404) {
          alert("User Not Found");
        } else if (LoginError.status === 401) {
          alert("wrong password");
        } else {
          alert("Unknown Error");
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

function DisplayCard({ switchView, userData }) {
  console.log("Reached Display Card");

  return (
    <div>
      Member Card
      <br />
      <br />
      <div>
        <SvgLoader svgXML={userData.image}></SvgLoader>
      </div>
      <div>
        <h2>{userData.name}</h2>
      </div>
      <div>
        <p>{userData.about}</p>
      </div>
      <div>
        Team : <i>{userData.team}</i>
      </div>
      <br />
      <br />
      <button onClick={() => switchView("login")}>Back To Login</button>
    </div>
  );
}

function RajniJokes({ trigger }) {
  const [modifiedString, setModifiedString] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.chucknorris.io/jokes/random");
        const data = await response.json();
        const modified = data.value.replace(/Chuck Norris/g, "Rajnikant");
        setModifiedString(modified);
      } catch (error) {
        console.error("Error fetching joke:", error);
      }
    };

    fetchData();
  }, [trigger]);

  return <>{modifiedString}</>;
}
export default App;
