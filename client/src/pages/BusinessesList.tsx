import { useEffect, useState } from 'react';
import { Business } from '../types/Business'
import BusinessesDisplay from '../components/BusinessesDisplay';
import Pagination from '../components/Pagination';
import { getBusinesses, getBusinessesTotalPages } from '../utils/businessListActions';

const BusinessesList = () => {
  const [businesses, setBusinesses] = useState<Business[] | undefined>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    updateTotalCount();
  }, []);

  useEffect(() => {
    setLoading(true);
    updateBusinesses();
  }, [currentPage]);

  useEffect(() => {
    updateBusinesses();
  }, []);

  const onPageChange = async (page: number) => {
    setCurrentPage(page);
  }

  const updateTotalCount = async () => {
    try {
      const response = await getBusinessesTotalPages() as number;
      setTotalPages(response);
    } catch (err: any) {
      console.log('Error getting businesses count:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateBusinesses = async () => {
    try {
      const response = await getBusinesses(currentPage);
      setBusinesses(response);
    } catch (err: any) {
      console.log('Error fetching businesses:', err); // Debug: Error
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (businesses && businesses?.length < 0)
    return <p>No businesses found</p>

  return (
    <>
      <h1>Businesses List</h1>
      {businesses && 
      <>
      <BusinessesDisplay businesses={businesses} currentPage={currentPage} />
      </>
      }
      {businesses && businesses.length > 0 &&
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      }
    </>
  );
};

export default BusinessesList;