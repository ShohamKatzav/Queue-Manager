import { useNavigate } from 'react-router-dom';
import useUser from '../hooks/useUser';
import { useState } from 'react';
import styles from './AuthForm.module.css';
import SearchButton from '../components/SearchButton';

function ClientHome() {
  const { user, updateUser } = useUser();
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState('');


  const logOut = () => {
    updateUser(null);
  };

  const searchByName = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate('/businesses-name', { state: { name: businessName } });
  };

  const viewBusinesses = () => {
    navigate('/businesses-list');
  };

  const viewBusinessesByLocation = () => {
    navigate('/businesses-location');
  };

  const viewAppointments = () => {
    navigate('/appointments');
  };

  return (
    <div className={styles.container}>
      <form onSubmit={searchByName} className={styles.form}>
        <div>WELCOME HOME</div>
        <div>{user?.email}</div> <br />
        <label>
          <input
            type="text"
            placeholder="Search for a business"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
            className={styles.input}
          />
          <SearchButton />
        </label> <br />
        <button type='button' onClick={viewBusinesses} className={styles.button2}>Businesses list</button> <br />
        <button type='button' onClick={viewBusinessesByLocation} className={styles.button2}>Search by location</button> <br />
        <button type='button' onClick={viewAppointments} className={styles.button2}>My Appointments</button> <br />
        <button type='button' onClick={logOut} className={styles.button}>Log out</button> <br />
      </form>
    </div>
  )
}

export default ClientHome;