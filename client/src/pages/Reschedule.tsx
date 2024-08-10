
import { useLocation, useNavigate } from "react-router-dom";
import { Day, Slot } from "../types/Schedule";
import useConfiguredAxios from "../utils/useConfiguredAxios";
import { useEffect, useState } from "react";
import Schedule from "../components/Schedule";
import { transformFullDateString } from "../utils/transformDate";
import { Appointment } from "../types/Appointment";
import { useCookies } from "react-cookie";

function Reschedule() {
    const baseUrl = import.meta.env.VITE_BASEURL + "schedule/";
    const location = useLocation();
    const navigate = useNavigate();
    const { appointment } = location.state || {};
    const axios = useConfiguredAxios();
    const [loading, setLoading] = useState(true);
    const [schedule, setSchedule] = useState<Day[]>([]);
    const [cookies, setCookie] = useCookies(['oldAppointmentCoockie']);
    const [oldAppointment, setOldAppointment] = useState<Appointment>(appointment ?? cookies.oldAppointmentCoockie);

    // After the first render, we remove the appointment from location.state 
    // since it will no longer be relevant after rescheduling.
    // We also update the old appointment state and fetch the schedule.
    useEffect(() => {
        if (appointment) {
            setCookie("oldAppointmentCoockie", appointment);
            if (appointment) navigate(".", { replace: true });
        }
        setOldAppointment(appointment);
        getSchedule(oldAppointment);
    }, []);

    useEffect(() => {
        if (!appointment && !cookies.oldAppointmentCoockie) navigate("/", { replace: true })
        setOldAppointment(cookies.oldAppointmentCoockie ?? appointment);
    }, [cookies.oldAppointmentCoockie]);

    const getSchedule = async (appointment: Appointment) => {
        try {
            const appointmentDate = new Date(appointment?.time).getTime();
            const response = await axios.get<Day[]>(`${baseUrl}get-schedule`, {
                params: {
                    businessID: appointment?.business?._id ?? appointment?.business,
                    date: appointmentDate
                }
            });
            setSchedule(response.data);
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
            const res = await axios.put(`${baseUrl}reschedule-appointment`, { oldAppointment: oldAppointment, newSlotId: slot._id });
            await getSchedule(res.data);
            setCookie("oldAppointmentCoockie", res.data);
        } catch (err: any) {
            console.error('Error rescheduling:', err);
        }
    };

    if (loading) return <h1>Loading</h1>;

    return (
        <Schedule schedule={schedule} currentEditing={oldAppointment?.slot} handleSlotClick={reschedule}></Schedule>
    );
}

export default Reschedule;