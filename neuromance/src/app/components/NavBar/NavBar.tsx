import React from "react";
import { Brain, Heart } from "lucide-react";
import { NavLinks } from "./NavLinks";
import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

export default function Navbar(): JSX.Element {
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate("/");
  };

  const navigateToSignIn = () => {
    navigate("/register");
  };

  const navigateToSignUp = () => {
    console.log("Navigate to Sign Up");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.inner}>
          <div className={styles.logoNav}>
            <div className={styles.logoWrapper} onClick={navigateToHome}>
              <Brain className={styles.logoBrain} />
              <Heart className={styles.logoHeart} />
            </div>
            <NavLinks />
          </div>
          <div className={styles.signInUp}>
            <div className={styles.buttons}>
              <button
                className={styles.signInButton}
                onClick={navigateToSignIn}
              >
                Sign In
              </button>

              <button
                className={styles.signUpButton}
                onClick={navigateToSignUp}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
