import { useState, useEffect } from 'react';
import useAxiosWithAuth from '../utils/AxiosWithToken';
import { useLocation } from 'react-router-dom';
import { Day, Slot } from '../types/Schedule'
import styles from './AuthForm.module.css';
import { useCookies } from 'react-cookie';


const BusinessSchedule = () => {

    const baseUrl = import.meta.env.VITE_BASEURL + "schedule/";
    const [loading, setLoading] = useState(true);
    const axios = useAxiosWithAuth();
    const location = useLocation();
    const { businessID, businessEmail, businessName } = location.state || {};
    const [schedule, setSchedule] = useState<Day[]>();
    const [selectedDay, setSelectedDay] = useState<Day>();
    const [selectedTime, setSelectedTime] = useState<Slot>();
    const [cookies] = useCookies(['user']);


    useEffect(() => {
        getSchedule();
    }, []);


    const transformDateString = (date: Date): string => {
        const stringDate = date.toString().split('T')[0];
        const [year, month, day] = stringDate.split('-');
        return `${day}/${month}/${year}`;
    };

    const getSchedule = async () => {
        try {
            let today = new Date().getTime();
            const response = await axios.get<any[]>(`${baseUrl}get-schedule`, {
                params: {
                    businessID,
                    date: today
                }
            })
            const tempSchedule = response.data as unknown as Day[];
            setSchedule(tempSchedule);
            if (!selectedDay) {
                setSelectedDay(tempSchedule[0])
                const available = tempSchedule[0]?.slots.find(slot => slot.available);
                setSelectedTime(available);
            }
            else {
                const updatedDay = tempSchedule.find(day=> day.day == selectedDay.day);
                setSelectedDay(updatedDay);
                const available = updatedDay?.slots.find(slot => slot.available);
                setSelectedTime(available);
            }
        } catch (err: any) {
            console.log('Error fetching businesses:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios.post(`${baseUrl}make-appointment`, { slotID: selectedTime?._id, clientEmail: cookies?.user?.email, businessEmail: businessEmail }).then(() => {
            getSchedule();
        });
    };


    const handleDayChange = (selectedDay: string) => {
        const day = schedule?.find((day: any) => day.day === selectedDay);
        setSelectedDay(day);
        const available = day?.slots.find(slot => slot.available);
        setSelectedTime(available);
    };

    const handleTimeChange = (selectedTime: string) => {
        const time = selectedDay?.slots.find((time: any) => time.start === selectedTime);
        setSelectedTime(time);
    };

    if (loading || !schedule) {
        return <div>Loading...</div>;
    }
    return (
        <>
            <h1>{businessName}'s Schedule</h1>

            <form onSubmit={handleSubmit} className={styles.form}>
                <label>
                    {"Select a day: "}
                    <select onChange={(e) => handleDayChange(e.target.value)}>
                        {schedule?.map((day: Day, index: number) => (
                            <option key={index} value={day.day}>
                                {day.day + " - " + transformDateString(day.date)}
                            </option>
                        ))}
                    </select> <br />
                    {" Select time: "}
                    <select onChange={(e) => handleTimeChange(e.target.value)} value={selectedTime?.start}>
                        {selectedDay?.slots.map((time: Slot, index: number) => (
                            <option key={index} value={time.start} disabled={!time.available}>
                                {time.start + " - " + time.end}
                            </option>
                        ))}
                    </select>
                </label> <br /> <br />
                <button type='submit' className={styles.button3}>MAKE AN APPOINTMENT NOW!</button>
            </form>
        </>
    );
};

export default BusinessSchedule;