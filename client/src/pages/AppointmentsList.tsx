import { useEffect, useState } from 'react';
import useConfiguredAxios from '../utils/useConfiguredAxios';
import useUser from '../hooks/useUser';
import { Appointment } from '../types/Appointment';
import AppointmentsDisplay from '../components/AppointmentsDisplay';
import Pagination from '../components/Pagination';
import { useLocation } from 'react-router-dom';

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
  const [loading, setLoading] = useState(true);

  const baseUrl = import.meta.env.VITE_BASEURL + "appointment/";
  const axios = useConfiguredAxios();
  const { user } = useUser();
  const location = useLocation();
  const { date } = location.state || {};

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);


  useEffect(() => {
    getAppointmentsTotalCount();
  }, []);

  useEffect(() => {
    setLoading(true);
    getAppointments();
  }, [currentPage]);

  const onPageChange = async (page: number) => {
    setCurrentPage(page);
  }

  const getAppointmentsTotalCount = async () => {
    try {
      const response = await axios.get<number>(`${baseUrl}get-appointments-count`, {
        params: {
          userEmail: user?.email,
          userType: user?.userType,
          date: date?.getTime()
        }
      })
      let total = Math.ceil(response.data / import.meta.env.VITE_ITEMS_PER_PAGE);
      setTotalPages(total);
    } catch (err: any) {
      console.log('Error getting appointments count:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAppointments = async () => {
    try {
      const response = await axios.get<Appointment[]>(`${baseUrl}get-appointments`, {
        params: {
          userEmail: user?.email,
          userType: user?.userType,
          skip: (currentPage - 1) * import.meta.env.VITE_ITEMS_PER_PAGE,
          limit: import.meta.env.VITE_ITEMS_PER_PAGE,
          date: date?.getTime()
        }
      })
      await getAppointmentsTotalCount();
      setAppointments(response.data);
    } catch (err: any) {
      console.log('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };


  if (loading || !appointments) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <AppointmentsDisplay
        appointments={appointments}
        getAppointments={getAppointments}
        totalPages={totalPages}
        setTotalPages={setTotalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage} />
      {appointments?.length! > 0 &&
        <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange} />
      }
    </>
  );
};

export default AppointmentsList;