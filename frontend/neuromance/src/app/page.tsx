"use client";

import styles from "./page.module.css";
import { MuseClient, zipSamples } from "muse-js";
import { useState } from "react";

export default function Home() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [client, setClient] = useState<MuseClient | null>(null);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {!connected ? (
          <button onClick={connect}>Connect</button>
        ) : (
          <button onClick={disconnect}>Disconnect</button>
        )}
      </main>
    </div>
  );

  async function connect() {
    try {
      setIsConnecting(true);

      let client = new MuseClient();
      await client.connect();
      await client.start();

      client.eegReadings.subscribe((reading) => {
        console.log(reading);
      });

      setClient(client);
      setConnected(true);
    } catch (err) {
      console.error("connect():", err);
      setClient(null);
      setConnected(false);
    } finally {
      setIsConnecting(false);
    }
  }

  async function disconnect() {
    setClient(null);
    setConnected(false);
  }
}
