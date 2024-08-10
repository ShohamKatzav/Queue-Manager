import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const isISODateString = (str: string): boolean => {
    // Regular expression to match ISO 8601 date strings
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/.test(str);
};

const convertDateStrings = (obj: any): any => {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(convertDateStrings);
    }

    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string' && isISODateString(value)) {
            result[key] = new Date(value);
        } else {
            result[key] = convertDateStrings(value);
        }
    }
    return result;
};

const useConfiguredAxios = (): AxiosInstance => {
    
    const instance = axios.create({
        withCredentials: true,
    });

    instance.interceptors.request.use(
        async (config: InternalAxiosRequestConfig) => {
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    instance.interceptors.response.use(
        (response: AxiosResponse) => {
            if (response.data) {
                response.data = convertDateStrings(response.data);
            }
            return response;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    return instance;
};

export default useConfiguredAxios;