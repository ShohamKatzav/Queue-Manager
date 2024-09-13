import { useState } from 'react';
import styles from './Calendar.module.css';
import { Day, Slot } from '../types/Schedule';
import SlotButton from './SlotButton';

const MakeAppointmentCalender = ({
    schedule,
    handleDayChange,
    handleTimeChange
}: {
    schedule: Day[] | null
    handleDayChange: (selectedDay: string) => void
    handleTimeChange: (selectedTime: string) => void
}) => {

    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<Day | null>(null);

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];




    const changeMonth = (increment: number) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
    };

    const daySelected = (day: number) => {
        const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const find = schedule?.find(day => day.date.getFullYear() === selectedDate.getFullYear() &&
            day.date.getMonth() === selectedDate.getMonth() &&
            day.date.getDate() === selectedDate.getDate());
        setSelectedDay(find!);
        handleDayChange(find?.day!);
    };
    const handleSlotClick = (slot: Slot) => {
        handleTimeChange(slot.start);
    };


    const today = new Date();


    const isPrevDisabled = () => {

        const pervMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        if (currentDate <= pervMonth) {
            return true;
        }

        const todayDay = today.getDate();
        if (todayDay >= 7 && currentDate.getMonth() <= today.getMonth()) {
            return true;
        }

        return false;
    };

    const isNextDisabled = () => {
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        if (currentDate >= nextMonth) {
            return true;
        }

        const daysLeftInMonth = daysInMonth - today.getDate();
        if (daysLeftInMonth >= 7 && currentDate.getMonth() >= today.getMonth()) {
            return true;
        }

        return false;
    };

    const isDayDisabled = (day: number) => {
        const selectedDate = new Date(today.getFullYear(), today.getMonth(), day);
        const isBeforeToday = day < today.getDay();
        const isAfterOneWeek = selectedDate > new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
        const find = schedule?.find(day => day.date.getFullYear() === selectedDate.getFullYear() &&
            day.date.getMonth() === selectedDate.getMonth() &&
            day.date.getDate() === selectedDate.getDate());
        return isBeforeToday || isAfterOneWeek || !find;
    };


    return (
        <div className={styles.calendar}>
            <div className={styles.header}>
                <button type="button" onClick={() => changeMonth(-1)} disabled={isPrevDisabled()}>Prev</button>
                <div className={styles.headersFlex}>
                    <h2>{currentDate.toLocaleString('default', { month: 'long' })}</h2>
                    <h2>{currentDate.toLocaleString('default', { year: 'numeric' })}</h2>
                </div>
                <button type="button" onClick={() => changeMonth(1)} disabled={isNextDisabled()}>Next</button>
            </div>
            <div className={styles.weekdays}>
                {weekdays.map(day => <div key={day}>{day}</div>)}
            </div>
            <div className={styles.days}>
                {Array(firstDayOfMonth).fill(null).map((_, index) => (
                    <div key={`empty-${index}`} className={styles.empty}></div>
                ))}
                {days.map(day => (
                    <button
                        type='button'
                        onClick={() => !isDayDisabled(day) && daySelected(day)}
                        key={day}
                        className={`${styles.day} ${isDayDisabled(day) ? styles.disabled_day : styles.available_day}`}  // Adds disabled class if the day is disabled
                        disabled={isDayDisabled(day)}  // Disables the button if the day is disabled
                        value={day}
                    >
                        {day}
                    </button>
                ))}
            </div>
            {selectedDay && (
                <div className={styles.slots}>
                    {selectedDay.slots.map(slot => (
                        <SlotButton
                            key={slot._id}
                            slot={slot}
                            onClick={() => handleSlotClick(slot)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MakeAppointmentCalender;