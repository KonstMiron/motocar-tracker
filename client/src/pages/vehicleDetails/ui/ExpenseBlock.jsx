import { useEffect, useState } from 'react';
import s from './ExpenseBlock.module.scss';
import { AddExpenseModal } from './AddExpenseModal';

const categoryLabel = (cat) => {
  switch (cat) {
    case 'serwis':
      return 'Serwis';
    case 'opony':
      return 'Opony';
    case 'ubezpieczenie':
      return 'Ubezpieczenie';
    case 'paliwo':
      return 'Paliwo';
    default:
      return 'Inne';
  }
};

export const ExpenseBlock = ({ vehicleId }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const fetchEntries = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/vehicles/${vehicleId}/expenses`
      );
      const data = await res.json();
      setEntries(data);
    } catch (err) {
      console.error('Expenses fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const sorted = [...entries].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const total = sorted.reduce((sum, e) => sum + (e.amount || 0), 0);

  return (
    <section className={s.block}>
      <div className={s.headerRow}>
        <h2>Wydatki</h2>
        <div className={s.headerRight}>
          <span className={s.total}>Suma: {total.toFixed(2)} zł</span>
          <button className={s.addBtn} onClick={() => setIsAddOpen(true)}>
            Dodaj wydatek
          </button>
        </div>
      </div>

      {loading ? (
        <p className={s.loading}>Ładowanie...</p>
      ) : sorted.length === 0 ? (
        <p className={s.empty}>Brak zapisów wydatków.</p>
      ) : (
        <table className={s.table}>
          <thead>
            <tr>
              <th>Data</th>
              <th>Kategoria</th>
              <th>Kwota</th>
              <th>Opis</th>
              <th>Miejsce</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((e) => (
              <tr key={e._id}>
                <td>{new Date(e.date).toLocaleDateString('pl-PL')}</td>
                <td>{categoryLabel(e.category)}</td>
                <td>{e.amount.toFixed(2)} zł</td>
                <td>{e.description || '—'}</td>
                <td>{e.place || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isAddOpen && (
        <AddExpenseModal
          vehicleId={vehicleId}
          onClose={() => setIsAddOpen(false)}
          onAdded={fetchEntries}
        />
      )}
    </section>
  );
};