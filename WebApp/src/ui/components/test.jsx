import React from 'react';
import { useFirebaseHistorical, useFirebaseCurrent } from './../hook/Firebase.js';
function SensorDataDisplay() {
  // Use the custom hooks
  const { historicalData, isLoading: historicalLoading } = useFirebaseHistorical();
  const { currentData, isLoading: currentLoading } = useFirebaseCurrent();

  return (
    <div>
      <section>
        <h2 style={{color: 'black'}}>Historical Data</h2>
        {historicalLoading ? (
          <p>Loading historical data...</p>
        ) : (
          <ul style={{color: 'black'}}>
            {historicalData.map((entry, index) => (
              <li key={index}>
                <strong>{entry.formattedTime}</strong>
                <p>H_Soil: {entry.H_Soil}</p>
                <p>H_Amb: {entry.H_Amb}</p>
                <p>T_Amb: {entry.T_Amb}</p>
                <p>V_Lumi: {entry.V_Lumi}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default SensorDataDisplay;
