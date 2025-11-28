import s from './VehiclesPage.module.scss';

const mockVehicles = [
  {
    id: '1',
    name: 'Yamaha MT-07',
    plate: 'LU 12345',
    year: 2020,
    mileage: 18500,
  },
  {
    id: '2',
    name: 'Kawasaki Z900',
    plate: 'LU 98765',
    year: 2019,
    mileage: 23200,
  },
];

export const VehiclesPage = () => {
  return (
    <main className={s.page}>
      <div className={s.headerRow}>
        <h1>Moje pojazdy</h1>
        <button className={s.addBtn}>Dodaj pojazd</button>
      </div>

      {mockVehicles.length === 0 ? (
        <p className={s.empty}>Nie masz jeszcze żadnych pojazdów.</p>
      ) : (
        <ul className={s.list}>
          {mockVehicles.map((v) => (
            <li key={v.id} className={s.item}>
              <div className={s.main}>
                <h2>{v.name}</h2>
                <p className={s.meta}>
                  {v.plate} • {v.year} • {v.mileage} km
                </p>
              </div>
              <div className={s.actions}>
                <button className={s.secondary}>Szczegóły</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};