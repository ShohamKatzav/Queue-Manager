import { useNavigate } from 'react-router-dom';
import styles from './BusinessCard.module.css';
import { Business } from '../types/Business';
import defaultBusinessImage from '../assets/default-business-image.jpg';

const BusinessCard = ({
    business,
    currentPage,
    index
}: {
    business: Business,
    currentPage: number,
    index: number
}) => {
    const navigate = useNavigate();

    const onScheduleClick = (businessID: string, businessEmail: string, businessName: string) => {
        navigate('/schedule', { state: { businessID, businessEmail, businessName } });
    };

    const businessNumber = ((currentPage - 1) * Number(import.meta.env.VITE_ITEMS_PER_PAGE)) + index + 1;

    return (
        <div className={styles.business_card}>
            <div className={styles.business_card__number}>{businessNumber}</div>
            <img
                className={styles.business_card__image}
                src={business.image?.url || defaultBusinessImage}
                alt={business.name || "Business"}
            />
            <div className={styles.business_card__content}>
                <div className={styles.business_card__name}>{business.name}</div>
                <p className={styles.business_card__info}>
                    <span className={styles.business_card__label}>Email:</span> {business.email}
                </p>
                <p className={styles.business_card__info}>
                    <span className={styles.business_card__label}>Address:</span> {business.address}, {business.city}
                </p>
                <p className={styles.business_card__info}>
                    <span className={styles.business_card__label}>Phone:</span> {business.phone}
                </p>
                <button
                    onClick={() => onScheduleClick(business._id, business.email, business.name)}
                    className={styles.business_card__button}
                >
                    Schedule
                </button>
            </div>
        </div>
    );
};

export default BusinessCard;