import { useEffect, useState } from 'react';
import useAxiosWithAuth from '../utils/AxiosWithToken';
import { useCookies } from 'react-cookie';
import { Appointment } from '../types/Appointment';

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = import.meta.env.VITE_BASEURL + "schedule/";
  const axios = useAxiosWithAuth();
  const [cookies] = useCookies(['user']);
  

  useEffect(() => {
    const getAppointments = async () => {
      try {
        const response = await axios.get<any[]>(`${baseUrl}get-appointments`, {
          params: {
            clientEmail: cookies?.user?.email,
            skip: 0,
            limit: 5
          }
        })
        setAppointments(response.data);
      } catch (err: any) {
        console.log('Error fetching appointments:', err); // Debug: Error
      } finally {
        setLoading(false);
      }
    };

    getAppointments();
  }, []);


  function formatDateTime(isoString: Date) {
    const date = new Date(isoString);
    
    // Format the date
    const day = date.toLocaleDateString('en-US', { weekday: 'long' }); 
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    
    return formattedDate + ", " + day + " " + time;
    
}

  if (loading) {
    return <div>Loading...</div>;
  }

  if (appointments.length < 0)
    return <p>No appointments found</p>

  return (
    <>
      <h1>Appointments List</h1>
      <div>
        <ol>
          {(
            appointments.map((appointment) => (
              <div key={appointment._id}>
                <li>
                  <h2>{appointment.business?.name}</h2>
                </li>
                <ul>
                  <li>{appointment.business?.address + ", " + appointment.business?.city}</li>
                  <li>{formatDateTime(appointment.time)}</li>
                </ul> <br />
              </div>
            ))
          )}
        </ol>
      </div>
    </>
  );
};

export default AppointmentsList;