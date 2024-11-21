import React from "react";
import { Block, Col, ColGrid } from "@tremor/react";
import { useFirebaseHistorical } from "./../hook/Firebase.js";
import GraphCard from "./../components/GraphCard.jsx";
import "./GraphView.css";

function GraphView() {
  const { historicalData, isLoading } = useFirebaseHistorical();

  const downloadCSV = () => {
    if (!historicalData || historicalData.length === 0) return;

    // Convert historicalData to CSV format
    const headers = Object.keys(historicalData[0]);
    const rows = historicalData.map((row) =>
      headers.map((field) => JSON.stringify(row[field] || ""))
    );

    const csvContent = [
      headers.join(","),
      ...rows.map((e) => e.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // Create a link and trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.download = "historical_data.csv";
    link.click();
  };

  return (
    <div className="graph-view-container">
      <div className="graph-card">
        <GraphCard
          title="Humedad Ambiente"
          metric="H_Amb"
          historicalData={historicalData}
          isLoading={isLoading}
        />
        <GraphCard
          title="Humedad Ambiente"
          metric="T_Amb"
          historicalData={historicalData}
          isLoading={isLoading}
        />
        <button className="download-button" onClick={downloadCSV}>
          Download Historical Data
        </button>
      </div>
    </div>
  );
}

export default GraphView;
