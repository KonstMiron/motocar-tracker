import { useEffect, useState } from 'react';
import s from './MileageBlock.module.scss';
import { AddMileageModal } from './AddMileageModal';
import API_URL from '../../../config';

export const MileageBlock = ({ vehicleId, onAdded }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const fetchEntries = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/vehicles/${vehicleId}/mileage`
      );
      const data = await res.json();
      setEntries(data);
    } catch (err) {
      console.error('Mileage fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const sorted = [...entries].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );


  useEffect(() => {
    fetchEntries();
  }, [vehicleId]);

  const handleAdded = () => {
    fetchEntries();
    if (onAdded) onAdded();
  };


  return (
    <section className={s.block}>
      <div className={s.headerRow}>
        <h2>Historia przebiegu</h2>
        <button className={s.addBtn} onClick={() => setIsAddOpen(true)}>
          Dodaj przebieg
        </button>
      </div>

      {loading ? (
        <p className={s.loading}>Ładowanie...</p>
      ) : sorted.length === 0 ? (
        <p className={s.empty}>Brak zapisów.</p>
      ) : (
        <table className={s.table}>
          <thead>
            <tr>
              <th>Data</th>
              <th>Odometr</th>
              <th>Notatka</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((e) => (
              <tr key={e._id}>
                <td>{new Date(e.date).toLocaleDateString('pl-PL')}</td>
                <td>{e.odometer} km</td>
                <td>{e.note || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isAddOpen && (
        <AddMileageModal
          vehicleId={vehicleId}
          onClose={() => setIsAddOpen(false)}
          onAdded={handleAdded}
        />
      )}
    </section>
  );
};