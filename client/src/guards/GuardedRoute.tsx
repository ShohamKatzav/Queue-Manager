import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import AxiosWithToken from '../utils/useConfiguredAxios';
import useUser from '../hooks/useUser';

const GuardedRoute = () => {
  const axios = AxiosWithToken();
  const baseUrl = import.meta.env.VITE_BASEURL + "account/";
  const [isAuth, setIsAuth] = useState(false);
  const [check, setCheck] = useState(false);
  const navigate = useNavigate();
  const { user, loading } = useUser();

  useEffect(() => {
    const logIn = async () => {
      if (user) {
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

    if (!loading) {
      logIn();
    }
  }, [user, loading]);

  useEffect(() => {
    if (check && !isAuth) {
      navigate('/', { replace: true });
    }
  }, [check, isAuth]);

  return (
    check && isAuth ? <Outlet /> : null
  );
};

export default GuardedRoute;