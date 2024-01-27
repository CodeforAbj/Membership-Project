import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { SvgLoader } from "react-svgmt";
import config from "../config";

function UpdateCard({ switchView, userData, userDetailsSetter }) {
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const newDetails = {
        username: userData.username,
        name: document.getElementById("name").value,
        about: document.getElementById("about").value,
        team: document.getElementById("team").value,
      };

      const updateResponse = await axios.patch(
        `${config.BackendApi}/update`,
        newDetails
      );
      // if error comes it goes in catch
      // Now just to update state
      if (updateResponse.status === 200) {
        alert("Update Success");
        userDetailsSetter((prevDetails) => ({
          ...prevDetails,
          ...newDetails,
        }));
        switchView("display");
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div>
      <SvgLoader svgXML={userData.image}></SvgLoader>
      <form onSubmit={handleUpdate}>
        <div>
          <label htmlFor="usernameP">Username: </label>
          <p id="usernameP" name="username">
            {userData.username}
          </p>
        </div>

        <div>
          <label htmlFor="name">Your Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={userData.name}
          />
        </div>

        <div>
          <label htmlFor="about">About:</label>
          <textarea
            id="about"
            rows="5"
            cols="30"
            name="about"
            defaultValue={userData.about}
          />
        </div>

        <div>
          <label htmlFor="team">Select Team:</label>
          <select id="team" name="team" defaultValue={userData.team}>
            <option value="Fermions">Fermions</option>
            <option value="Magnetrons">Magnetrons</option>
            <option value="Bosons">Bosons</option>
            <option value="Neutrinos">Neutrinos</option>
          </select>
        </div>
        <button onClick={handleUpdate}>Update</button>
      </form>
      <div>
        <button onClick={() => switchView("display")}>Cancel</button>
      </div>
    </div>
  );
}

export default UpdateCard;
