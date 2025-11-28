import { useEffect, useState } from 'react';
import s from './SummaryBlock.module.scss';

export const SummaryBlock = ({ vehicleId }) => {
  const [summary, setSummary] = useState(null);

  const fetchSummary = async () => {
    const res = await fetch(`http://localhost:8080/api/vehicles/${vehicleId}/summary`);
    const data = await res.json();
    setSummary(data);
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (!summary) return <div className={s.loading}>Ładowanie...</div>;

  return (
    <section className={s.block}>
      <h2>Podsumowanie pojazdu</h2>

      <div className={s.grid}>
        <div className={s.item}>
          <span>Przebieg</span>
          <strong>{summary.totalMileage} km</strong>
        </div>

        <div className={s.item}>
          <span>Zużyte paliwo</span>
          <strong>{summary.totalFuelLiters} l</strong>
        </div>

        <div className={s.item}>
          <span>Koszt paliwa</span>
          <strong>{summary.totalFuelCost.toFixed(2)} zł</strong>
        </div>

        <div className={s.item}>
          <span>Wydatki</span>
          <strong>{summary.totalExpenses.toFixed(2)} zł</strong>
        </div>

        <div className={s.item}>
          <span>Średnie spalanie</span>
          <strong>{summary.consumption} l/100km</strong>
        </div>

        <div className={s.item}>
          <span>Koszt 1 km</span>
          <strong>{summary.costPerKm} zł</strong>
        </div>
      </div>
    </section>
  );
};