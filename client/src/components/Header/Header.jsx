import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import LoginModal from '../Modals/LoginModal';
import RegisterModal from '../Modals/RegisterModal';
import { useAuth } from '../context/AuthContext';

function Header() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleRegisterClick = () => {
    setShowRegister(true);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const handleAvatarClick = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleCabinetClick = () => {
    if (user?.role === 'admin') {
      navigate('/admin');
    } else if (user?.role === 'manager') {
      navigate('/manager');
    } else {
      navigate('/cabinet');
    }
    setShowUserMenu(false);
  };

  const getInitial = () => {
    return user?.name?.charAt(0).toUpperCase() || '?';
  };

  const navigateToHome = () => {
    navigate('/');
  };

  const navigateToCatalog = () => {
    navigate('/catalog');
  };

  const navigateToServices = () => {
    navigate('/services');
  };

  const navigateToWorks = () => {
    navigate('/works');
  };

  return (
    <>
      <div className={styles.HeaderContainer}>
        <div className={styles.HeaderLeft}>
          <div className={styles.logo} onClick={navigateToHome} style={{ cursor: 'pointer' }}>
            <img className={styles.logoImg} src="/images/logo.svg" alt="логотип" />
            <p className={styles.logoTxt}>Тесла</p>
          </div>
        </div>
        <div className={styles.HeaderNav}>
          <nav>
            <p
              className={styles.NavTxt}
              onClick={navigateToHome}
              style={{ cursor: 'pointer' }}
            >
              Главная
            </p>
            <p
              className={styles.NavTxt}
              onClick={navigateToCatalog}
              style={{ cursor: 'pointer' }}
            >
              Каталог продукции
            </p>
            <p
              className={styles.NavTxt}
              onClick={navigateToServices}
              style={{ cursor: 'pointer' }}
            >
              Услуги
            </p>
            <p
              className={styles.NavTxt}
              onClick={navigateToWorks}
              style={{ cursor: 'pointer' }}
            >
              Наши работы
            </p>
          </nav>
        </div>
        <div className={styles.HeaderButton}>
          {!user ? (
            <button className={styles.HeaderBut} onClick={handleLoginClick}>
              Войти
            </button>
          ) : (
            <div className={styles.avatarContainer}>
              <div className={styles.avatar} onClick={handleAvatarClick}>
                {getInitial()}
              </div>
              {showUserMenu && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.userInfo}>
                    <p className={styles.userName}>{user.name}</p>
                    <p className={styles.userEmail}>{user.email}</p>
                    <p className={styles.userRole}>
                      {user.role === 'admin' && 'Администратор'}
                      {user.role === 'manager' && 'Менеджер'}
                      {user.role === 'user' && 'Пользователь'}
                    </p>
                  </div>
                  <div className={styles.menuItems}>
                    <button className={styles.menuItem} onClick={handleCabinetClick}>
                      {user.role === 'admin' ? 'Админ-панель' : 'Личный кабинет'}
                    </button>
                    <button className={styles.menuItemLogout} onClick={handleLogout}>
                      Выйти
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
      />

      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />
    </>
  );
}

export default Header;