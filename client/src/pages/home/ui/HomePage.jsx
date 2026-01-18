import s from './HomePage.module.scss';

export const HomePage = () => {
  return (
    <main className={s.hero}>
      <div className={s.layerLeft} />
      <div className={s.layerRight} />

      <figure className={s.bike} aria-hidden="true">
        <img src="/bike2.png" alt="" loading="eager" />
      </figure>

      <div className={s.container}>
        <h1 className={s.title}>
          <span>MOTO</span> TRACKER
        </h1>

        <p className={s.subtitle}>
          Zarządzaj wydatkami pojazdu w łatwy sposób
        </p>

       
      </div>
    </main>
  );
};