import { useState } from 'react';
import s from './EditVehicleModal.module.scss';

export const EditVehicleModal = ({ vehicle, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    name: vehicle.name,
    plate: vehicle.plate || '',
    year: vehicle.year || '',
    mileage: vehicle.mileage || '',
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
      const res = await fetch(
        `http://localhost:8080/api/vehicles/${vehicle._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: form.name,
            plate: form.plate,
            year: Number(form.year),
            mileage: Number(form.mileage),
          }),
        }
      );

      const updated = await res.json();

      onUpdated(updated);
      onClose();
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  return (
    <div className={s.backdrop}>
      <div className={s.modal}>
        <h2>Edytuj pojazd</h2>

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
              Zapisz zmiany
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};