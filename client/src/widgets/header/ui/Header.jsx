import { Link } from 'react-router-dom';
import styles from './Header.module.scss';

export const Header = () => (
  <header className={styles.header}>
    <div className={styles.logo}>
      <img src="/logo.svg" alt="MotoCar Tracker logo" />
      <span>MotoCar <b>Tracker</b></span>
    </div>

    <nav className={styles.nav}>
      <Link to="/">Home</Link>
      <Link to="/login">Logowanie</Link>
      <Link to="/register">Rejestracja</Link>
    </nav>
  </header>
);