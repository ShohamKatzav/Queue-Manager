import BusinessScheduleCalendar from '../components/BusinessScheduleCalendar';
import styles from './AuthForm.module.css';
import useUser from '../hooks/useUser';


const BusinessSchedule = () => {

    const { user, updateUser } = useUser();

    const logOut = () => {
        updateUser(null);
    };

    return (
        <>
            <div>WELCOME HOME</div>
            <div>{user?.email}</div> <br />
            <BusinessScheduleCalendar /> <br />
            <button type='button' onClick={logOut} className={styles.button}>Log out</button> <br />
        </>
    );
};

export default BusinessSchedule;