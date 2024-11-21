import React from "react";
import {
  BadgeDelta,
  Block,
  Card,
  Flex,
  Metric,
  Text,
} from "@tremor/react";
import { useFirebaseCurrent } from "../hook/Firebase";
import { useFirebaseHistorical } from "../hook/Firebase.js";
import GraphCard from "../components/GraphCard.jsx";

// Utility function to generate a gradient color based on progress
const getGradientColor = (color, progress) => {
  const intensity = Math.min(1, 0.5 + progress / 100);
  return `linear-gradient(90deg, ${color} ${intensity * 100}%, ${color} ${
    intensity * 100
  }%)`;
};

// Utility function to calculate the delta and its type
const calculateDelta = (newValue, prevValue) => {
  if (prevValue == null) {
    return { delta: "0.0000%", deltaType: "moderateIncrease" };
  }
  const difference = newValue - prevValue;
  const delta = ((difference / prevValue) * 100).toFixed(3);
  return {
    delta: `${Math.abs(delta)}%`,
    deltaType: difference > 0 ? "decrease" : "increase",
  };
};

const CardGridMap = () => {
  // Fetching current and previous values from Firebase
  const { previo, nuevo } = useFirebaseCurrent();
  const { historicalData, isLoading } = useFirebaseHistorical();

  // Data configuration for each card
  const data = [
    {
      title: "Humedad Ambiente",
      metric: `${nuevo.H_Amb || 0}%`,
      prevMetric: `${previo.H_Amb || 0}%`,
      progress: nuevo.H_Amb || 0,
      target: "100%",
      ...calculateDelta(nuevo.H_Amb || 0, previo.H_Amb),
      color: "#4F46E5", // Elegant blue
      metricKey: "H_Amb",
    },
    {
      title: "Temperatura Ambiente",
      metric: `${nuevo.T_Amb || 0}°C`,
      prevMetric: `${previo.T_Amb || 0}°C`,
      progress: ((nuevo.T_Amb || 0) / 40) * 100, // Scaled 0 to 100% (max 40°C)
      target: "40°C",
      ...calculateDelta(nuevo.T_Amb || 0, previo.T_Amb),
      color: "red",
      metricKey: "T_Amb",
    },
  ];

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
    <section
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        justifyContent: "center",
        marginTop: "20px",
      }}
    >
      {data.map((item) => (
        <Card
          key={item.title}
          
        >
          {/* Card Header */}
          <Flex alignItems="items-start" justifyContent="justify-between">
            <Block>
              <Text
                style={{ fontSize: "1.2rem", fontWeight: "600", color: "#333" }} // Increase font size
              >
                {item.title}
              </Text>
              <Metric style={{ fontSize: "2rem", color: item.color }}> {/* Increase metric font size */}
                {item.metric}
              </Metric>
              <Text style={{ fontSize: "1rem", color: "#666" }}> {/* Increase previous metric font size */}
                Anterior: {item.prevMetric}
              </Text>
            </Block>
            <BadgeDelta
              text={item.delta}
              deltaType={item.deltaType}
              style={{
                fontSize: "1rem", // Adjust delta text size
                padding: "0.3rem 0.6rem",
                borderRadius: "8px",
                backgroundColor:
                  item.deltaType === "decrease" ? "#EC4899" : "#10B981",
                color: "white",
              }}
            />
          </Flex>

          <Flex
            marginTop="mt-6" // Add more space between sections
            spaceX="space-x-2"
            justifyContent="justify-between"
          >
            <Text style={{ color: "#333", fontSize: "1rem" }}>{`${item.progress.toFixed(
              1
            )}%`}</Text>
            <Text style={{ color: "#666", fontSize: "1rem" }}>{item.target}</Text>
          </Flex>
          <div
            style={{
              width: "100%",
              height: "12px", 
              borderRadius: "6px",
              backgroundColor: "#E5E7EB",
              overflow: "hidden",// Adjust margin for better spacing
            }}
          >
            <div
              style={{
                width: `${item.progress}%`,
                height: "100%",
                background: getGradientColor(item.color, item.progress),
                transition: "width 0.3s ease-in-out",
              }}
            />
          </div>

          {/* Graph section */}
          <div style={{ marginTop: "30px" }}> {/* More space before graph */}
            <GraphCard
              title={item.title}
              metric={item.metricKey}
              historicalData={historicalData}
              isLoading={isLoading}
            />
          </div>
        </Card>
      ))}

      {/* Download Button */}
      <div style={{ marginTop: "30px" }}>
        <button className="download-button" onClick={downloadCSV}>
          Download Historical Data
        </button>
      </div>
    </section>
  );
};

export default CardGridMap;
