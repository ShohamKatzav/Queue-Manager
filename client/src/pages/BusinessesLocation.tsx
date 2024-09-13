import { useEffect, useState } from "react";
import styles from './AuthForm.module.css';
import { Business } from "../types/Business";
import BusinessesDisplay from "../components/BusinessesDisplay";
import SearchButton from "../components/SearchButton";
import Pagination from "../components/Pagination";
import { getBusinesses, getBusinessesTotalPages } from '../utils/businessListActions';

const BusinessesLocation = () => {

    const [city, setCity] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [loading, setLoading] = useState(false);
    const [check, setCheck] = useState(false);
    const [businesses, setBusinesses] = useState<Business[] | undefined>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);


    useEffect(() => {
        if (selectedCity)
            updateTotalCount();
    }, [selectedCity]);

    useEffect(() => {
        if (selectedCity)
            updateBusinesses();
    }, [currentPage]);

    const onPageChange = async (page: number) => {
        setCurrentPage(page);
    }

    const updateTotalCount = async () => {
        try {
            const params = {
                searchType: 'location',
                searchParam: selectedCity
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
        setSelectedCity(city);
        setLoading(true);
        try {
            const params = {
                searchType: 'location',
                searchParam: city
            }
            const response = await getBusinesses(currentPage, params);
            setBusinesses(response);
        } catch (err: any) {
            console.log('Error fetching businesses:', err);
        } finally {
            setCheck(true);
            setLoading(false);
        }
    };


    const search = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // prevent form discconnection of the form on submit
        updateBusinesses();
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <h1>Location</h1>
            <form onSubmit={search}>
                <label className={styles.flexBox}>
                    {"City: "}
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        className={styles.input}
                    />
                    <SearchButton />
                </label>
                {check &&
                    <>
                        <h1>Businesses in "{selectedCity}"</h1>
                        {businesses && <BusinessesDisplay businesses={businesses} currentPage={currentPage} />
                        }
                        {businesses && businesses.length > 0 &&
                            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
                        }
                    </>
                }
            </form>
        </>
    );
};

export default BusinessesLocation;