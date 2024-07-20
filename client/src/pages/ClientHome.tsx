import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import styles from './AuthForm.module.css';

function ClientHome() {
  const [cookies, removeCookie] = useCookies(['user']);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    removeCookie("user", {});
    navigate('/');
  };

  const viewBusinesses = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate('/businesses-list');
  };

  const viewAppointments = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate('/appointments');
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>WELCOME HOME</div>
        <div>{cookies?.user?.email}</div>
        <button onClick={viewBusinesses} className={styles.button2}>Businesses list</button> <br />
        <button className={styles.button2}>Search by location</button> <br />
        <button onClick={viewAppointments} className={styles.button2}>My Appointments</button> <br />
        <button type="submit" className={styles.button}>Log out</button>
      </form>
    </div>
  )
}

export default ClientHome;