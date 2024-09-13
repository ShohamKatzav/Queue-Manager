import React from 'react';
import styles from './SignUpForms.module.css';
import { Schedule } from '../types/Schedule';

const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface BusinessDetailsFormProps {
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
  schedule: Schedule;
  setSchedule: React.Dispatch<React.SetStateAction<Schedule>>;
}

const BusinessDetailsForm: React.FC<BusinessDetailsFormProps> = ({
  name, setName, email, setEmail, password, setPassword,
  city, setCity, address, setAddress, phone, setPhone, schedule, setSchedule
}) => {

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // Only allow digits
      setPhone(value);
    }
  };

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

  return (
    <div className={styles.signUpFormContent}>
      <div className={styles.leftColumn}>
        <h2>Basic details</h2>
        <label>
          Business Name:
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
          Headquarters:
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className={styles.input}
          />
        </label> <br />
        <label>
          Business address:
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

      <div className={styles.rightColumn}>
        <h2>Schedule</h2>
        <label>
          Appointment length: <br /> <br />
          <input
            type="number"
            onChange={(e) => updateAppointmentLength(Number(e.target.value))}
            min="15" max="90"
            required /> Minutes
        </label>
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
              <label className={styles.flexBox}>
                {"Starting at: "}
                <input
                  type="time"
                  disabled={!isSelected}
                  value={daySchedule.startingTime}
                  onChange={(e) => updateTime(day, 'startingTime', e.target.value)}
                  min="06:00"
                  max="23:59"
                  required
                />
                {"Ending at: "}
                <input
                  type="time"
                  disabled={!isSelected}
                  value={daySchedule.endingTime}
                  onChange={(e) => updateTime(day, 'endingTime', e.target.value)}
                  min="06:00"
                  max="23:59"
                  required
                />
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BusinessDetailsForm;