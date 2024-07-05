import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useCookies } from 'react-cookie';
import AxiosWithToken from '../utils/AxiosWithToken';


const GuardedRoute = () => {
  const axios = AxiosWithToken();
  const [cookies] = useCookies(['user']);
  const baseUrl = import.meta.env.VITE_BASEURL + "account/";
  const [isAuth, setIsAuth] = useState(false);
  const [check, setCheck] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const logIn = async () => {
      if (cookies.user) {
        try {
          const response = await axios.post(`${baseUrl}verify`);
          if (response.status === 200) {
            setIsAuth(true);
          } else {
            setIsAuth(false);
          }
        } catch (error) {
          setIsAuth(false);
        }
      } else {
        setIsAuth(false);
      }
      setCheck(true);
    };
    logIn();
  }, [cookies, cookies.user]);

  useEffect(() => {
    if (check && !isAuth) {
      navigate('/', { replace: true });
    }
  }, [check, isAuth]);

  return (
    check && isAuth &&
    <Outlet />
  );
};

export default GuardedRoute;