import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import useAxiosWithAuth from '../utils/AxiosWithToken';
import { useNavigate } from 'react-router-dom';
import User from '../types/User';
import styles from './AuthForm.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cookies, setCookie] = useCookies(['user']);
  const baseUrl = import.meta.env.VITE_BASEURL + "account/";
  const axios = useAxiosWithAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (cookies.user) {
      const logIn = async () => {
        const response = await axios.post(`${baseUrl}verify`);
        if (response.status === 200) {
          navigate('/home');
        }
      };
      logIn();
    }
  }, [cookies]);

  const checkAccountExists = async (callback: any) => {
    const response = await axios.post(`${baseUrl}is-exist`, { email });
    callback(response.data);
  };

  const logIn = async () => {
    await axios.post(`${baseUrl}auth`, { email, password })
      .then(async response => {
        if (response.status === 200) {
          const loggedUser: User = {
            email: email,
            token: response.data,
          };
          setCookie("user", loggedUser);
          navigate('/home');
        }
      })
      .catch(error => {
        if (error?.response?.status === 401)
          window.alert("Wrong email or password");
        else
          window.alert("Error occurred: " + error.response.data.message);
      });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    checkAccountExists((accountExists: boolean) => {
      if (accountExists)
        logIn();
      else
        window.alert("Wrong email or password");
    });
  };

  const signUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate('/sign-up');
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Login</h2>
        <label>
          Email: 
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
        </label>
        <label>
          Password: 
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </label>
        <button type="submit" className={styles.button}>Login</button>
        <label>Not a member?</label>
        <button onClick={signUp} className={styles.button}>Sign Up</button>
      </form>
    </div>
  );
};

export default Login;