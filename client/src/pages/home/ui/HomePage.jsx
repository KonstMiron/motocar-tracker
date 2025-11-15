import s from './HomePage.module.scss';

export const HomePage = () => {
  return (
    <main className={s.hero}>
      {/* діагоналі */}
      <div className={s.layerLeft} />
      <div className={s.layerRight} />

      {/* мотоцикл */}
      <figure className={s.bike} aria-hidden="true">
        <img src="/bike2.png" alt="" loading="eager" />
      </figure>

      {/* контент */}
      <div className={s.container}>
        <h1 className={s.title}>
          <span>MOTO</span> TRACKER
        </h1>

        <p className={s.subtitle}>
          Zarządzaj wydatkami pojazdu w łatwy sposób.
        </p>

        <div className={s.ctaRow}>
          <button className={s.btnPrimary}>Profil</button>
        </div>

        <nav className={s.navRow}>
          <button>Home</button>
          <button>Dodaj pojazd</button>
          <button>Moje pojazdy</button>
          <button>Wydatki</button>
        </nav>
      </div>
    </main>
  );
};