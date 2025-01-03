import React from "react";
import styles from "./Step.module.css";

interface StepProps {
  number: number;
  title: string;
  description: string;
}

export function Step({ number, title, description }: StepProps): JSX.Element {
  return (
    <div className={styles.step}>
      <div className={styles.number}>{number}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
