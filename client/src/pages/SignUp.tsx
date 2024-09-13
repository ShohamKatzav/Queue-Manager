import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useConfiguredAxios from '../utils/useConfiguredAxios';
import useUser from '../hooks/useUser';
import styles from './AuthForm.module.css';
import BusinessDetailsForm from '../sign-up-forms/BusinessDetailsForm';
import PersonalDetailsForm from '../sign-up-forms/PersonalDetailsForm';
import ImageInput from '../components/ImageInput';
import { Schedule } from '../types/Schedule';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [schedule, setSchedule] = useState<Schedule>({ appointmentLength: 0, week: [] });
  const [imageBase64, setImageBase64] = useState<string | ArrayBuffer>('');
  
  const baseUrl = import.meta.env.VITE_BASEURL + "account/";
  const axios = useConfiguredAxios();
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    if (user && user.email && user.userType) {
      const verify = async () => {
        try {
          const response = await axios.post(`${baseUrl}verify`);
          if (response.status === 200) {
            navigate('/home');
          }
        } catch (error: any) {
          if (error.response && error.response.status === 401) {
            navigate('/login');
          } else {
            console.error('An error occurred:', error);
          }
        }
      };
      verify();
    }
  }, [user]);

  const checkAccountExists = async () => {
    const response = await axios.post(`${baseUrl}is-exist`, { email });
    return response.data;
  };

  const signUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const hasEnteredScheduleHours = schedule.week.length;

    if (user?.userType === "business" && !hasEnteredScheduleHours) {
      window.alert("Please enter your availability.");
    } else {
      const accountExists = await checkAccountExists();

      if (!accountExists) {
        await createAccount();
      } else {
        window.alert("An account with this email already exists!");
      }
    }
  };

  const createAccount = async () => {
    axios.post(`${baseUrl}auth`, { name, email, password, city, address, phone, userType: user?.userType, schedule, image: imageBase64 })
      .then(response => {
        if (response.status === 201) {
          navigate('/home');
        }
      })
      .catch(error => {
        if (error?.response?.status === 401)
          window.alert("Wrong email or password");
        else
          window.alert("Error occurred: " + error.message);
      });
  };

  return (
    <div className={styles.formContent + ' ' + (user?.userType === 'business' ? styles.twoColumns : '')}>
      <h1>Sign Up</h1>
      <form onSubmit={signUp} className={styles.signUpForm}>
        {user?.userType === "business" ? (
          <BusinessDetailsForm
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            city={city}
            setCity={setCity}
            address={address}
            setAddress={setAddress}
            phone={phone}
            setPhone={setPhone}
            schedule={schedule}
            setSchedule={setSchedule}
          />
        ) : (
          <PersonalDetailsForm
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            city={city}
            setCity={setCity}
            address={address}
            setAddress={setAddress}
            phone={phone}
            setPhone={setPhone}
          />
        )}

        {user?.userType === "business" && (
          <>
            <h4>Image Upload (optional)</h4>
            <ImageInput setImageBase64={setImageBase64} />
          </>
        )}

        <br/>
        <div className={styles.signup_buttons}>
          <button type="submit" className={styles.button}>Sign up</button>
          <br />
          <label>Already a member?</label>
          <button onClick={() => navigate('/')} className={styles.button}>Back to login</button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;