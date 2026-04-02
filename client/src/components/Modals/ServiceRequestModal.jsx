import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast  } from '../context/ToastContext';
import axios from 'axios';
import styles from './Modal.module.css';

const ServiceRequestModal = ({ isOpen, onClose, serviceType, serviceName }) => {
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const [formData, setFormData] = useState({
    serviceType: serviceType || '',
    serviceName: serviceName || '',
    name: user?.name || '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const serviceTypes = [
    { value: 'sale', label: 'Продажа оборудования' },
    { value: 'repair', label: 'Ремонт трансформаторов' },
    { value: 'electromontage', label: 'Промышленный электромонтаж' },
    { value: 'commissioning', label: 'Пуско-наладочные работы и ЭТЛ' },
  ];

  useEffect(() => {
    if (isOpen) {
      setFormData({
        serviceType: serviceType || '',
        serviceName: serviceName || '',
        name: user?.name || '',
        phone: '',
      });
      setErrors({});
    }
  }, [isOpen, serviceType, serviceName, user]);

  if (!isOpen) return null;

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
    
    if (!formData.serviceType) {
      newErrors.serviceType = 'Выберите вид услуги';
    }
    
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

  const handleServiceTypeChange = (e) => {
    const selectedType = e.target.value;
    const selectedService = serviceTypes.find(s => s.value === selectedType);
    setFormData({
      ...formData,
      serviceType: selectedType,
      serviceName: selectedService?.label || '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/service-requests',
        {
          serviceType: formData.serviceType,
          serviceName: formData.serviceName,
          name: formData.name.trim(),
          phone: formData.phone,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      success('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время');
      
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      showError(error.response?.data?.error || 'Ошибка при отправке заявки');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h2 className={styles.modalTitle}>Заявка на услугу</h2>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Вид услуги *</label>
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleServiceTypeChange}
              className={errors.serviceType ? styles.error : ''}
            >
              <option value="">Выберите услугу</option>
              {serviceTypes.map(service => (
                <option key={service.value} value={service.value}>
                  {service.label}
                </option>
              ))}
            </select>
            {errors.serviceType && <div className={styles.errorText}>{errors.serviceType}</div>}
          </div>
          
          <div className={styles.formGroup}>
            <label>Имя *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Иванов Иван"
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
          
          <button type="submit" className={styles.submitButton} disabled={submitting}>
            {submitting ? 'Отправка...' : 'Отправить'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ServiceRequestModal;