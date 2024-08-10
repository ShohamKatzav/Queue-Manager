import { useEffect, useState } from 'react';
import useConfiguredAxios from '../utils/useConfiguredAxios';
import useUser from '../hooks/useUser';
import { Appointment } from '../types/Appointment';
import AppointmentsDisplay from '../components/AppointmentsDisplay';
import Pagination from '../components/Pagination';

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = import.meta.env.VITE_BASEURL + "schedule/";
  const axios = useConfiguredAxios();
  const { user } = useUser();

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
          clientEmail: user?.email,
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
          clientEmail: user?.email,
          skip: (currentPage - 1) * import.meta.env.VITE_ITEMS_PER_PAGE,
          limit: import.meta.env.VITE_ITEMS_PER_PAGE
        }
      })
      setAppointments(response.data);
    } catch (err: any) {
      console.log('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return <h1>Loading...</h1>;
  }


  return (
    <>
      <AppointmentsDisplay
        appointments={appointments}
        getAppointments={getAppointments}
        currentPage={currentPage}
        setTotalPages={setTotalPages} />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </>
  );
};

export default AppointmentsList;