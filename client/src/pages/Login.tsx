import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useConfiguredAxios from '../utils/useConfiguredAxios';
import useUser from '../hooks/useUser';
import styles from './AuthForm.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const auth = async () => {
    await axios.post(`${baseUrl}auth`, { email, password })
      .then(async response => {
        if (response.status === 200) {
          navigate('/home');
        }
      })
      .catch(error => {
        if (error?.response?.status === 401)
          window.alert("Wrong email or password");
        else
          window.alert("Error occurred: " + error);
      })
  };

  const logIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const accountExists = await checkAccountExists();
    if (accountExists)
      auth();
    else
      window.alert("Wrong email or password");
  };

  const redirectToSignUp = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    navigate('/user-type');
  };

  return (
    <div className={styles.container}>
      <form onSubmit={logIn} className={styles.form}>
        <h1>Login</h1>
        <label>
          {"Email: "}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
        </label>
        <label>
          {"Password: "}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </label>
        <button type="submit" className={styles.button}>Login</button>
        <br />
        <label>Not a member?</label>
        <button onClick={e=>redirectToSignUp(e)} className={styles.button}>Sign Up</button>
      </form>
    </div>
  );
};

export default Login;