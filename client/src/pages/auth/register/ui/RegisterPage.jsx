import { useState } from 'react';
import s from './RegisterPage.module.scss';
import API_URL from '../../../../config';

export const RegisterPage = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert('Hasła nie są takie same');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (res.status === 201) {
        alert('Konto zostało utworzone!');
        console.log('REGISTER OK:', data);
        window.location.href = '/login';
      } else if (res.status === 409) {
        alert('Użytkownik z takim emailem lub loginem już istnieje');
      } else {
        alert('Błąd serwera');
        console.error(data);
      }
    } catch (err) {
      console.error('Register error:', err);
      alert('Błąd połączenia z serwerem');
    }
  };

  return (
    <main className={s.page}>
      <div className={s.card}>
        <h1>Rejestracja</h1>
        <p className={s.subtitle}>Utwórz konto w MotoCar Tracker</p>

        <form onSubmit={handleSubmit} className={s.form}>
          <label className={s.field}>
            <span>Login / Nick</span>
            <input
              type="text"
              name="username"
              placeholder="Miron"
              value={form.username}
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