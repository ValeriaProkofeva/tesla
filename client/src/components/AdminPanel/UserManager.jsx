import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import AdminPasswordModal from '../Modals/AdminPasswordModal';
import ChangePasswordModal from '../Modals/ChangePasswordModal';
import styles from './AdminPanel.module.css';

const UserManager = () => {
  const { success, error: showError } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [showAdminPasswordModal, setShowAdminPasswordModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [pendingData, setPendingData] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    role: 'user',
  });

    useEffect(() => {
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
      showError('Ошибка при загрузке пользователей');
    } finally {
      setLoading(false);
    }
  };

  // Функция обновления пользователя
  const handleUpdateUser = async (adminPassword) => {
    const token = localStorage.getItem('token');
    await axios.put(
      `http://localhost:5000/api/admin/users/${editingUser.id}`,
      {
        name: editFormData.name,
        email: editFormData.email,
        role: editFormData.role,
        adminPassword,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setEditingUser(null);
  };

  // Функция блокировки/разблокировки - замыкаем user и newBlockedStatus
  const createToggleBlockHandler = (user, newBlockedStatus) => async (adminPassword) => {
    const token = localStorage.getItem('token');
    await axios.patch(
      `http://localhost:5000/api/admin/users/${user.id}/block`,
      {
        isBlocked: newBlockedStatus,
        adminPassword,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };

  // Функция удаления - замыкаем user
  const createDeleteHandler = (user) => async (adminPassword) => {
    if (!window.confirm(`Вы уверены, что хотите удалить пользователя "${user.name}"?`)) {
      throw new Error('Отменено пользователем');
    }
    
    const token = localStorage.getItem('token');
    await axios({
      method: 'delete',
      url: `http://localhost:5000/api/admin/users/${user.id}`,
      headers: { Authorization: `Bearer ${token}` },
      data: { adminPassword }
    });
  };

  // Функция смены пароля - замыкаем user
  const createChangePasswordHandler = (user, newPassword) => async (adminPassword) => {
    const token = localStorage.getItem('token');
    await axios.put(
      `http://localhost:5000/api/admin/users/${user.id}/password`,
      {
        newPassword,
        adminPassword,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setSelectedUser(null);
  };

  // Общий обработчик для подтверждения админа
  const handleAdminConfirm = async (adminPassword) => {
    if (!pendingAction) return;
    
    try {
      await pendingAction(adminPassword);
      await fetchUsers();
      success('Операция выполнена успешно');
      setPendingAction(null);
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Ошибка при выполнении операции';
      showError(errorMessage);
      throw error;
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  };

  // Открываем модальное окно для смены пароля
  const openChangePasswordModal = (user) => {
    setSelectedUser(user);
    setShowChangePasswordModal(true);
  };

  // После ввода нового пароля - создаем действие и открываем окно ввода пароля админа
  const handleChangePasswordStart = async (newPassword) => {
    const action = createChangePasswordHandler(selectedUser, newPassword);
    setPendingAction(() => action);
    setShowChangePasswordModal(false);
    setShowAdminPasswordModal(true);
  };

  const getRoleText = (role) => {
    return role === 'admin' ? 'Администратор' : 'Пользователь';
  };

  // Выполнить действие с подтверждением пароля админа
  const executeWithAdminPassword = (action) => {
    setPendingAction(() => action);
    setShowAdminPasswordModal(true);
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка пользователей...</div>;
  }

  return (
    <div className={styles.userManager}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Управление пользователями</h2>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Email</th>
              <th>Роль</th>
              <th>Статус</th>
              <th>Дата регистрации</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className={user.isBlocked ? styles.blockedRow : ''}>
                <td>{user.id}</td>
                <td>
                  {editingUser?.id === user.id ? (
                    <input
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className={styles.editInput}
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td>
                  {editingUser?.id === user.id ? (
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      className={styles.editInput}
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td>
                  {editingUser?.id === user.id ? (
                    <select
                      value={editFormData.role}
                      onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                      className={styles.editSelect}
                    >
                      <option value="user">Пользователь</option>
                      <option value="admin">Администратор</option>
                    </select>
                  ) : (
                    <span className={user.role === 'admin' ? styles.adminBadge : styles.userBadge}>
                      {getRoleText(user.role)}
                    </span>
                  )}
                </td>
                <td>
                  <span className={user.isBlocked ? styles.blockedBadge : styles.activeBadge}>
                    {user.isBlocked ? 'Заблокирован' : 'Активен'}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString('ru-RU')}</td>
                <td>
                  <div className={styles.userActions}>
                    {editingUser?.id === user.id ? (
                      <>
                        <button
                          className={styles.saveButton}
                          onClick={() => executeWithAdminPassword(handleUpdateUser, user)}
                        >
                          Сохранить
                        </button>
                        <button
                          className={styles.cancelButton}
                          onClick={() => setEditingUser(null)}
                        >
                          Отмена
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className={styles.editButton}
                          onClick={() => handleEditUser(user)}
                        >
                          Редактировать
                        </button>
                        <button
                          className={styles.passwordButton}
                          onClick={() => openChangePasswordModal(user)}
                        >
                          Сменить пароль
                        </button>
                        <button
                          className={user.isBlocked ? styles.unblockButton : styles.blockButton}
                          onClick={() => executeWithAdminPassword(createToggleBlockHandler(user, !user.isBlocked))}
                        >
                          {user.isBlocked ? 'Разблокировать' : 'Заблокировать'}
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => executeWithAdminPassword(createDeleteHandler(user))}
                        >
                          Удалить
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminPasswordModal
        isOpen={showAdminPasswordModal}
        onClose={() => {
          setShowAdminPasswordModal(false);
          setPendingAction(null);
          setPendingData(null);
        }}
        onConfirm={handleAdminConfirm}
        title="Подтверждение действия"
        message="Для выполнения этого действия введите пароль администратора"
      />

      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => {
          setShowChangePasswordModal(false);
          setSelectedUser(null);
        }}
        onConfirm={handleChangePasswordStart}
        userName={selectedUser?.name}
      />
    </div>
  );
};

export default UserManager;