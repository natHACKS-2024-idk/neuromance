import React from "react";
import { Brain, Heart } from "lucide-react";
import styles from "./Footer.module.css";

export function Footer(): JSX.Element {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.iconWrapper}>
          <Brain className={styles.brainIcon} />
          <Heart className={styles.heartIcon} />
        </div>
        <p className={styles.text}>© 2024 NeuRomance. All rights reserved.</p>
      </div>
    </footer>
  );
}
