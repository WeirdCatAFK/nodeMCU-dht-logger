import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const ScatterPlot = ({ data, selectedMetric, width = 1150, height = 200 }) => {
  const svgRef = useRef();

  useEffect(() => {
    // Parse the timestamp and sort data chronologically, filter out invalid metric values
    const parsedData = data
      .map((d) => ({
        ...d,
        timestamp: new Date(
          d.timestamp.slice(0, 4), 
          d.timestamp.slice(4, 6) - 1, 
          d.timestamp.slice(6, 8), 
          d.timestamp.slice(8, 10), 
          d.timestamp.slice(10, 12), 
          d.timestamp.slice(12, 14) 
        ),
      }))
      .filter((d) => !isNaN(d[selectedMetric]) && d[selectedMetric] != null) // Ensure the metric is a valid number
      .sort((a, b) => a.timestamp - b.timestamp);

    const margin = { top: 20, right: 150, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove(); // Clear previous renders

    // Create scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(parsedData, (d) => d.timestamp))
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([
        d3.min(parsedData, (d) => d[selectedMetric]),
        d3.max(parsedData, (d) => d[selectedMetric]),
      ])
      .nice()
      .range([innerHeight, 0]);

    // Create a group for the chart elements
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(5));

    g.append("g").call(d3.axisLeft(yScale));

    // Draw the scatterplot points
    const colorMap = {
      H_Soil: "#1f77b4",
      H_Amb: "#ff7f0e",
      T_Amb: "#2ca02c",
      V_Lumi: "#d62728",
    };

    g.selectAll(".dot")
      .data(parsedData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.timestamp))
      .attr("cy", (d) => yScale(d[selectedMetric]))
      .attr("r", 5)
      .attr("fill", colorMap[selectedMetric] || "steelblue")
      .on("mouseover", (event, d) => {
        tooltip
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 20}px`)
          .style("opacity", 1)
          .html(`Time: ${d.timestamp}<br>${selectedMetric}: ${d[selectedMetric].toFixed(2)}`);
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });

    // Tooltip
    const tooltip = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("padding", "8px")
      .style("background", "rgba(0,0,0,0.6)")
      .style("color", "white")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    // Display Units outside the graph
    const unitsMap = {
      H_Soil: "Humedad (%)",
      H_Amb: "Humedad (%)",
      T_Amb: "Temperatura (°C)",
      V_Lumi: "Lumenes (lux)",
    };

    g.append("text")
      .attr("x", innerWidth)
      .attr("y", 0)
      .attr("font-size", "14px")
      .attr("fill", "black")
      .text(`${unitsMap[selectedMetric]}`)
      .style("alignment-baseline", "middle");

  }, [data, selectedMetric, width, height]);

  return <svg ref={svgRef}></svg>;
};

export default ScatterPlot;
