import { useEffect, useState } from 'react';
import s from './FuelBlock.module.scss';
import { AddFuelModal } from './AddFuelModal';

export const FuelBlock = ({ vehicleId }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const fetchEntries = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/vehicles/${vehicleId}/fuel`);
      const data = await res.json();
      setEntries(data);
    } catch (err) {
      console.error('Fuel fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <section className={s.block}>
      <div className={s.headerRow}>
        <h2>Tankowania</h2>
        <button className={s.addBtn} onClick={() => setIsAddOpen(true)}>
          Dodaj tankowanie
        </button>
      </div>

      {loading ? (
        <p className={s.loading}>Ładowanie...</p>
      ) : entries.length === 0 ? (
        <p className={s.empty}>Brak zapisów tankowania.</p>
      ) : (
        <table className={s.table}>
          <thead>
            <tr>
              <th>Data</th>
              <th>Odometr</th>
              <th>Ilość (l)</th>
              <th>Stacja</th>
              <th>Pełny bak</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e._id}>
                <td>{new Date(e.date).toLocaleDateString()}</td>
                <td>{e.odometer} km</td>
                <td>{e.liters}</td>
                <td>{e.station || '—'}</td>
                <td>{e.fullTank ? 'Tak' : 'Nie'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isAddOpen && (
        <AddFuelModal
          vehicleId={vehicleId}
          onClose={() => setIsAddOpen(false)}
          onAdded={fetchEntries}
        />
      )}
    </section>
  );
};