import React from "react";
import { Card, Title, Button } from "@tremor/react";
import GaugeChart from "react-gauge-chart";
import { useFirebaseCurrent } from "../hook/Firebase";

const ChartGauge = () => {
  const { previo, nuevo } = useFirebaseCurrent();
  const humedad = nuevo.H_Amb || 0;

  return (
    <Card>
      <Title className="text-center">Humedad del Ambiente</Title>

      {/* Gráfico de tipo Gauge */}
      <GaugeChart
        id="humedad-gauge"
        nrOfLevels={10}
        percent={humedad / 100}
        colors={["#FF5F6D", "#00C9A7"]}
        arcWidth={0.2}
        textColor="transparent" // Hace el texto transparente
        formatTextValue={() => ""} // Elimina el texto del centro
        style={{ margin: "0 auto", maxWidth: "400px" ,maxHeight:"100px"}}
      />

      <div
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          color: "#000000",
          marginTop: "12px",
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {humedad}% Humedad
      </div>

      <Button
        text="Regar planta"
        onClick={() => alert("Planta regada!")}
        className="mt-4 bg-blue-500 text-white"
        style={{ display: "block", margin: "0 auto" }}
      />
    </Card>
  );
};

export default ChartGauge;
