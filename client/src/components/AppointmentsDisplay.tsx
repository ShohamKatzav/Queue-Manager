import { useNavigate } from 'react-router-dom';
import styles from '../pages/AuthForm.module.css';
import { Appointment } from '../types/Appointment'
import useConfiguredAxios from '../utils/useConfiguredAxios';
import { transformFullDateString } from '../utils/transformDate';

const AppointmentsDisplay = ({
  appointments,
  getAppointments,
  currentPage,
  setTotalPages,
}: {
  appointments: Appointment[],
  getAppointments: () => Promise<void>,
  currentPage: number,
  setTotalPages: React.Dispatch<React.SetStateAction<number>>
}) => {

  const axios = useConfiguredAxios();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASEURL + "schedule/";


  const cancelAppointment = async (appointment: Appointment) => {
    if (!confirm("Are you sure you want to cancel the appointment at " + appointment.business.name +
      " on " + transformFullDateString(appointment.time) + "?")) {
      return;
    }
    await axios.delete(`${baseUrl}delete-appointment`, {
      params: {
        appointmentId: appointment._id
      }
    })
    setTotalPages(total => total - 1)
    await getAppointments();
  };

  const rescheduleAppointment = async (appointment: Appointment) => {
    navigate('/reschedule', { state: { appointment: appointment } });
  };

  if (appointments.length < 1)
    return <h1>You don't have any appointments yet</h1>

  return (
    <>
      <h1>Appointments List</h1>
      <div>
        <ol>
          {(
            appointments.map((appointment: Appointment, index) => (
              appointment &&
              <div key={appointment._id}>
                <li value={((currentPage - 1) * import.meta.env.VITE_ITEMS_PER_PAGE) + ++index}>
                  <h2>{appointment.business?.name}</h2>
                </li>
                <ul>
                  <li>{appointment.business?.address + ", " + appointment.business?.city}</li>
                  <li>{transformFullDateString(appointment?.time)}</li>
                </ul>
                <button onClick={() => cancelAppointment(appointment)} className={styles.button3}>Cancel</button>
                <button onClick={() => rescheduleAppointment(appointment)} className={styles.button5}>Reschedule</button>
                <br />
              </div>
            ))
          )}
        </ol>
      </div>

    </>
  );
};

export default AppointmentsDisplay;