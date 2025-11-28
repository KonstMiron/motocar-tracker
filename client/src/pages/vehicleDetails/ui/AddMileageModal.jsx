import { useState } from 'react';
import s from './AddMileageModal.module.scss';

export const AddMileageModal = ({ vehicleId, onClose, onAdded }) => {
  const [form, setForm] = useState({
    odometer: '',
    date: '',
    note: '',
  });

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch(`http://localhost:8080/api/vehicles/${vehicleId}/mileage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          odometer: Number(form.odometer),
          date: form.date || undefined,
          note: form.note,
        }),
      });

      onAdded();
      onClose();
    } catch (err) {
      console.error('Mileage add error:', err);
    }
  };

  return (
    <div className={s.backdrop}>
      <div className={s.modal}>
        <h2>Dodaj przebieg</h2>

        <form onSubmit={handleSubmit} className={s.form}>
          <label>
            Odometr (km) *
            <input
              type="number"
              name="odometer"
              required
              value={form.odometer}
              onChange={handleChange}
            />
          </label>

          <label>
            Data
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
          </label>

          <label>
            Notatka
            <input
              type="text"
              name="note"
              value={form.note}
              onChange={handleChange}
            />
          </label>

          <div className={s.actions}>
            <button type="button" className={s.cancel} onClick={onClose}>
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