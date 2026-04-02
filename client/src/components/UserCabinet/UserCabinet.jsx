import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './UserCabinet.module.css';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';

const UserCabinet = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [consultations, setConsultations] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loadingConsultations, setLoadingConsultations] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [equipmentOrders, setEquipmentOrders] = useState([]);
  const [loadingEquipment, setLoadingEquipment] = useState(true);

  // Проверка наличия специального символа
  const hasSpecialChar = (password) => {
    const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    return specialChars.test(password);
  };

  // Загрузка заявок
  useEffect(() => {
    fetchConsultations();
    fetchServiceRequests();
    fetchEquipmentOrders();
  }, []);

  const fetchConsultations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/consultations/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConsultations(response.data.consultations);
    } catch (error) {
      console.error('Error fetching consultations:', error);
    } finally {
      setLoadingConsultations(false);
    }
  };

  const fetchServiceRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/service-requests/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServiceRequests(response.data.requests);
    } catch (error) {
      console.error('Error fetching service requests:', error);
    } finally {
      setLoadingServices(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Имя обязательно';
    else if (formData.name.length > 30) newErrors.name = 'Имя не должно превышать 30 символов';

    if (!formData.email) newErrors.email = 'Email обязателен';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email неверный';
    else if (formData.email.length > 40) newErrors.email = 'Email не должен превышать 40 символов';

    if (formData.newPassword) {
      if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'Пароль должен содержать минимум 6 символов';
      }
      if (!hasSpecialChar(formData.newPassword)) {
        newErrors.newPassword = 'Пароль должен содержать специальный символ (!@#$%^&*()_+)';
      }
      if (formData.newPassword !== formData.confirmNewPassword) {
        newErrors.confirmNewPassword = 'Пароли не совпадают';
      }
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Введите текущий пароль для смены пароля';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const updateData = {
      name: formData.name,
      email: formData.email,
    };

    if (formData.newPassword) {
      updateData.currentPassword = formData.currentPassword;
      updateData.newPassword = formData.newPassword;
      updateData.confirmNewPassword = formData.confirmNewPassword;
    }

    const result = await updateProfile(updateData);

    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setIsEditing(false);
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } else {
      setMessage({ type: 'error', text: result.error });
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user.name,
      email: user.email,
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    });
    setErrors({});
    setMessage({ type: '', text: '' });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Функции для отображения статуса
  const getStatusText = (status) => {
    const statuses = {
      new: 'Новая',
      processing: 'В обработке',
      completed: 'Завершена',
      cancelled: 'Отменена',
    };
    return statuses[status] || status;
  };

  const getStatusClass = (status) => {
    const classes = {
      new: styles.statusNew,
      processing: styles.statusProcessing,
      completed: styles.statusCompleted,
      cancelled: styles.statusCancelled,
    };
    return classes[status] || '';
  };

  const getServiceTypeText = (type) => {
    const types = {
      sale: 'Продажа оборудования',
      repair: 'Ремонт трансформаторов',
      electromontage: 'Промышленный электромонтаж',
      commissioning: 'Пуско-наладочные работы и ЭТЛ',
    };
    return types[type] || type;
  };

  const fetchEquipmentOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/equipment-orders/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEquipmentOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching equipment orders:', error);
    } finally {
      setLoadingEquipment(false);
    }
  };

  return (
    <>
      <Header></Header>
      <div className={styles.cabinetContainer}>
        <div className={styles.cabinetWrapper}>
          {/* Боковое меню */}
          <div className={styles.sidebar}>
            <div className={styles.userAvatar}>
              <div className={styles.avatarLarge}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h3 className={styles.userNameSidebar}>{user?.name}</h3>
              <p className={styles.userEmailSidebar}>{user?.email}</p>
            </div>

            <nav className={styles.sidebarNav}>
              <button
                className={`${styles.sidebarItem} ${activeTab === 'profile' ? styles.active : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <span className={styles.sidebarIcon}>Профиль</span>
              </button>
              <button
                className={`${styles.sidebarItem} ${activeTab === 'consultations' ? styles.active : ''}`}
                onClick={() => setActiveTab('consultations')}
              >
                <span className={styles.sidebarIcon}>Консультации</span>
                {consultations.length > 0 && (
                  <span className={styles.badge}>{consultations.length}</span>
                )}
              </button>
              <button
                className={`${styles.sidebarItem} ${activeTab === 'services' ? styles.active : ''}`}
                onClick={() => setActiveTab('services')}
              >
                <span className={styles.sidebarIcon}>Услуги</span>
                {serviceRequests.length > 0 && (
                  <span className={styles.badge}>{serviceRequests.length}</span>
                )}
              </button>
              <button
                className={`${styles.sidebarItem} ${activeTab === 'equipment' ? styles.active : ''}`}
                onClick={() => setActiveTab('equipment')}
              >
                <span className={styles.sidebarIcon}>Заказы</span>
                {equipmentOrders.length > 0 && (
                  <span className={styles.badge}>{equipmentOrders.length}</span>
                )}
              </button>
             
            </nav>
          </div>

          {/* Основной контент */}
          <div className={styles.mainContent}>
            {message.text && (
              <div className={`${styles.message} ${styles[message.type]}`}>
                {message.text}
              </div>
            )}

            {/* Вкладка профиля */}
            {activeTab === 'profile' && (
              <div className={styles.profileSection}>
                <h2 className={styles.sectionTitle}>Личные данные</h2>

                {!isEditing ? (
                  <div className={styles.profileInfo}>
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Имя</span>
                      <span className={styles.value}>{user?.name}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Email</span>
                      <span className={styles.value}>{user?.email}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Роль</span>
                      <span className={styles.value}>
                        {user?.role === 'admin' ? 'Администратор' : 'Пользователь'}
                      </span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Дата регистрации</span>
                      <span className={styles.value}>
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : '—'}
                      </span>
                    </div>
                    <button className={styles.editButton} onClick={() => setIsEditing(true)}>
                      Редактировать
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className={styles.editForm}>
                    <div className={styles.formGroup}>
                      <label>Имя (до 30 символов)</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={errors.name ? styles.error : ''}
                        maxLength={30}
                      />
                      {errors.name && <div className={styles.errorText}>{errors.name}</div>}
                    </div>

                    <div className={styles.formGroup}>
                      <label>Email (до 40 символов)</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? styles.error : ''}
                        maxLength={40}
                      />
                      {errors.email && <div className={styles.errorText}>{errors.email}</div>}
                    </div>

                    <div className={styles.sectionSubtitle}>Смена пароля</div>
                    <div className={styles.formHint}>Оставьте поля пустыми, если не хотите менять пароль</div>

                    <div className={styles.formGroup}>
                      <label>Текущий пароль</label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className={errors.currentPassword ? styles.error : ''}
                      />
                      {errors.currentPassword && <div className={styles.errorText}>{errors.currentPassword}</div>}
                    </div>

                    <div className={styles.formGroup}>
                      <label>Новый пароль (мин. 6 символов + спецсимвол)</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className={errors.newPassword ? styles.error : ''}
                      />
                      {errors.newPassword && <div className={styles.errorText}>{errors.newPassword}</div>}
                    </div>

                    <div className={styles.formGroup}>
                      <label>Подтверждение пароля</label>
                      <input
                        type="password"
                        name="confirmNewPassword"
                        value={formData.confirmNewPassword}
                        onChange={handleChange}
                        className={errors.confirmNewPassword ? styles.error : ''}
                      />
                      {errors.confirmNewPassword && <div className={styles.errorText}>{errors.confirmNewPassword}</div>}
                    </div>

                    <div className={styles.buttonGroup}>
                      <button type="submit" className={styles.saveButton} disabled={loading}>
                        {loading ? 'Сохранение...' : 'Сохранить'}
                      </button>
                      <button type="button" className={styles.cancelButton} onClick={handleCancel}>
                        Отмена
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Вкладка заявок на консультацию */}
            {activeTab === 'consultations' && (
              <div className={styles.consultationsSection}>
                <h2 className={styles.sectionTitle}>Заявки на консультацию</h2>
                {loadingConsultations ? (
                  <div className={styles.loading}>Загрузка заявок...</div>
                ) : consultations.length === 0 ? (
                  <div className={styles.noData}>
                    <p>У вас пока нет заявок на консультацию</p>
                    <p className={styles.hint}>Заполните форму на главной странице, чтобы получить консультацию</p>
                  </div>
                ) : (
                  <div className={styles.requestsList}>
                    {consultations.map((consultation) => (
                      <div key={consultation.id} className={styles.requestCard}>
                        <div className={styles.requestHeader}>
                          <span className={styles.requestDate}>
                            {new Date(consultation.createdAt).toLocaleString('ru-RU')}
                          </span>
                          <span className={`${styles.requestStatus} ${getStatusClass(consultation.status)}`}>
                            {getStatusText(consultation.status)}
                          </span>
                        </div>
                        <div className={styles.requestBody}>
                          <p><strong>Имя:</strong> {consultation.name}</p>
                          <p><strong>Телефон:</strong> {consultation.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Вкладка заявок на услуги */}
            {activeTab === 'services' && (
              <div className={styles.servicesSection}>
                <h2 className={styles.sectionTitle}>Заявки на услуги</h2>
                {loadingServices ? (
                  <div className={styles.loading}>Загрузка заявок...</div>
                ) : serviceRequests.length === 0 ? (
                  <div className={styles.noData}>
                    <p>У вас пока нет заявок на услуги</p>
                    <p className={styles.hint}>Перейдите в раздел "Услуги" и оставьте заявку</p>
                  </div>
                ) : (
                  <div className={styles.requestsList}>
                    {serviceRequests.map((request) => (
                      <div key={request.id} className={styles.requestCard}>
                        <div className={styles.requestHeader}>
                          <span className={styles.requestDate}>
                            {new Date(request.createdAt).toLocaleString('ru-RU')}
                          </span>
                          <span className={`${styles.requestStatus} ${getStatusClass(request.status)}`}>
                            {getStatusText(request.status)}
                          </span>
                        </div>
                        <div className={styles.requestBody}>
                          <p><strong>Услуга:</strong> {request.serviceName}</p>
                          <p><strong>Имя:</strong> {request.name}</p>
                          <p><strong>Телефон:</strong> {request.phone}</p>
                          {request.comment && (
                            <p><strong>Комментарий:</strong> {request.comment}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'equipment' && (
              <div className={styles.equipmentSection}>
                <h2 className={styles.sectionTitle}>Заказы оборудования</h2>
                {loadingEquipment ? (
                  <div className={styles.loading}>Загрузка заказов...</div>
                ) : equipmentOrders.length === 0 ? (
                  <div className={styles.noData}>
                    <p>У вас пока нет заказов оборудования</p>
                    <p className={styles.hint}>Перейдите в раздел "Каталог" и оформите заказ</p>
                  </div>
                ) : (
                  <div className={styles.requestsList}>
                    {equipmentOrders.map((order) => (
                      <div key={order.id} className={styles.requestCard}>
                        <div className={styles.requestHeader}>
                          <span className={styles.requestDate}>
                            {new Date(order.createdAt).toLocaleString('ru-RU')}
                          </span>
                          <span className={`${styles.requestStatus} ${getStatusClass(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        <div className={styles.requestBody}>
                          <p><strong>Товар:</strong> {order.productName}</p>
                          <p><strong>Имя:</strong> {order.name}</p>
                          <p><strong>Телефон:</strong> {order.phone}</p>
                          {order.comment && (
                            <p><strong>Ваш комментарий:</strong> {order.comment}</p>
                          )}
                          {order.adminComment && (
                            <p><strong>Комментарий администратора:</strong> {order.adminComment}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default UserCabinet;