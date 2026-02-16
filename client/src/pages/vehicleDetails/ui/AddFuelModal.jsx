import { useState } from 'react';
import s from './AddFuelModal.module.scss';
import API_URL from '../../../config';

export const AddFuelModal = ({ vehicleId, onClose, onAdded }) => {
  const [form, setForm] = useState({
    odometer: '',
    date: '',
    liters: '',
    pricePerLiter: '',
    totalCost: '',
    station: '',
    fullTank: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({
      ...p,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch(`${API_URL}/api/vehicles/${vehicleId}/fuel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          odometer: Number(form.odometer),
          date: form.date || undefined,
          liters: Number(form.liters),
          pricePerLiter: form.pricePerLiter ? Number(form.pricePerLiter) : null,
          totalCost: form.totalCost ? Number(form.totalCost) : null,
          station: form.station,
          fullTank: form.fullTank,
        }),
      });

      onAdded();
      onClose();
    } catch (err) {
      console.error('Fuel add error:', err);
    }
  };

  return (
    <div className={s.backdrop}>
      <div className={s.modal}>
        <h2>Dodaj tankowanie</h2>

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
            Ilość paliwa (l) *
            <input
              type="number"
              step="0.01"
              name="liters"
              required
              value={form.liters}
              onChange={handleChange}
            />
          </label>

          <label>
            Cena za litr
            <input
              type="number"
              step="0.01"
              name="pricePerLiter"
              value={form.pricePerLiter}
              onChange={handleChange}
            />
          </label>

          <label>
            Koszt całkowity
            <input
              type="number"
              step="0.01"
              name="totalCost"
              value={form.totalCost}
              onChange={handleChange}
            />
          </label>

          <label>
            Stacja
            <input
              type="text"
              name="station"
              value={form.station}
              onChange={handleChange}
            />
          </label>

          <label className={s.checkboxRow}>
            <input
              type="checkbox"
              name="fullTank"
              checked={form.fullTank}
              onChange={handleChange}
            />
            Pełny bak
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