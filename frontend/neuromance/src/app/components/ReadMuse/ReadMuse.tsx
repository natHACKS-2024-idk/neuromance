import styles from "./ReadMuse.module.css";
import { MuseClient } from "muse-js";
import { useState } from "react";

export default function ReadMuse() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [client, setClient] = useState<MuseClient | null>(null);
  const [recordings, setRecordings] = useState<
    Array<{ timestamp: number; AF7: number; AF8: number }>
  >([]);

  async function connect() {
    try {
      setIsConnecting(true);
      let client = new MuseClient();
      await client.connect();
      await client.start();

      const af7Readings: Array<{ timestamp: number; samples: number[] }> = [];
      const af8Readings: Array<{ timestamp: number; samples: number[] }> = [];

      // Subscribe to EEG readings and filter for AF7 and AF8
      client.eegReadings.subscribe((reading) => {
        const { electrode, samples, timestamp } = reading;

        // Collect readings for AF7 (1) and AF8 (2)
        if (electrode === 1) {
          af7Readings.push({ timestamp, samples });
        } else if (electrode === 2) {
          af8Readings.push({ timestamp, samples });
        }
      });

      setClient(client);
      setConnected(true);

      // Disconnect after 5 seconds
      setTimeout(() => {
        client.disconnect();
        setClient(null);
        setConnected(false);

        // After 5 seconds, pair readings from AF7 and AF8 and compute the desired dictionary
        const pairedReadings = pairReadings(af7Readings, af8Readings);
        setRecordings(pairedReadings);
        console.log(pairedReadings);
      }, 5000);
    } catch (err) {
      console.error("connect():", err);
      setClient(null);
      setConnected(false);
    } finally {
      setIsConnecting(false);
    }
  }

  async function disconnect() {
    if (client) {
      await client.disconnect();
    }
    setClient(null);
    setConnected(false);
  }

  // Pair the readings and compute the required dictionary
  function pairReadings(
    af7Readings: Array<{ timestamp: number; samples: number[] }>,
    af8Readings: Array<{ timestamp: number; samples: number[] }>
  ) {
    const pairedReadings: Array<{
      timestamp: number;
      AF7: number;
      AF8: number;
    }> = [];

    // Iterate through both AF7 and AF8 readings, assuming they are in sync
    for (let i = 0; i < Math.min(af7Readings.length, af8Readings.length); i++) {
      const af7 = af7Readings[i];
      const af8 = af8Readings[i];

      // Compute the average of AF7 and AF8 samples
      const af7Average = computeAverage(af7.samples);
      const af8Average = computeAverage(af8.samples);

      // Compute the average timestamp
      const averageTimestamp = (af7.timestamp + af8.timestamp) / 2;

      // Store the paired data
      pairedReadings.push({
        timestamp: averageTimestamp,
        AF7: af7Average,
        AF8: af8Average,
      });
    }

    return pairedReadings;
  }

  // Function to compute the average of a given set of samples
  function computeAverage(samples: number[]): number {
    if (!samples || samples.length === 0) {
      return 0; // Handle empty or invalid samples
    }
    const sum = samples.reduce((total, value) => total + value, 0);
    return sum / samples.length; // Calculate and return the average
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {!connected ? (
          <button onClick={connect} disabled={isConnecting}>
            {isConnecting ? "Connecting..." : "Connect"}
          </button>
        ) : (
          <button onClick={disconnect}>Disconnect</button>
        )}
      </main>
      <div>
        {/* Display the paired readings for AF7 and AF8 */}
        <h3>Recorded Data:</h3>
        <pre>{JSON.stringify(recordings, null, 2)}</pre>
      </div>
    </div>
  );
}
