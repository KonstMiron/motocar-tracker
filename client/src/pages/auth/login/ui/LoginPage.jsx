import { useState } from 'react';
import s from './LoginPage.module.scss';

export const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // тут пізніше підключимо бекенд (API /auth/login)
    console.log('login data:', form);
  };

  return (
    <main className={s.page}>
      <div className={s.card}>
        <h1>Logowanie</h1>
        <p className={s.subtitle}>Zaloguj się do MotoCar Tracker</p>

        <form onSubmit={handleSubmit} className={s.form}>
          <label className={s.field}>
            <span>Email</span>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className={s.field}>
            <span>Hasło</span>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit" className={s.submit}>
            Zaloguj się
          </button>
        </form>

        <p className={s.helper}>
          Nie masz konta? <a href="/register">Zarejestruj się</a>
        </p>
      </div>
    </main>
  );
};