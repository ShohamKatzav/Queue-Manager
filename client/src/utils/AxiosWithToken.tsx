import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosHeaders } from 'axios';
import { useCookies } from 'react-cookie';
import User from '../types/User';

const useAxiosWithAuth = (): AxiosInstance => {
    const [cookies] = useCookies(['user']);

    const instance = axios.create();

    instance.interceptors.request.use(
        async (config: InternalAxiosRequestConfig) => {
            const user = cookies.user as User;
            const token = user?.token;
            if (token) {
                if (!config.headers) {
                    config.headers = new AxiosHeaders();
                }
                config.headers.set('Authorization', `Bearer ${token}`);
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    return instance;
};

export default useAxiosWithAuth;