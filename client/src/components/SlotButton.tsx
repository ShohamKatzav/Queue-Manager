import { Slot } from '../types/Schedule';
import styles from './SlotButton.module.css';

const SlotButton = ({ slot, onClick }: { slot: Slot; onClick: () => void }) => {
    return (
        <button
            type='button'
            className={`${styles.slot_button} ${!slot.available ? styles.slot_button__disabled : ''}`}
            onClick={onClick}
            disabled={!slot.available}
        >
            <span className={styles.slot_button__text}>
                {slot.start} - {slot.end}
            </span>
            <span className={styles.slot_button__overlay}></span>
        </button>
    );
};

export default SlotButton;