import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AuthForm.module.css';

const UserType = () => {
    const navigate = useNavigate();

    const client = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        navigate('/sign-up', { state: { userType: 'client' } });
    };
    const businessOwner = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        navigate('/sign-up', { state: { userType: 'business' } });
    };
    return (
        <div className={styles.container}>
            <form className={styles.form}>
                <button onClick={client} className={styles.button2}>Client</button>
                <br/>
                <button onClick={businessOwner} className={styles.button2}>Business Owner</button>
            </form>
        </div>
    );
};

export default UserType;