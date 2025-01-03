import React from "react";
import { Zap } from "lucide-react";
import styles from "./CTA.module.css";

export function CTA(): JSX.Element {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Ready to Find Your Neural Match?</h2>
        <p className={styles.description}>
          Join thousands of couples who have found deeper, more meaningful
          connections through NeuRomance.
        </p>
        <button className={styles.button}>
          Get Started Now
          <Zap className={styles.icon} />
        </button>
      </div>
    </section>
  );
}
