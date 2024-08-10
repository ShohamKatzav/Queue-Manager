import styles from './Pagination.module.css';

const Pagination = ({ currentPage, totalPages, onPageChange }
    : { currentPage: number, totalPages: number, onPageChange: (page: number) => void }) => {

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    return (
        <div className={styles.pagination}>
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1} >
                Previous
            </button>
            {pages.map(page => (
                <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`${page === currentPage ? styles.active : ""}`} >
                    {page}
                </button>
            ))}
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages} >
                Next
            </button>
        </div>
    );
};

export default Pagination;