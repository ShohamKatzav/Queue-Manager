import { useNavigate } from 'react-router-dom';
import styles from './AuthForm.module.css';
import useUser from '../hooks/useUser';

const UserType = () => {
    const navigate = useNavigate();
    const { updateUserType } = useUser();

    const updateUserTypeAndRedirect = (e: React.MouseEvent<HTMLButtonElement>, userType: string) => {
        e.preventDefault();
        updateUserType(userType);
        navigate('/sign-up');
    };

    return (
        <div className={styles.container}>
            <form className={styles.form}>
                <button onClick={(e) => updateUserTypeAndRedirect(e, 'client')} className={styles.button2}>Client</button>
                <br />
                <button onClick={(e) => updateUserTypeAndRedirect(e, 'business')} className={styles.button2}>Business Owner</button>
            </form>
        </div>
    );
};

export default UserType;