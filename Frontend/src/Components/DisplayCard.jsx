import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { SvgLoader } from "react-svgmt";
import config from "../config";

function DisplayCard({ switchView, userData }) {
  console.log("Reached Display Card");

  // delete button logic
  const handleDelete = async () => {
    console.log("Delete Requested !");
    try {
      const deleteResponse = await axios.delete(
        `${config.BackendApi}/deleteUser/${userData.username}`
      );
      // axios will throw error for other than success
      alert(`${deleteResponse.data.username} is deleted`);
      switchView("login");
    } catch (error) {
      console.log("Deletion error", error);
      alert("Failed to delete");
    }
  };
  return (
    <div>
      <div className="Xbutton">
        <div>Member Card</div>{" "}
        <button onClick={() => switchView("login")}>X</button>
      </div>
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
      <button onClick={() => switchView("update")}>Update Details</button>
      <button onClick={handleDelete}> Delete User </button>
    </div>
  );
}

export default DisplayCard;
