import React from "react";
import { useEffect, useState } from "react";

function RajniJokes({ trigger }) {
  const [modifiedString, setModifiedString] = useState("");

  function randomReplace(inputString) {
    const randomValue = Math.random();
    const rajnikantProbability = 0.5;

    return inputString.replace(/Chuck(?:\s*Norris)?/g, () =>
      randomValue <= rajnikantProbability ? "Rajnikant" : "Putin"
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.chucknorris.io/jokes/random");
        const data = await response.json();
        const modified = randomReplace(data.value);
        setModifiedString(modified);
      } catch (error) {
        console.error("Error fetching joke:", error);
      }
    };

    fetchData();
  }, [trigger]);

  return <>{modifiedString}</>;
}
export default RajniJokes;
