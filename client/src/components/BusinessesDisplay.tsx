import { useEffect, useState } from 'react';
import styles from '../pages/AuthForm.module.css';
import { useNavigate } from 'react-router-dom';
import { Business } from '../types/Business'

const BusinessesDisplay = ({businesses, currentPage}: {businesses:Business[], currentPage: number }) => {

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if(businesses)
        setLoading(false)
  }, [businesses]);

  const redirectToSchedule = (businessID: string, businessEmail: string , businessName: string) => {
    navigate('/business-schedule', { state: { businessID: businessID, businessEmail: businessEmail, businessName: businessName} });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!businesses.length && !loading)
    return <h2>No businesses found</h2>

  return (
    <>
      <div>
        <ol>
          {(
            businesses.map((business, index) => (
              <div key={business._id}>
                <li value={((currentPage - 1) * import.meta.env.VITE_ITEMS_PER_PAGE) + ++index}>
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

export default BusinessesDisplay;