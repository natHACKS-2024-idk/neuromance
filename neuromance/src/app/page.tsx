"use client";

import dynamic from "next/dynamic";
import styles from "./page.module.css";

// Dynamically import your component to disable SSR
const AppRouter = dynamic(() => import("./utils/AppRouter/AppRouter"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <AppRouter />
      </main>
    </div>
  );
}
