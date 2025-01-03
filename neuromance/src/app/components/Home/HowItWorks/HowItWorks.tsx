import React from "react";
import { Step } from "./Step";
import styles from "./HowItWorks.module.css";

export function HowItWorks(): JSX.Element {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>How NeuRomance Works</h2>
        <div className={styles.grid}>
          <Step
            number={1}
            title="Connect Device"
            description="Sync your muse headset using bluetooth"
          />
          <Step
            number={2}
            title="Record Patterns"
            description="We analyze your unique neural responses as you interact with some stimuli"
          />
          <Step
            number={3}
            title="Match Algorithm"
            description="Our algorithm finds your compatible matches"
          />
          <Step
            number={4}
            title="Meet Your Match"
            description="Connect with your neural-compatible partners"
          />
        </div>
      </div>
    </section>
  );
}
