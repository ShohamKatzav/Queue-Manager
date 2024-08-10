import { useEffect, useState } from 'react';
import { Day } from '../types/Schedule';
import useConfiguredAxios from '../utils/useConfiguredAxios';
import useUser from '../hooks/useUser';
import Schedule from '../components/Schedule';


const BusinessSchedule = () => {
    const axios = useConfiguredAxios();
    const [schedule, setSchedule] = useState<Day[]>([]);
    const baseUrl = import.meta.env.VITE_BASEURL + "schedule/";
    const { user, loading } = useUser();

    const getSchedule = async () => {
        if (loading) return;
        try {
            const today = new Date().getTime();
            console.log(today);
            const response = await axios.get<Day[]>(`${baseUrl}get-schedule`, {
                params: {
                    businessID: user?._id,
                    date: today
                }
            });
            setSchedule(response.data);
        } catch (err: any) {
            console.error('Error fetching schedule:', err);
        }
    };

    useEffect(() => {
        getSchedule();
    }, [loading]);

    return (
        <Schedule schedule={schedule} />
    );
};

export default BusinessSchedule;