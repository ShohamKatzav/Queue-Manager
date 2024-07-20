import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import useAxiosWithAuth from '../utils/AxiosWithToken';
import { useNavigate } from 'react-router-dom';
import { User } from '../types/User';
import styles from './AuthForm.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cookies, setCookie] = useCookies(['user']);
  const baseUrl = import.meta.env.VITE_BASEURL + "account/";
  const axios = useAxiosWithAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (cookies?.user && "email" in cookies?.user && "token" in cookies?.user) {
      const logIn = async () => {
        const response = await axios.post(`${baseUrl}verify`);
        if (response.status === 200) {
          navigate('/home');
        }
      };
      logIn();
    }
  }, [cookies]);

  const checkAccountExists = async () => {
    const response = await axios.post(`${baseUrl}is-exist`, { email });
    return response.data;
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
    const accountExists = await checkAccountExists();
    if (accountExists)
      logIn();
    else
      window.alert("Wrong email or password");
  };

  const redirectToSignUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate('/user-type');
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
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
        <button onClick={redirectToSignUp} className={styles.button}>Sign Up</button>
      </form>
    </div>
  );
};

export default Login;