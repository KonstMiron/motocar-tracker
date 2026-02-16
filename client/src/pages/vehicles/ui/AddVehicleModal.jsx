import { useState } from 'react';
import s from './AddVehicleModal.module.scss';
import API_URL from '../../../config';

export const AddVehicleModal = ({ onClose, onAdded }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  const [form, setForm] = useState({
    name: '',
    plate: '',
    year: '',
    mileage: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/vehicles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          name: form.name,
          plate: form.plate,
          year: form.year ? Number(form.year) : null,
          mileage: form.mileage ? Number(form.mileage) : 0,
        }),
      });

      if (res.ok) {
        onAdded();
        onClose();
      } else {
        alert('Nie udało się dodać pojazdu');
      }
    } catch (err) {
      console.error('Add vehicle error:', err);
    }
  };

  return (
    <div className={s.backdrop}>
      <div className={s.modal}>
        <h2>Dodaj pojazd</h2>

        <form onSubmit={handleSubmit} className={s.form}>
          <label>
            Nazwa modelu *
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
            />
          </label>

          <label>
            Tablice rejestracyjne
            <input
              type="text"
              name="plate"
              value={form.plate}
              onChange={handleChange}
            />
          </label>

          <label>
            Rok produkcji
            <input
              type="number"
              name="year"
              value={form.year}
              onChange={handleChange}
            />
          </label>

          <label>
            Przebieg (km)
            <input
              type="number"
              name="mileage"
              value={form.mileage}
              onChange={handleChange}
            />
          </label>

          <div className={s.actions}>
            <button type="button" onClick={onClose} className={s.cancel}>
              Anuluj
            </button>
            <button type="submit" className={s.submit}>
              Dodaj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};