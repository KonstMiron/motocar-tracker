import { useState } from 'react';
import s from './RegisterPage.module.scss';

export const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert('Hasła nie są takie same');
      return;
    }

    // тут потім підключимо /auth/register
    console.log('register data:', form);
  };

  return (
    <main className={s.page}>
      <div className={s.card}>
        <h1>Rejestracja</h1>
        <p className={s.subtitle}>Utwórz konto w MotoCar Tracker</p>

        <form onSubmit={handleSubmit} className={s.form}>
          <label className={s.field}>
            <span>Imię / Nick</span>
            <input
              type="text"
              name="name"
              placeholder="Miron"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

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

          <label className={s.field}>
            <span>Powtórz hasło</span>
            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit" className={s.submit}>
            Zarejestruj się
          </button>
        </form>

        <p className={s.helper}>
          Masz już konto? <a href="/login">Zaloguj się</a>
        </p>
      </div>
    </main>
  );
};