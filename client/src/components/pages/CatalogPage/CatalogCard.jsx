import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import ProductModal from '../../Modals/ProductModal';
import styles from './CatalogPage.module.css';

function CatalogCard({ selectedCategory, currentPage, itemsPerPage, onPageChange }) {
    const { user } = useAuth();
    const { warning } = useToast();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory, currentPage]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const url = selectedCategory === 'all' 
                ? `http://localhost:5000/api/products?page=${currentPage}&limit=${itemsPerPage}`
                : `http://localhost:5000/api/products/category/${selectedCategory}?page=${currentPage}&limit=${itemsPerPage}`;
            
            const response = await axios.get(url);
            setProducts(response.data.products);
            setTotalPages(response.data.totalPages || Math.ceil(response.data.total / itemsPerPage));
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (product) => {
        setSelectedProduct(product);
        setModalOpen(true);
    };

    const handlePageChange = (page) => {
        onPageChange(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const renderPagination = () => {
        const pages = [];
        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return (
            <div className={styles.pagination}>
                <button
                    className={styles.pageButton}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    ← Назад
                </button>
                
                {startPage > 1 && (
                    <>
                        <button
                            className={styles.pageButton}
                            onClick={() => handlePageChange(1)}
                        >
                            1
                        </button>
                        {startPage > 2 && <span className={styles.paginationDots}>...</span>}
                    </>
                )}
                
                {pages.map(page => (
                    <button
                        key={page}
                        className={`${styles.pageButton} ${currentPage === page ? styles.activePage : ''}`}
                        onClick={() => handlePageChange(page)}
                    >
                        {page}
                    </button>
                ))}
                
                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && <span className={styles.paginationDots}>...</span>}
                        <button
                            className={styles.pageButton}
                            onClick={() => handlePageChange(totalPages)}
                        >
                            {totalPages}
                        </button>
                    </>
                )}
                
                <button
                    className={styles.pageButton}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Вперед →
                </button>
            </div>
        );
    };

    if (loading) {
        return (
            <div className={styles.loadingState}>
                <p>Загрузка товаров...</p>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className={styles.emptyState}>
                <p>В данной категории пока нет товаров</p>
            </div>
        );
    }

    return (
        <>
            <div className={styles.productsGrid}>
                {products.map(product => (
                    <div key={product.id} className={styles.productCard}>
                        <div className={styles.productImage}>
                            <img 
                                src={product.image || 'client/public/images/default.jpg'} 
                                alt={product.name} 
                                onError={(e) => {
                                    e.target.src = '';
                                }}
                            />
                        </div>
                        <div className={styles.productContent}>
                            <h3 className={styles.productTitle}>{product.name}</h3>
                            <p className={styles.productDescription}>{product.shortDescription}</p>
                            <button
                                className={styles.detailsButton}
                                onClick={() => handleOpenModal(product)}
                            >
                                Узнать подробнее 
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            {totalPages > 1 && renderPagination()}
            
            <ProductModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                product={selectedProduct}
            />
        </>
    );
}

export default CatalogCard;