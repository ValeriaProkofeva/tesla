import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useChat } from '../context/ChatContext';
import { useToast } from '../context/ToastContext';
import styles from './ManagerPanel.module.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import ManagerChat from './ManagerChat';


const ManagerPanel = () => {
  const { user, logout } = useAuth();
  const { openChat, fetchChats, totalUnread } = useChat();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('consultations');
  const { success, error: showError } = useToast(); 
  const [consultations, setConsultations] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [equipmentOrders, setEquipmentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editingComment, setEditingComment] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [editingOrderComment, setEditingOrderComment] = useState(null);
  const [orderCommentText, setOrderCommentText] = useState('');

  useEffect(() => {
    fetchConsultations();
    fetchServiceRequests();
    fetchEquipmentOrders();
  }, []);

  const handleOpenChatFromRequest = async (userId, userName) => {
    if (!userId) {
      showError('Не удалось определить пользователя');
      return;
    }

    const roomId = await openChat(userId, userName);
    if (roomId) {
      success(`Чат с ${userName} открыт`);
      setActiveTab('chat');
      await fetchChats();
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
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/service-requests/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServiceRequests(response.data.requests);
    } catch (error) {
      console.error('Error fetching service requests:', error);
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
    },
  };

  return (
    <>
      <Header />
      <div className={styles.managerContainer}>
        <div className={styles.managerWrapper}>

           <div className={styles.sidebar}>
            <div className={styles.managerInfo}>
              <div className={styles.managerAvatar}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h3 className={styles.managerName}>{user?.name}</h3>
              <p className={styles.managerEmail}>{user?.email}</p>
              <p className={styles.managerRole}>Менеджер</p>
            </div>

            <nav className={styles.sidebarNav}>
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
                Заказы оборудования
                {stats.equipment.new > 0 && (
                  <span className={styles.badge}>{stats.equipment.new}</span>
                )}
              </button>
              <button
                className={`${styles.sidebarItem} ${activeTab === 'chat' ? styles.active : ''}`}
                onClick={() => setActiveTab('chat')}
              >
                Чаты с клиентами
                {totalUnread && totalUnread() > 0 && (
                  <span className={styles.badge}>{totalUnread()}</span>
                )}
              </button>
            </nav>
          </div>

          <div className={styles.mainContent}>
            {message.text && (
              <div className={`${styles.message} ${styles[message.type]}`}>
                {message.text}
              </div>
            )}

            {activeTab === 'chat' && <ManagerChat />}

            {activeTab === 'consultations' && (
              <>
                <div className={styles.statsSection}>
                  <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                      <div className={styles.statValue}>{stats.consultations.total}</div>
                      <div className={styles.statLabel}>Всего заявок</div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statValue}>{stats.consultations.new}</div>
                      <div className={styles.statLabel}>Новых</div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statValue}>{stats.consultations.processing}</div>
                      <div className={styles.statLabel}>В обработке</div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statValue}>{stats.consultations.completed}</div>
                      <div className={styles.statLabel}>Завершено</div>
                    </div>
                  </div>
                </div>

                <div className={styles.tableSection}>
                  <h2 className={styles.sectionTitle}>Заявки на консультацию</h2>
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
                          <th>Чат</th>
                          <th>Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {consultations.map((item) => ( 
                          <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{new Date(item.createdAt).toLocaleString('ru-RU')}</td>
                            <td>
                              {item.user?.email || 'Неизвестно'}
                              <br />
                              <small>{item.user?.name}</small>
                            </td>
                            <td>{item.name}</td>
                            <td>{item.phone}</td>
                            <td>
                              <span className={`${styles.statusBadge} ${getStatusClass(item.status)}`}>
                                {getStatusText(item.status)}
                              </span>
                            </td>
                            <td>
                              <button
                                className={styles.chatButton}
                                onClick={() => handleOpenChatFromRequest(
                                  item.userId,          
                                  item.user?.name || item.name
                                )}
                                title="Открыть чат с клиентом"
                              >
                                Чат
                              </button>
                            </td>
                            <td>
                              <select
                                value={item.status}
                                onChange={(e) => updateConsultationStatus(item.id, e.target.value)}
                                className={styles.statusSelect}
                              >
                                <option value="new">Новая</option>
                                <option value="processing">В обработке</option>
                                <option value="completed">Завершена</option>
                                <option value="cancelled">Отменена</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'services' && (
              <>
                <div className={styles.statsSection}>
                  <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                      <div className={styles.statValue}>{stats.services.total}</div>
                      <div className={styles.statLabel}>Всего заявок</div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statValue}>{stats.services.new}</div>
                      <div className={styles.statLabel}>Новых</div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statValue}>{stats.services.processing}</div>
                      <div className={styles.statLabel}>В обработке</div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statValue}>{stats.services.completed}</div>
                      <div className={styles.statLabel}>Завершено</div>
                    </div>
                  </div>
                </div>
                <div className={styles.tableSection}>
                  <h2 className={styles.sectionTitle}>Заявки на услуги</h2>
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
                          <th>Чат</th>
                          <th>Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {serviceRequests.map((item) => ( 
                          <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{new Date(item.createdAt).toLocaleString('ru-RU')}</td>
                            <td>
                              {item.user?.email || 'Неизвестно'}
                              <br />
                              <small>{item.user?.name}</small>
                            </td>
                            <td>{item.serviceName}</td>
                            <td>{item.name}</td>
                            <td>{item.phone}</td>
                            <td>
                              <span className={`${styles.statusBadge} ${getStatusClass(item.status)}`}>
                                {getStatusText(item.status)}
                              </span>
                            </td>
                            <td>
                              <button
                                className={styles.chatButton}
                                onClick={() => handleOpenChatFromRequest(
                                  item.userId,   
                                  item.user?.name || item.name
                                )}
                                title="Открыть чат с клиентом"
                              >
                                Чат
                              </button>
                            </td>
                            <td>
                              <select
                                value={item.status}
                                onChange={(e) => updateServiceRequest(item.id, e.target.value, null)}
                                className={styles.statusSelect}
                              >
                                <option value="new">Новая</option>
                                <option value="processing">В обработке</option>
                                <option value="completed">Завершена</option>
                                <option value="cancelled">Отменена</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'equipment' && (
              <>
                <div className={styles.statsSection}>
                  <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                      <div className={styles.statValue}>{stats.equipment.total}</div>
                      <div className={styles.statLabel}>Всего заказов</div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statValue}>{stats.equipment.new}</div>
                      <div className={styles.statLabel}>Новых</div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statValue}>{stats.equipment.processing}</div>
                      <div className={styles.statLabel}>В обработке</div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statValue}>{stats.equipment.completed}</div>
                      <div className={styles.statLabel}>Завершено</div>
                    </div>
                  </div>
                </div>
                <div className={styles.tableSection}>
                  <h2 className={styles.sectionTitle}>Заказы оборудования</h2>
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
                          <th>Статус</th>
                          <th>Чат</th>
                          <th>Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {equipmentOrders.map((item) => (  
                          <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{new Date(item.createdAt).toLocaleString('ru-RU')}</td>
                            <td>
                              {item.user?.email || 'Неизвестно'}
                              <br />
                              <small>{item.user?.name}</small>
                            </td>
                            <td style={{ maxWidth: '200px' }}>{item.productName}</td>
                            <td>{item.name}</td>
                            <td>{item.phone}</td>
                            <td>
                              <span className={`${styles.statusBadge} ${getStatusClass(item.status)}`}>
                                {getStatusText(item.status)}
                              </span>
                            </td>
                            <td>
                              <button
                                className={styles.chatButton}
                                onClick={() => handleOpenChatFromRequest(
                                  item.userId,       
                                  item.user?.name || item.name
                                )}
                                title="Открыть чат с клиентом"
                              >
                                Чат
                              </button>
                            </td>
                            <td>
                              <select
                                value={item.status}
                                onChange={(e) => updateEquipmentOrder(item.id, e.target.value, null)}
                                className={styles.statusSelect}
                              >
                                <option value="new">Новая</option>
                                <option value="processing">В обработке</option>
                                <option value="completed">Завершена</option>
                                <option value="cancelled">Отменена</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ManagerPanel;