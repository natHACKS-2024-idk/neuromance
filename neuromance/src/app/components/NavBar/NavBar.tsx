import styles from "./NavBar.module.css";

export default function NavBar() {
  return (
    <div className={styles.navbar}>
      <div className={styles.navbar__logo}>
        <h1>
          <a href="/">Neuromance</a>
        </h1>
      </div>
      <div className={styles.navbar__links}>
        <a href="/register">Register</a>
        <a href="/read-muse">Read Muse</a>
        <a href="/match">Match</a>
      </div>
    </div>
  );
}
