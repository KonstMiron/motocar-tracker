import { useState } from 'react';
import s from './AddExpenseModal.module.scss';

export const AddExpenseModal = ({ vehicleId, onClose, onAdded }) => {
  const [form, setForm] = useState({
    amount: '',
    date: '',
    category: 'inne',
    description: '',
    place: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch(`http://localhost:8080/api/vehicles/${vehicleId}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(form.amount),
          date: form.date || undefined,
          category: form.category,
          description: form.description,
          place: form.place,
        }),
      });

      onAdded();
      onClose();
    } catch (err) {
      console.error('Expense add error:', err);
    }
  };

  return (
    <div className={s.backdrop}>
      <div className={s.modal}>
        <h2>Dodaj wydatek</h2>

        <form onSubmit={handleSubmit} className={s.form}>
          <label>
            Kwota (zł) *
            <input
              type="number"
              step="0.01"
              name="amount"
              required
              value={form.amount}
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
            Kategoria
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="serwis">Serwis</option>
              <option value="opony">Opony</option>
              <option value="ubezpieczenie">Ubezpieczenie</option>
              <option value="paliwo">Paliwo</option>
              <option value="inne">Inne</option>
            </select>
          </label>

          <label>
            Opis
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </label>

          <label>
            Miejsce
            <input
              type="text"
              name="place"
              value={form.place}
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