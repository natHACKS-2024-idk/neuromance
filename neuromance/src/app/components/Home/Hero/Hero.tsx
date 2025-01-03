import { Brain, Heart, ArrowRight } from "lucide-react";
import styles from "./Hero.module.css";

export function Hero(): JSX.Element {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.textCenter}>
          <div className={styles.iconWrapper}>
            <Brain className={styles.brainIcon} />
            <Heart className={styles.heartIcon} />
          </div>
          <h1 className={styles.title}>NeuRomance</h1>
          <p className={styles.subtitle}>Where Brainwaves Lead to Love</p>
          <p className={styles.description}>
            Experience dating evolved. Our revolutionary technology matches you
            based on neural compatibility, creating deeper, more meaningful
            connections.
          </p>
          <button className={styles.ctaButton}>
            Find Your Neural Match
            <ArrowRight className={styles.arrowIcon} />
          </button>
        </div>
      </div>
    </header>
  );
}
