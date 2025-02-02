"use client";

import dynamic from "next/dynamic";
import styles from "./base.module.css";

// Dynamically import your component to disable SSR
const AppRouter = dynamic(() => import("./utils/AppRouter/AppRouter"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className={styles.page}>
      <AppRouter />
    </div>
  );
}
