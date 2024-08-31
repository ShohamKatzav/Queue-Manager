import { Day } from "../types/Schedule";
import useConfiguredAxios from "./useConfiguredAxios";

const baseUrl = import.meta.env.VITE_BASEURL + "schedule/";
const axios = useConfiguredAxios();

const fetchSchedule = async (customDate: Date, businessId: string) => {
    const date = customDate ? new Date(customDate).getTime() : new Date().getTime(); 
    try {
        const response = await axios.get<Day[]>(`${baseUrl}get-schedule`, {
            params: {
                businessID: businessId,
                date: date
            }
        });
        return response.data;
    } catch (err: any) {
        console.error('Error fetching schedule:', err);
    }
};

export default fetchSchedule;