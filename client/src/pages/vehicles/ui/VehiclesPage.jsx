import { useEffect, useState } from 'react';
import s from './VehiclesPage.module.scss';
import { AddVehicleModal } from './AddVehicleModal';

export const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const fetchVehicles = async () => {
    if (!user) return;

    try {
      const res = await fetch(`http://localhost:8080/api/vehicles/${user.id}`);
      const data = await res.json();
      setVehicles(data);
    } catch (err) {
      console.error('Fetch vehicles error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <main className={s.page}>
      <div className={s.headerRow}>
        <h1>Moje pojazdy</h1>

        <button className={s.addBtn} onClick={() => setIsModalOpen(true)}>
          Dodaj pojazd
        </button>
      </div>

      {loading ? (
        <p className={s.empty}>Ładowanie...</p>
      ) : vehicles.length === 0 ? (
        <p className={s.empty}>Nie masz jeszcze żadnych pojazdów.</p>
      ) : (
        <ul className={s.list}>
          {vehicles.map((v) => (
            <li key={v._id} className={s.item}>
              <div className={s.main}>
                <h2>{v.name}</h2>
                <p className={s.meta}>
                  {v.plate || 'Brak tablic'} • {v.year || 'Rok?'} • {v.mileage} km
                </p>
              </div>

              <div className={s.actions}>
                <button className={s.secondary}>Szczegóły</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isModalOpen && (
        <AddVehicleModal
          onClose={() => setIsModalOpen(false)}
          onAdded={fetchVehicles}
        />
      )}
    </main>
  );
};