import React from 'react';
import styles from './StatsCards.module.css';

const StatsCards = ({ type, consultations, services, equipment, users }) => {
  const getPercentage = (value, total) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  // Статистика для консультаций
  if (type === 'consultations') {
    const statsData = [
  {
    title: 'Всего консультаций',
    value: consultations.total,
    color: '#4A4FB9',  // фирменный синий, но не яркий
    detail: 'Всего обращений'
  },
  {
    title: 'Новые',
    value: consultations.new,
    color: '#6c7a89',  // сдержанный серый
    detail: 'Требуют внимания'
  },
  {
    title: 'В обработке',
    value: consultations.processing,
    color: '#4A4FB9',  // фирменный синий
    detail: 'Активные заявки'
  },
  {
    title: 'Завершено',
    value: consultations.completed,
    color: '#10b981',  // приглушенный зеленый
    detail: 'Успешно выполнено'
  }
];

    return (
      <div className={styles.statsContainer}>
        <div className={styles.statsGrid}>
          {statsData.map((stat, index) => (
            <div key={stat.title} className={styles.statCard} style={{ animationDelay: `${index * 0.1}s` }}>
              <div className={styles.cardIcon} style={{ backgroundColor: stat.color }}>
                {stat.icon}
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardValue}>{stat.value}</div>
                <div className={styles.cardTitle}>{stat.title}</div>
                <div className={styles.cardDetail}>{stat.detail}</div>
              </div>
              <div className={styles.cardProgress} style={{ background: stat.gradient }} />
            </div>
          ))}
        </div>

        {/* Прогресс-бары по статусам */}
        <div className={styles.statusBreakdown}>
          <h4 className={styles.breakdownTitle}>Распределение по статусам</h4>
          <div className={styles.statusBarItem}>
            <div className={styles.statusBarLabel}>
              <span>Новые</span>
              <span>{consultations.new}</span>
            </div>
            <div className={styles.statusBarTrack}>
              <div className={`${styles.statusBarFill} ${styles.fillNew}`} style={{ width: `${getPercentage(consultations.new, consultations.total)}%` }} />
            </div>
          </div>
          <div className={styles.statusBarItem}>
            <div className={styles.statusBarLabel}>
              <span>В обработке</span>
              <span>{consultations.processing}</span>
            </div>
            <div className={styles.statusBarTrack}>
              <div className={`${styles.statusBarFill} ${styles.fillProcessing}`} style={{ width: `${getPercentage(consultations.processing, consultations.total)}%` }} />
            </div>
          </div>
          <div className={styles.statusBarItem}>
            <div className={styles.statusBarLabel}>
              <span>Завершено</span>
              <span>{consultations.completed}</span>
            </div>
            <div className={styles.statusBarTrack}>
              <div className={`${styles.statusBarFill} ${styles.fillCompleted}`} style={{ width: `${getPercentage(consultations.completed, consultations.total)}%` }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Статистика для услуг
  if (type === 'services') {
    const statsData = [
      { title: 'Всего заявок', value: services.total, detail: 'Всего обращений' },
      { title: 'Новые', value: services.new,   detail: 'Требуют внимания' },
      { title: 'В обработке', value: services.processing,  detail: 'Активные заявки' },
      { title: 'Завершено', value: services.completed,  detail: 'Успешно выполнено' }
    ];

    return (
      <div className={styles.statsContainer}>
        <div className={styles.statsGrid}>
          {statsData.map((stat, index) => (
            <div key={stat.title} className={styles.statCard} style={{ animationDelay: `${index * 0.1}s` }}>
              <div className={styles.cardIcon} style={{ backgroundColor: stat.color }}>{stat.icon}</div>
              <div className={styles.cardContent}>
                <div className={styles.cardValue}>{stat.value}</div>
                <div className={styles.cardTitle}>{stat.title}</div>
                <div className={styles.cardDetail}>{stat.detail}</div>
              </div>
              <div className={styles.cardProgress} style={{ background: stat.gradient }} />
            </div>
          ))}
        </div>

        <div className={styles.statusBreakdown}>
          <h4 className={styles.breakdownTitle}>Распределение по статусам</h4>
          <div className={styles.statusBarItem}>
            <div className={styles.statusBarLabel}><span>Новые</span><span>{services.new}</span></div>
            <div className={styles.statusBarTrack}><div className={`${styles.statusBarFill} ${styles.fillNew}`} style={{ width: `${getPercentage(services.new, services.total)}%` }} /></div>
          </div>
          <div className={styles.statusBarItem}>
            <div className={styles.statusBarLabel}><span>В обработке</span><span>{services.processing}</span></div>
            <div className={styles.statusBarTrack}><div className={`${styles.statusBarFill} ${styles.fillProcessing}`} style={{ width: `${getPercentage(services.processing, services.total)}%` }} /></div>
          </div>
          <div className={styles.statusBarItem}>
            <div className={styles.statusBarLabel}><span>Завершено</span><span>{services.completed}</span></div>
            <div className={styles.statusBarTrack}><div className={`${styles.statusBarFill} ${styles.fillCompleted}`} style={{ width: `${getPercentage(services.completed, services.total)}%` }} /></div>
          </div>
        </div>
      </div>
    );
  }

  // Статистика для заказов оборудования
  if (type === 'equipment') {
    const statsData = [
      { title: 'Всего заказов', value: equipment.total, detail: 'Всего обращений' },
      { title: 'Новые', value: equipment.new, detail: 'Требуют внимания' },
      { title: 'В обработке', value: equipment.processing, detail: 'Активные заказы' },
      { title: 'Завершено', value: equipment.completed,  detail: 'Успешно выполнено' }
    ];

    return (
      <div className={styles.statsContainer}>
        <div className={styles.statsGrid}>
          {statsData.map((stat, index) => (
            <div key={stat.title} className={styles.statCard} style={{ animationDelay: `${index * 0.1}s` }}>
              <div className={styles.cardIcon} style={{ backgroundColor: stat.color }}>{stat.icon}</div>
              <div className={styles.cardContent}>
                <div className={styles.cardValue}>{stat.value}</div>
                <div className={styles.cardTitle}>{stat.title}</div>
                <div className={styles.cardDetail}>{stat.detail}</div>
              </div>
              <div className={styles.cardProgress} style={{ background: stat.gradient }} />
            </div>
          ))}
        </div>

        <div className={styles.statusBreakdown}>
          <h4 className={styles.breakdownTitle}>Распределение по статусам</h4>
          <div className={styles.statusBarItem}>
            <div className={styles.statusBarLabel}><span>Новые</span><span>{equipment.new}</span></div>
            <div className={styles.statusBarTrack}><div className={`${styles.statusBarFill} ${styles.fillNew}`} style={{ width: `${getPercentage(equipment.new, equipment.total)}%` }} /></div>
          </div>
          <div className={styles.statusBarItem}>
            <div className={styles.statusBarLabel}><span>В обработке</span><span>{equipment.processing}</span></div>
            <div className={styles.statusBarTrack}><div className={`${styles.statusBarFill} ${styles.fillProcessing}`} style={{ width: `${getPercentage(equipment.processing, equipment.total)}%` }} /></div>
          </div>
          <div className={styles.statusBarItem}>
            <div className={styles.statusBarLabel}><span>Завершено</span><span>{equipment.completed}</span></div>
            <div className={styles.statusBarTrack}><div className={`${styles.statusBarFill} ${styles.fillCompleted}`} style={{ width: `${getPercentage(equipment.completed, equipment.total)}%` }} /></div>
          </div>
        </div>
      </div>
    );
  }

  // Статистика для пользователей
  if (type === 'users') {
    const activeUsers = users?.filter(u => !u.isBlocked).length || 0;
    const blockedUsers = users?.filter(u => u.isBlocked).length || 0;
    const adminCount = users?.filter(u => u.role === 'admin').length || 0;

    const statsData = [
      { title: 'Всего пользователей', value: users?.length || 0,  detail: 'Зарегистрировано в системе' },
      { title: 'Активных', value: activeUsers,  detail: `${getPercentage(activeUsers, users?.length || 0)}% от всех` },
      { title: 'Заблокированных', value: blockedUsers,  detail: `${getPercentage(blockedUsers, users?.length || 0)}% от всех` },
      { title: 'Администраторов', value: adminCount, detail: 'Управляют системой' }
    ];

    return (
      <div className={styles.statsContainer}>
        <div className={styles.statsGrid}>
          {statsData.map((stat, index) => (
            <div key={stat.title} className={styles.statCard} style={{ animationDelay: `${index * 0.1}s` }}>
              <div className={styles.cardIcon} style={{ backgroundColor: stat.color }}>{stat.icon}</div>
              <div className={styles.cardContent}>
                <div className={styles.cardValue}>{stat.value}</div>
                <div className={styles.cardTitle}>{stat.title}</div>
                <div className={styles.cardDetail}>{stat.detail}</div>
              </div>
              <div className={styles.cardProgress} style={{ background: stat.gradient }} />
            </div>
          ))}
        </div>

        {/* Прогресс-бар активности */}
        <div className={styles.activitySection}>
          <h4 className={styles.activityTitle}>Активность пользователей</h4>
          <div className={styles.activityBar}>
            <div className={styles.activityActive} style={{ width: `${getPercentage(activeUsers, users?.length || 0)}%` }}><span>Активные</span></div>
            <div className={styles.activityBlocked} style={{ width: `${getPercentage(blockedUsers, users?.length || 0)}%` }}><span>Заблокированные</span></div>
          </div>
          <div className={styles.activityLegend}>
            <div className={styles.legendItem}><div className={styles.legendColorActive}></div><span>Активные ({activeUsers})</span></div>
            <div className={styles.legendItem}><div className={styles.legendColorBlocked}></div><span>Заблокированные ({blockedUsers})</span></div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default StatsCards;