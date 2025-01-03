import React, { useState } from "react";
import { Brain, Heart } from "lucide-react";
import { NavLinks } from "./NavLinks";
import styles from "./Navbar.module.css";

export default function Navbar(): JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.inner}>
          <div className={styles.logoNav}>
            <div className={styles.logoWrapper}>
              <Brain className={styles.logoBrain} />
              <Heart className={styles.logoHeart} />
            </div>
            <NavLinks />
          </div>
          <div className={styles.signInUp}>
            <div className={styles.buttons}>
              <button className={styles.signInButton}>Sign In</button>
              <button className={styles.signUpButton}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
