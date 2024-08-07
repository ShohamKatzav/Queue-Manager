import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import useAxiosWithAuth from '../utils/AxiosWithToken';
import { useNavigate, useLocation } from 'react-router-dom';
import { User } from '../types/User';
import styles from './AuthForm.module.css';

interface WorkingDay {
  day: string;
  startingTime: string;
  endingTime: string;
}

interface Schedule {
  appointmentLength: number;
  week: WorkingDay[];
}

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [cookies, setCookie] = useCookies(['user']);
  const baseUrl = import.meta.env.VITE_BASEURL + "account/";
  const axios = useAxiosWithAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { userType } = location.state || {};
  const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const [schedule, setSchedule] = useState<Schedule>({ appointmentLength: 0, week: [] });

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

  const handleSelectedDaysChange = (day: string, startingTime: string, endingTime: string) => {
    setSchedule((prevSchedule) => {
      const dayExists = prevSchedule.week.find((d) => d.day === day);

      if (dayExists) {
        return {
          appointmentLength: prevSchedule.appointmentLength,
          week: prevSchedule.week.filter((d) => d.day !== day),
        };
      } else {
        return {
          appointmentLength: prevSchedule.appointmentLength,
          week: [...prevSchedule.week, { day, startingTime, endingTime }],
        };
      }
    });
  };

  const updateTime = (day: string, field: 'startingTime' | 'endingTime', time: string) => {
    setSchedule((prevSchedule) => ({
      appointmentLength: prevSchedule.appointmentLength,
      week: prevSchedule.week.map((d) =>
        d.day === day ? { ...d, [field]: time } : d
      ),
    }));
  };

  const updateAppointmentLength = (appointmentLength: number) => {
    setSchedule((prevSchedule) => ({
      appointmentLength: appointmentLength,
      week: prevSchedule.week
    }));
  };

  const checkAccountExists = async () => {
    const response = await axios.post(`${baseUrl}is-exist`, { email });
    return response.data;
  };

  const logIn = () => {
    axios.post(`${baseUrl}auth`, { name, email, password, city, address, userType, schedule })
      .then(async response => {
        if (response.status === 201) {
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
          window.alert("Error occurred: " + error);
      });
  };

  const redirectToLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate('/');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const accountExists = await checkAccountExists();
    if (!accountExists)
      logIn();
    else
      window.alert("Wrong email or password");
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1>Sign Up</h1>
        <label>
          {"Your Name: "}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={styles.input}
          />
        </label>
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
        <label>
          {userType == "business" ? "Headquarters: " : "Hometown: "}
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className={styles.input}
          />
        </label>
        <label>
          {userType == "business" ? "Business address: " : "Home address: "}
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className={styles.input}
          />
        </label>
        {userType === "business" && (
          <>
            <h2>Schedule</h2>
            <label>
              Appointment length: <br />
              <input type="number" onChange={(e) => updateAppointmentLength(Number(e.target.value))} min="10" max="90" /> Minutes
            </label>
            <br />
            {weekDays.map((day) => {
              const isSelected = schedule.week.some((d) => d.day === day);
              const daySchedule = schedule.week.find((d) => d.day === day) || { startingTime: '', endingTime: '' };
              return (
                <div key={day}>
                  <label>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectedDaysChange(day, daySchedule.startingTime, daySchedule.endingTime)}
                    />
                    {day}
                  </label>
                  <br />
                  <label>
                    {"Starting at: "}
                    <input
                      type="time"
                      disabled={!isSelected}
                      value={daySchedule.startingTime}
                      onChange={(e) => updateTime(day, 'startingTime', e.target.value)}
                      min="08:00"
                      max="18:00"
                      required
                    />
                    {" Ending at: "}
                    <input
                      type="time"
                      disabled={!isSelected}
                      value={daySchedule.endingTime}
                      onChange={(e) => updateTime(day, 'endingTime', e.target.value)}
                      min="08:00"
                      max="18:00"
                      required
                    />
                  </label>
                </div>
              );
            })}
          </>
        )}
        <br />
        <button type="submit" className={styles.button}>Sign up</button>
        <br />
        <label>Already a member?</label>
        <button onClick={redirectToLogin} className={styles.button}>Back to login</button>
      </form>
    </div>
  );
};

export default SignUp;