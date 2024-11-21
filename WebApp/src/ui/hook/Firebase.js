import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { debounce } from "lodash"; // Or any other debouncing library

// Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ":",
  measurementId: "",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export function useFirebaseCurrent() {
  const [previo, setPrevio] = useState({});
  const [nuevo, setNuevo] = useState({});
  const ultimoValorConocido = {
    H_Soil: null,
    H_Amb: null,
    T_Amb: null,
    V_Lumi: null,
  };

  // Debounced function to limit updates
  const updateState = debounce((full_dataset, prev_key, new_key) => {
    if (prev_key && new_key) {
      setPrevio({
        timestamp: prev_key,
        H_Amb: full_dataset[prev_key]["H_Amb"]
          ? (ultimoValorConocido.H_Amb = Object.values(
              full_dataset[prev_key]["H_Amb"]
            )[0])
          : ultimoValorConocido.H_Amb,
        T_Amb: full_dataset[prev_key]["T_Amb"]
          ? (ultimoValorConocido.T_Amb = Object.values(
              full_dataset[prev_key]["T_Amb"]
            )[0])
          : ultimoValorConocido.T_Amb,
      });

      setNuevo({
        timestamp: new_key,
        H_Amb: full_dataset[new_key]["H_Amb"]
          ? (ultimoValorConocido.H_Amb = Object.values(
              full_dataset[new_key]["H_Amb"]
            )[0])
          : ultimoValorConocido.H_Amb,
        T_Amb: full_dataset[new_key]["T_Amb"]
          ? (ultimoValorConocido.T_Amb = Object.values(
              full_dataset[new_key]["T_Amb"]
            )[0])
          : ultimoValorConocido.T_Amb,
      });
    }
  }, 200); // 200ms debounce interval

  useEffect(() => {
    const dbRef = ref(database, "/test/");
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const full_dataset = snapshot.val();

      if (!full_dataset) return;

      const numeric_keys = Object.keys(full_dataset)
        .filter((key) => /^\d+$/.test(key))
        .sort()
        .slice(-2); // Getting the last two numeric keys

      // Call debounced updateState function only when keys are found
      if (numeric_keys.length === 2) |{
        updateState(full_dataset, numeric_keys[0], numeric_keys[1]);
      }
    });

    return () => unsubscribe();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  return { previo, nuevo };
}
export function useFirebaseHistorical(limit = 500, dayless = false) {
  const [historicalData, setHistoricalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatTimestamp = (timestamp) => {
    if (!timestamp || timestamp.length !== 14 || isNaN(Number(timestamp)))
      return null;

    const year = timestamp.slice(0, 4);
    const month = timestamp.slice(4, 6);
    const day = timestamp.slice(6, 8);
    const hours = timestamp.slice(8, 10);
    const minutes = timestamp.slice(10, 12);
    const seconds = timestamp.slice(12, 14);

    return dayless
      ? `${month}/${year} ${hours}:${minutes}:${seconds}`
      : `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const getSensorValue = (sensorObject) => {
    if (!sensorObject) return null;
    const values = Object.values(sensorObject);
    return values.length > 0 && !isNaN(values[0]) ? Number(values[0]) : null;
  };

  useEffect(() => {
    const database = getDatabase();
    const dbRef = ref(database, "/test/");

    const unsubscribe = onValue(dbRef, (snapshot) => {
      const fullDataset = snapshot.val();

      if (!fullDataset) {
        setHistoricalData([]);
        setIsLoading(false);
        return;
      }

      const dataArray = Object.entries(fullDataset)
        .map(([timestamp, readings]) => {
          const formattedTime = formatTimestamp(timestamp);
          if (!formattedTime) return null;

          return {
            timestamp,
            formattedTime,
            H_Amb: getSensorValue(readings.H_Amb),
            T_Amb: getSensorValue(readings.T_Amb),
          };
        })
        .filter(
          (data) =>
            data &&
            data.formattedTime &&
            Object.values(data)
              .slice(2)
              .some((value) => value !== null)
        )
        .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
        .slice(0, limit);

      setHistoricalData(dataArray);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [limit, dayless]);

  return { historicalData, isLoading };
}
