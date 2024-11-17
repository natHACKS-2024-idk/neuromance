import { useNavigate } from "react-router-dom";
import styles from "./ReadMuse.module.css";
import { MuseClient } from "muse-js";
import { useState } from "react";
import { useAuth } from "../AuthContext/AuthContext";

export default function ReadMuse() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [client, setClient] = useState<MuseClient | null>(null);
  const [recordings, setRecordings] = useState<
    Array<{ timestamp: number; AF7: number; AF8: number }>
  >([]);
  const [isDataReady, setIsDataReady] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/match", { state: { outputData } });
  };

  console.log(`User: ${user}`);

  // Connect to Muse device
  async function connect() {
    try {
      setIsConnecting(true);
      const museClient = new MuseClient();
      await museClient.connect();
      await museClient.start();
      setClient(museClient);
      setConnected(true);
      console.log("Connected to Muse device.");
    } catch (err) {
      console.error("Error connecting to Muse device:", err);
      setClient(null);
      setConnected(false);
    } finally {
      setIsConnecting(false);
    }
  }

  // Collect EEG data
  async function collect() {
    if (!client) {
      console.error("No client available. Connect to a Muse device first.");
      return;
    }

    try {
      const af7Readings: Array<{ timestamp: number; samples: number[] }> = [];
      const af8Readings: Array<{ timestamp: number; samples: number[] }> = [];

      if (!client.eegReadings) {
        throw new Error("eegReadings is not available on the MuseClient.");
      }

      // Subscribe to EEG readings
      client.eegReadings.subscribe((reading) => {
        const { electrode, samples, timestamp } = reading;
        if (electrode === 1) af7Readings.push({ timestamp, samples });
        if (electrode === 2) af8Readings.push({ timestamp, samples });
      });

      console.log("Collecting EEG data for 5 seconds...");
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds

      await client.disconnect();
      setClient(null);
      setConnected(false);

      const pairedReadings = pairReadings(af7Readings, af8Readings);
      setRecordings(pairedReadings);
      setIsDataReady(true);
      console.log("Data collection complete:", pairedReadings);
    } catch (err) {
      console.error("Error collecting data:", err);
    }
  }

  // Disconnect from Muse device
  async function disconnect() {
    if (client) {
      await client.disconnect();
    }
    setClient(null);
    setConnected(false);
    console.log("Disconnected from Muse device.");
  }

  // Pair AF7 and AF8 readings
  function pairReadings(
    af7Readings: Array<{ timestamp: number; samples: number[] }>,
    af8Readings: Array<{ timestamp: number; samples: number[] }>
  ) {
    const pairedReadings: Array<{
      timestamp: number;
      AF7: number;
      AF8: number;
    }> = [];

    for (let i = 0; i < Math.min(af7Readings.length, af8Readings.length); i++) {
      const af7 = af7Readings[i];
      const af8 = af8Readings[i];

      const af7Average = computeAverage(af7.samples);
      const af8Average = computeAverage(af8.samples);

      const averageTimestamp = (af7.timestamp + af8.timestamp) / 2;

      pairedReadings.push({
        timestamp: averageTimestamp,
        AF7: af7Average,
        AF8: af8Average,
      });
    }

    return pairedReadings;
  }

  // Compute the average of an array
  function computeAverage(samples: number[]): number {
    if (!samples || samples.length === 0) {
      return 0;
    }
    const sum = samples.reduce((total, value) => total + value, 0);
    return sum / samples.length;
  }

  // Include the user ID in the output data
  const outputData = {
    userId: user ? user.id : null,
    recordings,
  };

  // Function to send data to the backend endpoint
  async function saveData() {
    console.log(user?.id);
    if (user?.id) {
      try {
        const response = await fetch(
          `http://localhost:8000/api/saveBrainwaveData/${user.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(outputData),
          }
        );

        if (response.ok) {
          console.log("Brainwave data saved successfully.");
        } else {
          console.error("Error saving brainwave data.");
        }
      } catch (err) {
        console.error("Failed to save brainwave data:", err);
      }
    } else {
      console.error("User ID is missing");
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>
          Welcome, {user ? `${user.firstName} ${user.lastName}` : "Guest"}!
          Please connect your Muse device and press Play.
        </h1>
      </header>
      <main className={styles.main}>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/U8VBKOoe-iY?si=HPXYCvhOMZbs6QUn"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        ></iframe>{" "}
        <br />
        {!connected ? (
          <button
            className={styles.connectButton}
            onClick={connect}
            disabled={isConnecting}
          >
            {isConnecting ? "Connecting..." : "Connect"}
          </button>
        ) : (
          <>
            <button className={styles.connectButton} onClick={disconnect}>
              Disconnect
            </button>
            <button className={styles.collectButton} onClick={collect}>
              Collect Data
            </button>
          </>
        )}
      </main>
      <br />
      <div className={styles.recordedData}>
        <h3>Recorded Data:</h3>
        <pre>{JSON.stringify(outputData, null, 2)}</pre>
      </div>
      {isDataReady && (
        <div>
          <button onClick={saveData}>Save Data</button>
          <button onClick={handleNavigation}>Go to Match</button>
        </div>
      )}
    </div>
  );
}
