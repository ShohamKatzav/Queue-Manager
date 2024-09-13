import { useState, useEffect } from "react";
import { Business } from "../types/Business";
import { useNavigate, useLocation } from "react-router-dom";
import BusinessesDisplay from "../components/BusinessesDisplay";
import Pagination from "../components/Pagination";
import { getBusinesses, getBusinessesTotalPages } from '../utils/businessListActions';

const BusinessesName = () => {

    const [loading, setLoading] = useState(false);
    const [businesses, setBusinesses] = useState<Business[] | undefined>([]);
    const navigate = useNavigate();
    const location = useLocation();
    const { name } = location.state || {};

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        updateTotalCount();
    }, []);

    useEffect(() => {
        if (!name) navigate('/');
        else
            updateBusinesses();
    }, []);

    const onPageChange = async (page: number) => {
        setCurrentPage(page);
    }

    const updateTotalCount = async () => {
        try {
            const params = {
                searchType: 'name',
                searchParam: name
            }
            const response = await getBusinessesTotalPages(params) as number;
            setTotalPages(response);
        } catch (err: any) {
            console.log('Error getting businesses count:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateBusinesses = async () => {
        setLoading(true);
        try {
            const params = {
                searchType: 'name',
                searchParam: name
            }
            const response = await getBusinesses(currentPage, params);
            setBusinesses(response);
        } catch (err: any) {
            console.log('Error fetching businesses:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <h1>Search results for "{name}":</h1>
            {businesses && <BusinessesDisplay businesses={businesses} currentPage={currentPage} />
            }
            {businesses && businesses.length > 0 &&
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
            }
        </>
    );
};

export default BusinessesName;