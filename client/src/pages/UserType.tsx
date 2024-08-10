import { useNavigate } from 'react-router-dom';
import styles from './AuthForm.module.css';
import useUser from '../hooks/useUser';

const UserType = () => {
    const navigate = useNavigate();
    const { updateUserType } = useUser();

    const updateUserTypeAndRedirect = (userType: string) => {
        updateUserType(userType);
        navigate('/sign-up');
    };
    return (
        <div className={styles.container}>
            <form className={styles.form}>
                <button onClick={()=>updateUserTypeAndRedirect('client')} className={styles.button2}>Client</button>
                <br/>
                <button onClick={()=>updateUserTypeAndRedirect('business')} className={styles.button2}>Business Owner</button>
            </form>
        </div>
    );
};

export default UserType;