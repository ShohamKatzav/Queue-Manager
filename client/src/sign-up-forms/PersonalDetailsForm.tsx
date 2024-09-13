import React from 'react';
import styles from './SignUpForms.module.css';

interface PersonalDetailsFormProps {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  city: string;
  setCity: React.Dispatch<React.SetStateAction<string>>;
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  phone: string;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
}

const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({
  name, setName, email, setEmail, password, setPassword,
  city, setCity, address, setAddress, phone, setPhone
}) => {

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // Only allow digits
      setPhone(value);
    }
  };

  return (
    <div className={styles.clientSignUpFormContent}>
      <label>
        Your Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={styles.input}
        />
      </label> <br />
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
        />
      </label> <br />
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />
      </label> <br />
      <label>
        Hometown:
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          className={styles.input}
        />
      </label> <br />
      <label>
        Home address:
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className={styles.input}
        />
      </label> <br />
      <label>
        Phone number:
        <input
          type="text"
          value={phone}
          onChange={handlePhoneChange}
          required
          className={styles.input}
        />
      </label>
    </div>
  );
};

export default PersonalDetailsForm;