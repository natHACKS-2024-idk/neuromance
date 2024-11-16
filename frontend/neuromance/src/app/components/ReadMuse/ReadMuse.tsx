import styles from "./ReadMuse.module.css";
import { MuseClient } from "muse-js";
import { useState } from "react";

export default function ReadMuse() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [client, setClient] = useState<MuseClient | null>(null);

  async function connect() {
    try {
      setIsConnecting(true);

      let client = new MuseClient();
      await client.connect();
      await client.start();

      // Subscribe to EEG readings and filter for AF7 and AF8
      client.eegReadings.subscribe((reading) => {
        const { electrode, samples, timestamp } = reading;

        // Filter for AF7 (1) and AF8 (2)
        if (electrode === 1 || electrode === 2) {
          const average = computeAverage(samples);
          console.log(`Electrode: ${electrode === 1 ? "AF7" : "AF8"}`);
          console.log("Average Value:", average);
          console.log("Timestamp:", new Date(timestamp).toISOString());
        }
      });

      setClient(client);
      setConnected(true);

      // Disconnect after 5 seconds
      setTimeout(() => {
        client.disconnect();
        setClient(null);
        setConnected(false);
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
    </div>
  );
}
