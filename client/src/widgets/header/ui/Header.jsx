import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import s from './Header.module.scss';

export const Header = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (!raw) {
        setUser(null);
        return;
      }
      const parsed = JSON.parse(raw);
      setUser(parsed);
    } catch (e) {
      console.error('Cannot parse user from localStorage', e);
      setUser(null);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <header className={s.header}>
      <div className={s.logo}>
        <Link to="/">
          <span className={s.logoMark}>Moto</span>
          <span className={s.logoText}>Car Tracker</span>
        </Link>
      </div>

      <nav className={s.nav}>
        <Link
          to="/"
          className={location.pathname === '/' ? s.activeLink : undefined}
        >
          Home
        </Link>
        <Link
          to="/vehicles"
          className={location.pathname === '/vehicles' ? s.activeLink : undefined}
        >
          Moje pojazdy
        </Link>
      </nav>

      <div className={s.right}>
        {user ? (
          <div className={s.userBlock}>
            <span className={s.welcome}>Witaj, {user.username}</span>
            <button type="button" onClick={handleLogout} className={s.logoutBtn}>
              Wyloguj
            </button>
          </div>
        ) : (
          <div className={s.authLinks}>
            <Link
              to="/login"
              className={location.pathname === '/login' ? s.activeLink : undefined}
            >
              Logowanie
            </Link>
            <Link
              to="/register"
              className={location.pathname === '/register' ? s.activeLink : undefined}
            >
              Rejestracja
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};