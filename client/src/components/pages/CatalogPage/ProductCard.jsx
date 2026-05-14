import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CatalogPage.module.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Открываем модальное окно с товаром или переходим на страницу товара
    navigate(`/catalog/product/${product.id}`);
  };

  return (
    <div className={styles.productCard} onClick={handleClick}>
      <div className={styles.productImage}>
        <img 
          src={product.image || '/images/products/default.jpg'} 
          alt={product.name}
          onError={(e) => { e.target.src = '/images/products/default.jpg'; }}
        />
      </div>
      <div className={styles.productContent}>
        <h3 className={styles.productTitle}>{product.name}</h3>
        <p className={styles.productDescription}>{product.shortDescription}</p>
        <button className={styles.detailsButton}>
          Подробнее →
        </button>
      </div>
    </div>
  );
};

export default ProductCard;