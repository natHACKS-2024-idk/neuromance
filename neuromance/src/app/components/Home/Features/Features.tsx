import { Brain, Sparkles, Users } from "lucide-react";
import { FeatureCard } from "./FeatureCard";
import styles from "./Features.module.css";

export function Features(): JSX.Element {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Why Choose NeuRomance?</h2>
        <div className={styles.grid}>
          <FeatureCard
            icon={<Brain className={styles.icon} />}
            title="Neural Matching"
            description="Our advanced algorithm analyzes brainwave patterns to find your most compatible matches."
          />
          <FeatureCard
            icon={<Sparkles className={styles.icon} />}
            title="Deeper Connections"
            description="Move beyond surface-level matching to find partners who truly resonate with you."
          />
          <FeatureCard
            icon={<Users className={styles.icon} />}
            title="Quality Matches"
            description="Connect with people who share your genuine thought patterns and emotional responses."
          />
        </div>
      </div>
    </section>
  );
}
