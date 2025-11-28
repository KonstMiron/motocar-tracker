import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import s from './VehicleDetailsPage.module.scss';
import { EditVehicleModal } from './EditVehicleModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { MileageBlock } from './MileageBlock';
import { FuelBlock } from './FuelBlock';
import { ExpenseBlock } from './ExpenseBlock';

export const VehicleDetailsPage = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const fetchVehicle = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/vehicles/item/${id}`);
      const data = await res.json();
      setVehicle(data);
    } catch (err) {
      console.error('Fetch vehicle error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicle();
  }, []);

  if (loading) return <div className={s.loading}>Ładowanie...</div>;
  if (!vehicle) return <div className={s.error}>Nie znaleziono pojazdu...</div>;

  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:8080/api/vehicles/${vehicle._id}`, {
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

      <MileageBlock vehicleId={vehicle._id} />
      <FuelBlock vehicleId={vehicle._id} />
      <ExpenseBlock vehicleId={vehicle._id} />
      <div className={s.actions}>
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