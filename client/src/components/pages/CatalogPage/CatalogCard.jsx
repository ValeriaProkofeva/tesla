import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import ProductModal from '../../Modals/ProductModal';
import styles from './CatalogPage.module.css';

function CatalogCard({ selectedCategory }) {
    const { user } = useAuth();
    const { warning } = useToast();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Загрузка товаров из БД при изменении категории
    useEffect(() => {
        fetchProducts();
    }, [selectedCategory]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const url = selectedCategory === 'all' 
                ? 'http://localhost:5000/api/products'
                : `http://localhost:5000/api/products/category/${selectedCategory}`;
            
            const response = await axios.get(url);
            setProducts(response.data.products);
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

    const handleOrderClick = (product) => {
        if (!user) {
            warning('**Необходима авторизация**\nДля заказа оборудования войдите в свой аккаунт');
            return;
        }
        handleOpenModal(product);
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
                                src={product.image || '/images/products/default.jpg'} 
                                alt={product.name} 
                                onError={(e) => {
                                    e.target.src = '/images/products/default.jpg';
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

            <ProductModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                product={selectedProduct}
            />
        </>
    );
}

export default CatalogCard;