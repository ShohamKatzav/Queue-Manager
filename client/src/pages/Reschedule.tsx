
import { useLocation, useNavigate } from "react-router-dom";
import { Slot } from "../types/Schedule";
import useConfiguredAxios from "../utils/useConfiguredAxios";
import { useEffect, useState } from "react";
import WeeklySchedule from "../components/WeeklySchedule";
import { transformFullDateString } from "../utils/transformDate";
import { Appointment } from "../types/Appointment";
import { useCookies } from "react-cookie";
import styles from '../components/Schedule.module.css';
import fetchSchedule from "../utils/scheduleActions";

function Reschedule() {
    const baseUrl = import.meta.env.VITE_BASEURL + "appointment/";
    const location = useLocation();
    const navigate = useNavigate();
    const { appointment } = location.state || {};
    const axios = useConfiguredAxios();
    const [loading, setLoading] = useState(true);
    const [cookies, setCookie] = useCookies(['oldAppointmentCoockie']);
    const [oldAppointment, setOldAppointment] = useState<Appointment>(appointment ?? cookies.oldAppointmentCoockie);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

    // After the first render, we remove the appointment from location.state 
    // since it will no longer be relevant after rescheduling.
    // We also update the old appointment state and fetch the schedule.
    useEffect(() => {
        setOldAppointment(appointment);
        if (appointment) {
            setCookie("oldAppointmentCoockie", appointment);
            if (appointment) navigate(".", { replace: true });
        }
        setSelectedDate(oldAppointment?.time);
        setLoading(false);
    }, []);

    useEffect(() => {
        if (!appointment && !cookies.oldAppointmentCoockie) navigate("/", { replace: true })
        setOldAppointment(cookies.oldAppointmentCoockie ?? appointment);
    }, [cookies.oldAppointmentCoockie]);

    const dateChange = async (buttonType: string) => {
        setLoading(true);
        const currentDate = new Date(selectedDate ?? oldAppointment.time);
        if (buttonType == 'before')
            currentDate.setDate(currentDate.getDate() - 7);
        else if (buttonType == 'after')
            currentDate.setDate(currentDate.getDate() + 7);
        setSelectedDate(currentDate);
        await getSchedule(oldAppointment, currentDate);
        setLoading(false);
    }

    const getSchedule = async (appointment: Appointment, date: Date) => {
        setLoading(true);
        try {
            fetchSchedule(date, appointment.business._id)
        } catch (err: any) {
            console.error('Error fetching schedule:', err);
        } finally {
            setLoading(false);
        }
    };

    const reschedule = async (slot: Slot, date: Date) => {
        try {
            if (!confirm("Are you sure you want to reschedule the appointment at " + oldAppointment?.business?.name +
                " to " + transformFullDateString(date))) {
                return;
            }
            setLoading(true);
            const res = await axios.put(`${baseUrl}reschedule-appointment`, { oldAppointment: oldAppointment, newSlotId: slot._id });
            setCookie("oldAppointmentCoockie", res.data);
        } catch (err: any) {
            console.error('Error rescheduling:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <h1>Loading</h1>;

    const isBeforeDisabled = (new Date(selectedDate!).getTime() - 7) < new Date().getTime();

    return (
        <div className={styles.container}>
            <button
                onClick={() => dateChange("before")}
                className={styles.before}
                disabled={isBeforeDisabled}
            >Before</button>
            <WeeklySchedule
                custumeDate={selectedDate}
                businessId={oldAppointment?.business?._id ?? oldAppointment.business}
                currentEditing={oldAppointment?.slot}
                handleSlotClick={reschedule}>
            </WeeklySchedule>
            <button onClick={() => dateChange("after")} className={styles.after}>After</button>
        </div>
    );
}

export default Reschedule;