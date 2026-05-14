import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import styles from './Modal.module.css';

const ProductModal = ({ isOpen, onClose, product }) => {
  const { user } = useAuth();
  const { success, error: showError, warning } = useToast();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    comment: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && product) {
      setFormData({
        name: user?.name || '',
        phone: '',
        comment: `Интересует оборудование: ${product?.name}`,
      });
      setErrors({});
    }
  }, [isOpen, product, user]);

  if (!isOpen || !product) return null;

  const formatPhone = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length === 0) return '';
    if (cleaned.length <= 1) return `+7`;
    if (cleaned.length <= 4) return `+7 (${cleaned.slice(1)}`;
    if (cleaned.length <= 7) return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4)}`;
    if (cleaned.length <= 9) return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Имя должно содержать минимум 2 символа';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Телефон обязателен';
    } else {
      const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
      const cleanPhone = formData.phone.replace(/\s/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        newErrors.phone = 'Введите корректный номер телефона';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setFormData({ ...formData, phone: formatted });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      warning('**Необходима авторизация**\nДля заказа оборудования войдите в свой аккаунт');
      return;
    }

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/equipment-orders',
        {
          productName: product.name,
          productId: product.id,
          name: formData.name.trim(),
          phone: formData.phone,
          comment: formData.comment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      success(`**Заказ на оборудование отправлен!**\nНаш менеджер свяжется с вами для уточнения деталей по ${product.name}`);

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      showError(error.response?.data?.error || '**Ошибка отправки**\nПопробуйте позже');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={`${styles.modalContent} ${styles.modalLarge}`} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        
        <div className={styles.modalProductLayout}>
          <div className={styles.modalProductInfo}>
            <h2 className={styles.modalTitle}>{product.name}</h2>
            <div className={styles.modalProductImage}>
              <img 
                src={product.image || '/images/products/default.jpg'} 
                alt={product.name}
                onError={(e) => {
                  e.target.src = '/images/products/default.jpg';
                }}
              />
            </div>
            <p className={styles.modalProductDescription}>{product.fullDescription}</p>
            
            {product.specifications && product.specifications.length > 0 && (
              <div className={styles.specifications}>
                <h4>Технические характеристики:</h4>
                <ul>
                  {product.specifications.map((spec, index) => (
                    <li key={index}>{spec}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className={styles.productExtraInfo}>
              {product.price && (
                <div className={styles.priceInfo}>
                  <span className={styles.priceLabel}>Цена:</span>
                  <span className={styles.priceValue}>{product.price}</span>
                </div>
              )}
              <div className={styles.stockInfo}>
                <span className={styles.stockLabel}>Наличие:</span>
                <span className={product.inStock ? styles.inStock : styles.outOfStock}>
                  {product.inStock ? 'В наличии' : 'Под заказ'}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.modalFormSection}>
            <h3 className={styles.formSectionTitle}>Заказать оборудование</h3>
            <p className={styles.formSectionSubtitle}>Оставьте свои данные, и наш менеджер свяжется с вами</p>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Имя *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? styles.error : ''}
                />
                {errors.name && <div className={styles.errorText}>{errors.name}</div>}
              </div>
              
              <div className={styles.formGroup}>
                <label>Контактный телефон *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="+7 (999) 123-45-67"
                  className={errors.phone ? styles.error : ''}
                />
                {errors.phone && <div className={styles.errorText}>{errors.phone}</div>}
              </div>
              
              <div className={styles.formGroup}>
                <label>Комментарий к заказу</label>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  rows={3}
                  className={styles.textarea}
                  placeholder="Дополнительные пожелания или вопросы..."
                />
              </div>
              
              <button type="submit" className={styles.submitButton} disabled={submitting}>
                {submitting ? 'Отправка...' : 'Заказать оборудование'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;