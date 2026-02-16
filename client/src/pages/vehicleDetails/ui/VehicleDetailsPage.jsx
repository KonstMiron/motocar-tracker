import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import s from './VehicleDetailsPage.module.scss';
import { EditVehicleModal } from './EditVehicleModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { MileageBlock } from './MileageBlock';
import { FuelBlock } from './FuelBlock';
import { ExpenseBlock } from './ExpenseBlock';
import { SummaryBlock } from './SummaryBlock';
import { MileChart } from './charts/MileChart';
import { FuelChart } from './charts/FuelChart';
import { ExpenseChart } from './charts/ExpenseChart';
import API_URL from '../../../config';

export const VehicleDetailsPage = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchVehicle = async () => {
    try {
      const res = await fetch(`${API_URL}/api/vehicles/item/${id}`);
      const data = await res.json();
      setVehicle(data);
    } catch (err) {
      console.error('Fetch vehicle error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDataChange = () => {
    fetchVehicle();
    setRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  if (loading) return <div className={s.loading}>Ładowanie...</div>;
  if (!vehicle) return <div className={s.error}>Nie znaleziono pojazdu...</div>;

  const handleDelete = async () => {
    try {
      await fetch(`${API_URL}/api/vehicles/${vehicle._id}`, {
        method: 'DELETE',
      });
      window.location.href = '/vehicles';
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <main className={s.page}>
      <h1 className={s.title}>{vehicle.name}</h1>

      <div className={s.card}>
        <div className={s.row}>
          <span className={s.label}>Tablice:</span>
          <span>{vehicle.plate || 'Brak'}</span>
        </div>
        <div className={s.row}>
          <span className={s.label}>Rok produkcji:</span>
          <span>{vehicle.year || '—'}</span>
        </div>
        <div className={s.row}>
          <span className={s.label}>Przebieg:</span>
          <span>{vehicle.mileage} km</span>
        </div>
      </div>

      <MileageBlock vehicleId={vehicle._id} onAdded={handleDataChange} />
      <FuelBlock vehicleId={vehicle._id} onAdded={handleDataChange} />
      <ExpenseBlock vehicleId={vehicle._id} onAdded={handleDataChange} />
      
      <SummaryBlock key={`summary-${refreshKey}`} vehicleId={vehicle._id} />

      <MileChart key={`mile-${refreshKey}`} vehicleId={vehicle._id} />
      <FuelChart key={`fuel-${refreshKey}`} vehicleId={vehicle._id} />
      <ExpenseChart key={`expense-${refreshKey}`} vehicleId={vehicle._id} />

      <div className={s.actions}>
        <button
          className={s.secondary}
          onClick={() => window.open(`${API_URL}/api/export/vehicle/${vehicle._id}.csv`, "_blank")}
        >
          Export CSV
        </button>

        <button
          className={s.secondary}
          onClick={() => window.open(`${API_URL}/api/export/vehicle/${vehicle._id}.pdf`, "_blank")}
        >
          Export PDF
        </button>
        <button
          className={s.secondary}
          onClick={() => setIsEditOpen(true)}
        >
          Edytuj
        </button>

        <button
          className={s.delete}
          onClick={() => setIsDeleteOpen(true)}
        >
          Usuń pojazd
        </button>
      </div>

      {isEditOpen && (
        <EditVehicleModal
          vehicle={vehicle}
          onClose={() => setIsEditOpen(false)}
          onUpdated={(updated) => setVehicle(updated)}
        />
      )}

      {isDeleteOpen && (
        <ConfirmDeleteModal
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDelete}
        />
      )}
    </main>
  );
};