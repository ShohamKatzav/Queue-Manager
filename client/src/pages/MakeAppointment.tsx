import { useState, useEffect } from 'react';
import useConfiguredAxios from '../utils/useConfiguredAxios';
import { useLocation } from 'react-router-dom';
import { Day, Slot } from '../types/Schedule'
import styles from './AuthForm.module.css';
import useUser from '../hooks/useUser';
import { transformFullDateString } from '../utils/transformDate';
import { Appointment } from '../types/Appointment';
import { useNavigate } from 'react-router-dom';
import MakeAppointmentCalendar from '../components/MakeAppointmentCalendar';


const MakeAppointment = () => {

    const scheduleUrl = import.meta.env.VITE_BASEURL + "schedule/";
    const appointmentUrl = import.meta.env.VITE_BASEURL + "appointment/";
    const [loading, setLoading] = useState(true);
    const axios = useConfiguredAxios();
    const location = useLocation();
    const { businessID, businessEmail, businessName } = location.state || {};
    const [schedule, setSchedule] = useState<Day[]>();
    const [selectedDay, setSelectedDay] = useState<Day>();
    const [selectedTime, setSelectedTime] = useState<Slot>();
    const { user } = useUser();
    const navigate = useNavigate();


    useEffect(() => {
        getSchedule();
    }, []);



    const getSchedule = async () => {
        try {
            let today = new Date().getTime();
            try {
                const response = await axios.get<Day[]>(`${scheduleUrl}get-schedule`, {
                    params: {
                        businessID,
                        date: today
                    }
                })
                setSchedule(response.data);
            }
            catch {
                alert("Error getting business schedule")
                navigate("/businesses-list");
            }
        } catch (err: any) {
            console.log('Error fetching businesses:', err);
        } finally {
            setLoading(false);
        }
    };

    const makeAppointment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post<Appointment>(`${appointmentUrl}make-appointment`, {
                slotID: selectedTime?._id,
                clientEmail: user?.email,
                businessEmail: businessEmail
            });

            const appointment = response.data;

            await getSchedule();
            setLoading(false);

            setTimeout(() => {
                alert(`You just scheduled a new appointment at ${appointment.business.name} on ${transformFullDateString(appointment.time)}`);
            }, 100);
        } catch (error) {
            console.error('Error making appointment:', error);
            setLoading(false);

            setTimeout(() => {
                alert('There was an error scheduling your appointment. Please try again.');
            }, 100);
        } finally {
            setSelectedTime(undefined);
        }
    };


    const handleDayChange = (selectedDay: string) => {
        const day = schedule?.find((day: any) => day.day === selectedDay);
        setSelectedDay(day);
        setSelectedTime(undefined);
    };
    const handleTimeChange = (selectedTime: string) => {
        const time = selectedDay?.slots.find((time: any) => time.start === selectedTime);
        setSelectedTime(time);
    };

    if (loading || !schedule) {
        return <h1>Loading...</h1>;
    }
    return (
        <>
            <h1>{businessName}'s Schedule</h1>

            <form onSubmit={makeAppointment}>
                <MakeAppointmentCalendar
                    schedule={schedule}
                    handleDayChange={handleDayChange}
                    handleTimeChange={handleTimeChange} />
                {selectedTime &&
                    <>
                        <br />
                        <button type='submit' className={styles.button4}>MAKE AN APPOINTMENT NOW!</button>
                    </>
                }
            </form>
        </>
    );
};

export default MakeAppointment;