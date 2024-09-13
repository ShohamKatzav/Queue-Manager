import { useEffect, useState } from 'react';
import { Business } from '../types/Business'
import BusinessCard from './BusinessCard';
import styles from './BusinessCard.module.css';

const BusinessesDisplay = ({ businesses, currentPage }: { businesses: Business[], currentPage: number }) => {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (businesses)
      setLoading(false)
  }, [businesses]);


  if (loading) {
    return <div>Loading...</div>;
  }

  if (!businesses.length && !loading)
    return <h2>No businesses found</h2>

  return (
    <>
      <div className={styles.cards_container}>
        <ol>
          {(
            businesses.map((business, index) => (
              <BusinessCard
                key={business._id}
                business={business}
                index={index}
                currentPage={currentPage}
              />
            ))
          )}
        </ol>
      </div>
    </>
  );
};

export default BusinessesDisplay;