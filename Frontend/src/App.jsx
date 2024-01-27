import { useEffect, useState } from "react";
import "./App.css";

// Components
import LoginCard from "./Components/LoginCard";
import RegistrationCard from "./Components/RegistrationCard";
import DisplayCard from "./Components/DisplayCard";
import UpdateCard from "./Components/UpdateCard";
import RajniJokes from "./Components/RajniJokes";

function App() {
  const [view, setView] = useState("login");
  const [userDetails, setUserDetails] = useState(null);

  const switchView = (newView) => {
    setView(newView);
  };
  return (
    <>
      <div>
        <RajniJokes trigger={view} />
      </div>
      <div id="mainContainer">
        <Card>
          {view === "login" && (
            <LoginCard
              switchView={switchView}
              userDetailsSetter={setUserDetails}
            />
          )}
          {view === "register" && <RegistrationCard switchView={switchView} />}
          {view === "display" && (
            <DisplayCard switchView={switchView} userData={userDetails} />
          )}
          {view === "update" && (
            <UpdateCard
              switchView={switchView}
              userData={userDetails}
              userDetailsSetter={setUserDetails}
            ></UpdateCard>
          )}
        </Card>
      </div>
    </>
  );
}

function Card({ children }) {
  return <div className="card">{children}</div>;
}

export default App;
