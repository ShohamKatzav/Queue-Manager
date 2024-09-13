import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Calendar.module.css';
import useConfiguredAxios from '../utils/useConfiguredAxios';
import useUser from '../hooks/useUser';

const BusinessScheduleCalendar = () => {
  const baseUrl = import.meta.env.VITE_BASEURL + "appointment/";
  const axios = useConfiguredAxios();
  const { user } = useUser();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduled, setScheduled] = useState<boolean[]>([]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigate = useNavigate();

  useEffect(() => {
    markScheduledDays();
  }, [currentDate]);

  const markScheduledDays = async () => {
    try {
      const response = await axios.get<boolean[]>(`${baseUrl}get-shceduled-days-in-month`, {
        params: {
          userEmail: user?.email,
          year: currentDate?.getFullYear(),
          month: currentDate.getMonth()
        }
      });
      setScheduled(response.data);

    } catch (err: any) {
      console.log('Error getting appointments count:', err);
    }
  };

  const changeMonth = (increment: number) => {
    setScheduled([]);
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
  };

  const daySelected = (day: number) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    navigate('/appointments', { state: { date: selectedDate } });
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button onClick={() => changeMonth(-1)}>Prev</button>
        <div className={styles.headersFlex}>
          <h2>{currentDate.toLocaleString('default', { month: 'long' })}</h2>
          <h2>{currentDate.toLocaleString('default', { year: 'numeric' })}</h2>
        </div>
        <button onClick={() => changeMonth(1)}>Next</button>
      </div>
      <div className={styles.weekdays}>
        {weekdays.map(day => <div key={day}>{day}</div>)}
      </div>
      <div className={styles.days}>
        {Array(firstDayOfMonth).fill(null).map((_, index) => (
          <div key={`empty-${index}`} className={styles.empty}></div>
        ))}
        {days.map(day => (
          <div
            onClick={() => daySelected(day)}
            key={day}
            className={`${styles.day} ${scheduled[day - 1] ? styles.scheduled_day : ''}`}>
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessScheduleCalendar;