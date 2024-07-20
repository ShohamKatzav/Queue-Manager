import { useEffect, useState } from 'react';
import useAxiosWithAuth from '../utils/AxiosWithToken';
import styles from './AuthForm.module.css';
import { useNavigate } from 'react-router-dom';
import { Business } from '../types/Business'

const BusinessesList = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = import.meta.env.VITE_BASEURL + "account/";
  const axios = useAxiosWithAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const getBusinesses = async () => {
      try {
        const response = await axios.get<any[]>(`${baseUrl}get-businesses`, {
          params: {
            skip: 0,
            limit: 5
          }
        })
        setBusinesses(response.data);
      } catch (err: any) {
        console.log('Error fetching businesses:', err); // Debug: Error
      } finally {
        setLoading(false);
      }
    };

    getBusinesses();
  }, []);

  const redirectToSchedule = (businessID: string, businessEmail: string , businessName: string) => {
    navigate('/business-schedule', { state: { businessID: businessID, businessEmail: businessEmail, businessName: businessName} });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (businesses.length < 0)
    return <p>No businesses found</p>

  return (
    <>
      <h1>Businesses List</h1>
      <div>
        <ol>
          {(
            businesses.map((business) => (
              <div key={business._id}>
                <li>
                  <h2>{business.name}</h2>
                </li>
                <ul>
                  <li>{business.email}</li>
                  <li>{business.address}, {business.city}</li>
                </ul> <br />
                <button onClick={() => redirectToSchedule(business._id, business.email , business.name)} className={styles.button2}>Schedule</button>
              </div>
            ))
          )}
        </ol>
      </div>
    </>
  );
};

export default BusinessesList;