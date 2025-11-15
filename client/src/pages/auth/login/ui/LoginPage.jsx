import { useState } from 'react';
import s from './LoginPage.module.scss';

export const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (res.status === 200) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        alert('Zalogowano pomyślnie!');
        console.log('LOGIN OK:', data);

        window.location.href = '/';
      } else if (res.status === 400 || res.status === 401) {
        alert(data.message || 'Nieprawidłowy email lub hasło');
      } else {
        alert('Błąd serwera');
        console.error(data);
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Błąd połączenia z serwerem');
    }
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