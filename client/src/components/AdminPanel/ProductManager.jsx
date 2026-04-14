import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import styles from './AdminPanel.module.css';

const ProductManager = () => {
  const { success, error: showError } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    image: '',
    shortDescription: '',
    fullDescription: '',
    specifications: [],
    price: '',
    inStock: true,
  });

  const categories = [
    'oil-transformer',
    'dry-transformer',
    'ktp-outdoor',
    'ktp-indoor',
    'capacitor',
    'devices',
    'diesel',
    'multipurpose',
    'current-transformer',
  ];

  const categoryNames = {
    'oil-transformer': 'Трансформаторы силовые масляные',
    'dry-transformer': 'Трансформаторы силовые сухие',
    'ktp-outdoor': 'КТП наружной установки',
    'ktp-indoor': 'КТП внутренней установки',
    'capacitor': 'Автоматические конденсаторные установки',
    'devices': 'Аппараты',
    'diesel': 'Дизельные электростанции',
    'multipurpose': 'Многоцелевые трансформаторы',
    'current-transformer': 'Трансформаторы тока',
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
      showError('Ошибка при загрузке товаров');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSpecificationsChange = (e) => {
    const specs = e.target.value.split('\n').filter(s => s.trim());
    setFormData({ ...formData, specifications: specs });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const url = editingProduct 
        ? `http://localhost:5000/api/products/${editingProduct.id}`
        : 'http://localhost:5000/api/products';
      const method = editingProduct ? 'put' : 'post';
      
      await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      success(editingProduct ? 'Товар обновлен' : 'Товар создан');
      fetchProducts();
      setShowForm(false);
      setEditingProduct(null);
      resetForm();
    } catch (error) {
      showError(error.response?.data?.error || 'Ошибка при сохранении');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      image: product.image || '',
      shortDescription: product.shortDescription,
      fullDescription: product.fullDescription,
      specifications: product.specifications || [],
      price: product.price || '',
      inStock: product.inStock,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить товар?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      success('Товар удален');
      fetchProducts();
    } catch (error) {
      showError('Ошибка при удалении');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      image: '',
      shortDescription: '',
      fullDescription: '',
      specifications: [],
      price: '',
      inStock: true,
    });
  };

  return (
    <div className={styles.productManager}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Управление товарами</h2>
        <button 
          className={styles.addButton}
          onClick={() => {
            setEditingProduct(null);
            resetForm();
            setShowForm(true);
          }}
        >
          + Добавить товар
        </button>
      </div>

      {showForm && (
        <div className={styles.productForm}>
          <h3>{editingProduct ? 'Редактировать товар' : 'Новый товар'}</h3>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Название *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Категория *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Выберите категорию</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{categoryNames[cat]}</option>
                ))}
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label>URL изображения</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="client/public/images/your-image.jpg"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Краткое описание *</label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                rows={2}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Полное описание *</label>
              <textarea
                name="fullDescription"
                value={formData.fullDescription}
                onChange={handleChange}
                rows={5}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Характеристики (каждая с новой строки)</label>
              <textarea
                value={formData.specifications.join('\n')}
                onChange={handleSpecificationsChange}
                rows={4}
                placeholder="Мощность: 1000 кВА&#10;Напряжение: 10 кВ"
              />
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Цена</label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="По запросу"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleChange}
                  />
                  В наличии
                </label>
              </div>
            </div>
            
            <div className={styles.formButtons}>
              <button type="submit" className={styles.saveButton}>
                {editingProduct ? 'Сохранить' : 'Создать'}
              </button>
              <button 
                type="button" 
                className={styles.cancelButton}
                onClick={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                }}
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>Загрузка...</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Название</th>
                <th>Категория</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{categoryNames[product.category] || product.category}</td>
                  <td>
                    {product.inStock ? (
                      <span className={styles.inStock}>✓ В наличии</span>
                    ) : (
                      <span className={styles.outOfStock}>✗ Нет в наличии</span>
                    )}
                  </td>
                  <td>
                    <div className={styles.productActions}>
                    <button
                      onClick={() => handleEdit(product)}
                      className={styles.editButton}
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className={styles.deleteButton}
                    >
                      Удалить
                    </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductManager;