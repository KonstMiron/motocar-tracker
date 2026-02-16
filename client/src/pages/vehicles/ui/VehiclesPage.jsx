import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import s from './VehiclesPage.module.scss';
import { AddVehicleModal } from './AddVehicleModal';
import API_URL from '../../../config';

export const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const fetchVehicles = async () => {
    try {
      if (!user) return;

      const res = await fetch(`${API_URL}/api/vehicles/${user.id}`);
      const data = await res.json();
      setVehicles(data);

      const reminders = [];
      data.forEach(v => {
        const lastService = v.lastServiceMileage || 0;
        if (v.mileage - lastService >= 10000) {
          reminders.push({
            id: v._id,
            name: v.name,
            diff: v.mileage - lastService
          });
        }
      });

      setNotifications(reminders);
    } catch (err) {
      console.error('Fetch vehicles error:', err);
    } finally {
      setLoading(false);
    }
  };

  const confirmService = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/vehicles/${id}/confirm-service`, {
        method: 'POST'
      });
      if (res.ok) {
        fetchVehicles();
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const exportPdf = (id) => {
    window.open(`${API_URL}/api/export/vehicle/${id}.pdf`, '_blank');
  };

  const exportCsv = (id) => {
    window.open(`${API_URL}/api/export/vehicle/${id}.csv`, '_blank');
  };

  return (
    <main className={s.page}>
      <div className={s.headerRow}>
        <h1>Moje pojazdy</h1>
        <button
          className={s.addBtn}
          onClick={() => setIsAddOpen(true)}
          type="button"
        >
          Dodaj pojazd
        </button>
      </div>

      {notifications.length > 0 && (
        <div className={s.notifications}>
          <h3>Powiadomienia</h3>
          {notifications.map((n) => (
            <div key={n.id} className={s.notificationItem}>
              <p>Pojazd {n.name}: zalecany przegląd (minęło {n.diff} km)</p>
              <button 
                onClick={() => confirmService(n.id)}
                className={s.confirmBtn}
              >
                ✅ Zrobione
              </button>
            </div>
          ))}
        </div>
      )}

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
                <button
                  className={s.exportBtn}
                  type="button"
                  onClick={() => exportPdf(v._id)}
                >
                  PDF
                </button>

                <button
                  className={s.exportBtn}
                  type="button"
                  onClick={() => exportCsv(v._id)}
                >
                  CSV
                </button>

                <button
                  className={s.secondary}
                  type="button"
                  onClick={() => navigate(`/vehicles/${v._id}`)}
                >
                  Szczegóły
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isAddOpen && (
        <AddVehicleModal
          onClose={() => setIsAddOpen(false)}
          onAdded={() => fetchVehicles()}
        />
      )}
    </main>
  );
};