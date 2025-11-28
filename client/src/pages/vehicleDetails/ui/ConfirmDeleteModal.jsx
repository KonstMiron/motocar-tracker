
import s from './ConfirmDeleteModal.module.scss';

export const ConfirmDeleteModal = ({ onClose, onConfirm }) => {
  return (
    <div className={s.backdrop}>
      <div className={s.modal}>
        <h2>Czy na pewno chcesz usunąć?</h2>
        <p>Tego działania nie można cofnąć.</p>

        <div className={s.actions}>
          <button className={s.cancel} onClick={onClose}>
            Anuluj
          </button>

          <button className={s.delete} onClick={onConfirm}>
            Usuń
          </button>
        </div>
      </div>
    </div>
  );
};