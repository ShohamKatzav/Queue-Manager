import { useEffect, useState } from 'react';
import { Day, Slot } from '../types/Schedule';
import { combineDateTime, transformDateAndDayString, transformShortDateString } from '../utils/transformDate';
import styles from './Schedule.module.css';

const Schedule = ({ schedule, currentEditing, handleSlotClick }:
  {
    schedule: Day[],
    currentEditing?: string,
    handleSlotClick?: (slot: Slot, date: Date) => void
  }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (schedule) {
      setLoading(false);
    }
  }, [schedule]);



  const renderTimeSlots = (slots: Slot[], day: Day) => {
    return (
      <div className={styles.time_slots}>
        {slots.map((slot) => {
          const combinedDateTime = combineDateTime(day.date, slot.start);
          const isEditing = currentEditing && slot._id === currentEditing;

          return handleSlotClick ? (
            <button
              key={slot._id}
              value={slot._id}
              className={`${styles.time_slot} ${slot.available ? styles.available : styles.booked} ${isEditing ? styles.editing : ''} ${styles.rect_button}`}
              disabled={!slot.available}
              onClick={() => handleSlotClick!(slot, combinedDateTime)}
            >
              {slot.start} - {slot.end}
            </button>
          ) : (
            <div
              key={slot._id}
              className={`${styles.time_slot} ${slot.available ? styles.available : styles.booked}`}
            >
              {slot.start} - {slot.end}
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return <h1>Loading...</h1>;

  } else if (schedule) {
    return (
      <div className={styles.business_schedule}>
        <h1>Business Weekly Schedule</h1>
        <h2>Week of {transformDateAndDayString(schedule[0].date)} until {transformDateAndDayString(schedule[schedule.length-1].date)}</h2>
        <div className={styles.schedule_grid}>
          {schedule?.map((day: Day, index: number) => (
            <div key={index} className={styles.day_column}>
              <div className={styles.day_header}>
                {day.day} - {transformShortDateString(day.date)}
              </div>
              {renderTimeSlots(day.slots, day)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default Schedule;