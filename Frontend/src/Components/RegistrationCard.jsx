import React from "react";
import { useEffect, useState } from "react";
// Imp libs
import axios from "axios";
import { SvgLoader } from "react-svgmt";
import config from "../config";

function RegistrationCard({ switchView }) {
  const [imageByBoringImage, setImageByBoringImage] = useState(
    '<svg viewBox="0 0 80 80" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" width="80" height="80"><mask id="mask__bauhaus" maskUnits="userSpaceOnUse" x="0" y="0" width="80" height="80"><rect width="80" height="80" rx="160" fill="#FFFFFF"></rect></mask><g mask="url(#mask__bauhaus)"><rect width="80" height="80" fill="#F0AB3D"></rect><rect x="10" y="30" width="80" height="10" fill="#C271B4" transform="translate(0 0) rotate(74 40 40)"></rect><circle cx="40" cy="40" fill="#C20D90" r="16" transform="translate(3 -3)"></circle><line x1="0" y1="40" x2="80" y2="40" stroke-width="2" stroke="#92A1C6" transform="translate(-8 -8) rotate(148 40 40)"></line></g></svg>'
  );

  useEffect(() => {
    const getImage = async () => {
      try {
        const imageResponse = await axios.get(`${config.BackendApi}/getImage`);
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
      const backendapi = `${config.BackendApi}/register`;

      try {
        const regiResponse = await axios.post(backendapi, newFormData);
        if (regiResponse.status === 200) {
          alert("Registration Success");
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
    submitData();
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

export default RegistrationCard;
