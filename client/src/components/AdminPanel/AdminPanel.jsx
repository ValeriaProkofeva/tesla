import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './AdminPanel.module.css';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import ProductManager from './ProductManager';
import UserManager from './UserManager';
import StatsCards from './StatsCards';

const AdminPanel = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('consultations');
  const [consultations, setConsultations] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editingComment, setEditingComment] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [equipmentOrders, setEquipmentOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [orderCommentText, setOrderCommentText] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchConsultations();
    fetchServiceRequests();
    fetchEquipmentOrders();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchEquipmentOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/equipment-orders/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEquipmentOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching equipment orders:', error);
    }
  };

  const updateEquipmentOrder = async (id, status, adminComment) => {
    try {
      const token = localStorage.getItem('token');
      const updateData = {};
      if (status) updateData.status = status;
      if (adminComment !== undefined) updateData.adminComment = adminComment;

      await axios.put(
        `http://localhost:5000/api/equipment-orders/${id}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage({ type: 'success', text: 'Заказ обновлен' });
      fetchEquipmentOrders();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error updating equipment order:', error);
      setMessage({ type: 'error', text: 'Ошибка при обновлении заказа' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const deleteEquipmentOrder = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот заказ?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/equipment-orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage({ type: 'success', text: 'Заказ удален' });
      fetchEquipmentOrders();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error deleting equipment order:', error);
      setMessage({ type: 'error', text: 'Ошибка при удалении заказа' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const fetchConsultations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/consultations/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConsultations(response.data.consultations);
    } catch (error) {
      console.error('Error fetching consultations:', error);
      setMessage({ type: 'error', text: 'Ошибка при загрузке заявок' });
    }
  };

  const fetchServiceRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/service-requests/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServiceRequests(response.data.requests);
    } finally {
      setLoading(false);
    }
  };

  const updateConsultationStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/consultations/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage({ type: 'success', text: 'Статус заявки обновлен' });
      fetchConsultations();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error updating status:', error);
      setMessage({ type: 'error', text: 'Ошибка при обновлении статуса' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const updateServiceRequest = async (id, status, comment) => {
    try {
      const token = localStorage.getItem('token');
      const updateData = {};
      if (status) updateData.status = status;
      if (comment !== undefined) updateData.comment = comment;

      await axios.put(
        `http://localhost:5000/api/service-requests/${id}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage({ type: 'success', text: 'Заявка обновлена' });
      fetchServiceRequests();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error updating service request:', error);
      setMessage({ type: 'error', text: 'Ошибка при обновлении заявки' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const deleteConsultation = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту заявку?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/consultations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage({ type: 'success', text: 'Заявка удалена' });
      fetchConsultations();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error deleting consultation:', error);
      setMessage({ type: 'error', text: 'Ошибка при удалении заявки' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const deleteServiceRequest = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту заявку?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/service-requests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage({ type: 'success', text: 'Заявка удалена' });
      fetchServiceRequests();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error deleting service request:', error);
      setMessage({ type: 'error', text: 'Ошибка при удалении заявки' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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

  const stats = {
    consultations: {
      total: consultations.length,
      new: consultations.filter(c => c.status === 'new').length,
      processing: consultations.filter(c => c.status === 'processing').length,
      completed: consultations.filter(c => c.status === 'completed').length,
    },
    services: {
      total: serviceRequests.length,
      new: serviceRequests.filter(s => s.status === 'new').length,
      processing: serviceRequests.filter(s => s.status === 'processing').length,
      completed: serviceRequests.filter(s => s.status === 'completed').length,
    },
    equipment: {
      total: equipmentOrders.length,
      new: equipmentOrders.filter(o => o.status === 'new').length,
      processing: equipmentOrders.filter(o => o.status === 'processing').length,
      completed: equipmentOrders.filter(o => o.status === 'completed').length,
    }
  };

  return (
    <>
      <Header></Header>
      <div className={styles.adminContainer}>
        <div className={styles.adminWrapper}>
          {/* Боковое меню */}
          <div className={styles.sidebar}>
            <div className={styles.adminInfo}>
              <div className={styles.adminAvatar}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h3 className={styles.adminName}>{user?.name}</h3>
              <p className={styles.adminEmail}>{user?.email}</p>
            </div>

            <nav className={styles.sidebarNav}>
              <button
                className={`${styles.sidebarItem} ${activeTab === 'users' ? styles.active : ''}`}
                onClick={() => setActiveTab('users')}
              >
                <span className={styles.sidebarIcon}>Пользователи</span>
              </button>
              <button
                className={`${styles.sidebarItem} ${activeTab === 'consultations' ? styles.active : ''}`}
                onClick={() => setActiveTab('consultations')}
              >
                Заявки на консультацию
                {stats.consultations.new > 0 && (
                  <span className={styles.badge}>{stats.consultations.new}</span>
                )}
              </button>
              <button
                className={`${styles.sidebarItem} ${activeTab === 'services' ? styles.active : ''}`}
                onClick={() => setActiveTab('services')}
              >
                Заявки на услуги
                {stats.services.new > 0 && (
                  <span className={styles.badge}>{stats.services.new}</span>
                )}
              </button>
              <button
                className={`${styles.sidebarItem} ${activeTab === 'equipment' ? styles.active : ''}`}
                onClick={() => setActiveTab('equipment')}
              >
                <span className={styles.sidebarIcon}>Заказы</span>
                {stats.equipment.new > 0 && (
                  <span className={styles.badge}>{stats.equipment.new}</span>
                )}
              </button>
              <button
                className={`${styles.sidebarItem} ${activeTab === 'products' ? styles.active : ''}`}
                onClick={() => setActiveTab('products')}
              >
                <span className={styles.sidebarIcon}>Товары</span>
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

            {/* Статистика */}
            {activeTab === 'consultations' && (
              <StatsCards
                type="consultations"
                consultations={stats.consultations}
              />
            )}

            {activeTab === 'services' && (
              <StatsCards
                type="services"
                services={stats.services}
              />
            )}

            {activeTab === 'equipment' && (
              <StatsCards
                type="equipment"
                equipment={stats.equipment}
              />
            )}

            {activeTab === 'users' && (
              <StatsCards
                type="users"
                users={users}
              />
            )}

            {/* Таблица заявок на консультацию */}
            {activeTab === 'consultations' && (
              <div className={styles.tableSection}>
                <h2 className={styles.sectionTitle}>Заявки на консультацию</h2>
                {loading ? (
                  <div className={styles.loading}>Загрузка...</div>
                ) : consultations.length === 0 ? (
                  <div className={styles.noData}>Нет заявок</div>
                ) : (
                  <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Дата</th>
                          <th>Пользователь</th>
                          <th>Имя</th>
                          <th>Телефон</th>
                          <th>Статус</th>
                          <th>Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {consultations.map((consultation) => (
                          <tr key={consultation.id}>
                            <td>{consultation.id}</td>
                            <td>{new Date(consultation.createdAt).toLocaleString('ru-RU')}</td>
                            <td>
                              {consultation.user?.email || 'Неизвестно'}
                              <br />
                              <small>{consultation.user?.name}</small>
                            </td>
                            <td>{consultation.name}</td>
                            <td>{consultation.phone}</td>
                            <td>
                              <span className={`${styles.statusBadge} ${getStatusClass(consultation.status)}`}>
                                {getStatusText(consultation.status)}
                              </span>
                            </td>
                            <td>
                              <select
                                value={consultation.status}
                                onChange={(e) => updateConsultationStatus(consultation.id, e.target.value)}
                                className={styles.statusSelect}
                              >
                                <option value="new">Новая</option>
                                <option value="processing">В обработке</option>
                                <option value="completed">Завершена</option>
                                <option value="cancelled">Отменена</option>
                              </select>
                              <button
                                onClick={() => deleteConsultation(consultation.id)}
                                className={styles.deleteButton}
                              >
                                Удалить
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Таблица заявок на услуги */}
            {activeTab === 'services' && (
              <div className={styles.tableSection}>
                <h2 className={styles.sectionTitle}>Заявки на услуги</h2>
                {loading ? (
                  <div className={styles.loading}>Загрузка...</div>
                ) : serviceRequests.length === 0 ? (
                  <div className={styles.noData}>Нет заявок</div>
                ) : (
                  <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Дата</th>
                          <th>Пользователь</th>
                          <th>Услуга</th>
                          <th>Имя</th>
                          <th>Телефон</th>
                          <th>Статус</th>
                          <th>Комментарий</th>
                          <th>Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {serviceRequests.map((request) => (
                          <tr key={request.id}>
                            <td>{request.id}</td>
                            <td>{new Date(request.createdAt).toLocaleString('ru-RU')}</td>
                            <td>
                              {request.user?.email || 'Неизвестно'}
                              <br />
                              <small>{request.user?.name}</small>
                            </td>
                            <td>{request.serviceName}</td>
                            <td>{request.name}</td>
                            <td>{request.phone}</td>
                            <td>
                              <span className={`${styles.statusBadge} ${getStatusClass(request.status)}`}>
                                {getStatusText(request.status)}
                              </span>
                            </td>
                            <td>
                              {editingComment === request.id ? (
                                <div className={styles.commentEdit}>
                                  <textarea
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    rows={2}
                                    className={styles.commentTextarea}
                                  />
                                  <div className={styles.commentButtons}>
                                    <button
                                      onClick={() => {
                                        updateServiceRequest(request.id, null, commentText);
                                        setEditingComment(null);
                                        setCommentText('');
                                      }}
                                      className={styles.saveCommentBtn}
                                    >
                                      Сохранить
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditingComment(null);
                                        setCommentText('');
                                      }}
                                      className={styles.cancelCommentBtn}
                                    >
                                      Отмена
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div className={styles.commentText}>
                                    {request.comment || '—'}
                                  </div>
                                  <button
                                    onClick={() => {
                                      setEditingComment(request.id);
                                      setCommentText(request.comment || '');
                                    }}
                                    className={styles.editCommentBtn}
                                  >
                                    {request.comment ? 'Редактировать' : 'Добавить'}
                                  </button>
                                </div>
                              )}
                            </td>
                            <td>
                              <select
                                value={request.status}
                                onChange={(e) => updateServiceRequest(request.id, e.target.value, null)}
                                className={styles.statusSelect}
                              >
                                <option value="new">Новая</option>
                                <option value="processing">В обработке</option>
                                <option value="completed">Завершена</option>
                                <option value="cancelled">Отменена</option>
                              </select>
                              <button
                                onClick={() => deleteServiceRequest(request.id)}
                                className={styles.deleteButton}
                              >
                                Удалить
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'equipment' && (
              <div className={styles.tableSection}>
                <h2 className={styles.sectionTitle}>Заказы оборудования</h2>
                {loading ? (
                  <div className={styles.loading}>Загрузка...</div>
                ) : equipmentOrders.length === 0 ? (
                  <div className={styles.noData}>Нет заказов</div>
                ) : (
                  <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Дата</th>
                          <th>Пользователь</th>
                          <th>Товар</th>
                          <th>Имя</th>
                          <th>Телефон</th>
                          <th>Комментарий</th>
                          <th>Статус</th>
                          <th>Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {equipmentOrders.map((order) => (
                          <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{new Date(order.createdAt).toLocaleString('ru-RU')}</td>
                            <td>
                              {order.user?.email || 'Неизвестно'}
                              <br />
                              <small>{order.user?.name}</small>
                            </td>
                            <td style={{ maxWidth: '200px' }}>{order.productName}</td>
                            <td>{order.name}</td>
                            <td>{order.phone}</td>
                            <td style={{ maxWidth: '200px' }}>
                              {order.comment && <div><strong>От клиента:</strong> {order.comment}</div>}
                              {editingOrder === order.id ? (
                                <div className={styles.commentEdit}>
                                  <textarea
                                    value={orderCommentText}
                                    onChange={(e) => setOrderCommentText(e.target.value)}
                                    rows={2}
                                    className={styles.commentTextarea}
                                    placeholder="Ответ администратора..."
                                  />
                                  <div className={styles.commentButtons}>
                                    <button
                                      onClick={() => {
                                        updateEquipmentOrder(order.id, null, orderCommentText);
                                        setEditingOrder(null);
                                        setOrderCommentText('');
                                      }}
                                      className={styles.saveCommentBtn}
                                    >
                                      Сохранить
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditingOrder(null);
                                        setOrderCommentText('');
                                      }}
                                      className={styles.cancelCommentBtn}
                                    >
                                      Отмена
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  {order.adminComment && <div><strong>Ответ:</strong> {order.adminComment}</div>}
                                  <button
                                    onClick={() => {
                                      setEditingOrder(order.id);
                                      setOrderCommentText(order.adminComment || '');
                                    }}
                                    className={styles.editCommentBtn}
                                  >
                                    {order.adminComment ? 'Редактировать ответ' : 'Добавить ответ'}
                                  </button>
                                </div>
                              )}
                            </td>
                            <td>
                              <span className={`${styles.statusBadge} ${getStatusClass(order.status)}`}>
                                {getStatusText(order.status)}
                              </span>
                            </td>
                            <td>
                              <select
                                value={order.status}
                                onChange={(e) => updateEquipmentOrder(order.id, e.target.value, null)}
                                className={styles.statusSelect}
                              >
                                <option value="new">Новая</option>
                                <option value="processing">В обработке</option>
                                <option value="completed">Завершена</option>
                                <option value="cancelled">Отменена</option>
                              </select>
                              <button
                                onClick={() => deleteEquipmentOrder(order.id)}
                                className={styles.deleteButton}
                              >
                                Удалить
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'users' && <UserManager />}
            {activeTab === 'products' && <ProductManager />}
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default AdminPanel;