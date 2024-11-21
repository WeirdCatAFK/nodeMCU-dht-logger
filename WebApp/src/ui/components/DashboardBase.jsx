import { Title, Text, TabList, Tab } from "@tremor/react";
import React, { useState, useEffect } from "react";

import MainView from "./../Views/MainView.jsx";

const DashboardBase = () => {
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main>
      {" "}
      <h1
        style={{ color: "#D3D3D3", fontFamily: "Helvetica", display: "flex" }}
      >
        Monitoreo de datos
      </h1>
      <p
        style={{ color: "#D3D3D3", fontFamily: "Helvetica", display: "flex" }}
      >{`Hora actual: ${currentTime}`}</p>
      <MainView />
    </main>
  );
};

export default DashboardBase;
