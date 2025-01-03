import React from "react";
import styles from "./NavLinks.module.css";

interface NavLinksProps {
  className?: string;
}

export function NavLinks({ className = "" }: NavLinksProps): JSX.Element {
  return (
    <div className={`${styles.navLinks} ${className}`}>
      <a href="#features" className={styles.link}>
        Features
      </a>
      <a href="#how-it-works" className={styles.link}>
        How It Works
      </a>
      <a href="#pricing" className={styles.link}>
        Pricing
      </a>
      <a href="#about" className={styles.link}>
        About
      </a>
    </div>
  );
}
