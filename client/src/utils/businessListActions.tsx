import { Business } from '../types/Business';
import useConfiguredAxios from './useConfiguredAxios';

export type params = {
    searchType: string;
    searchParam: string;
}

const baseUrl = import.meta.env.VITE_BASEURL + "account/";
const axios = useConfiguredAxios();

export const getBusinessesTotalPages = async (params?: params) => {
    try {
        const response = await axios.get<number>(`${baseUrl}get-businesses-count`, {
            params
        });
        return Math.ceil(response.data / import.meta.env.VITE_ITEMS_PER_PAGE);
    } catch (err: any) {
        console.log('Error getting businesses count:', err);
    }
};

export const getBusinesses = async (currentPage: number, params?: params) : Promise<Business[] | undefined> => {
    try {
        const { ...queryParams } = params || {};
        const response = await axios.get<Business[]>(`${baseUrl}get-businesses`, {
            params: {
                skip: (currentPage - 1) * import.meta.env.VITE_ITEMS_PER_PAGE,
                limit: import.meta.env.VITE_ITEMS_PER_PAGE,
                ...queryParams
            }
        })
        return response.data;
    } catch (err: any) {
        console.log('Error fetching businesses:', err);
    }
};