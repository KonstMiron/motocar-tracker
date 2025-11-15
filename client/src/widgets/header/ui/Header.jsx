import styles from './Header.module.scss';

export const Header = () => (
  <header className={styles.header}>
    <div className={styles.logo}>
      <img src="/logo.svg" alt="MotoCar Tracker logo" />
      <span>MotoCar <b>Tracker</b></span>
    </div>

    <div className={styles.user}>
      <span>Witamy, MIRON</span>
      <button>Wyloguj</button>
    </div>
  </header>
);