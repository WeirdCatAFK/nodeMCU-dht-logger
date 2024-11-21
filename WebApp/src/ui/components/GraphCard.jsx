import React from "react";
import { Block, Card, Title } from "@tremor/react";
import LineGraph from "../components/d3/LineGraph.jsx";

const GraphCard = ({ title, metric, historicalData, isLoading }) => (
  <Block marginTop="mt-6">
    <Card >
      <section>
        <Title className="text-center">{title}</Title>
        {isLoading ? (
          <p>Loading historical data...</p>
        ) : (
          <ul style={{ color: "black" }}>
            <LineGraph data={historicalData} selectedMetric={metric} />
          </ul>
        )}
      </section>
    </Card>
  </Block>
);

export default GraphCard;
