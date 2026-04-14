import React from 'react';
import styles from './Modal.module.css';

const WorkModal = ({ isOpen, onClose, work }) => {
  if (!isOpen || !work) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={`${styles.modalContent} ${styles.modalLarge}`} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        
        <div className={styles.modalWorkLayout}>
          <div className={styles.modalWorkImage}>
            <img 
              src={work.image} 
              alt={work.title}
              onError={(e) => {
                e.target.src = '/images/works/default.jpg';
              }}
            />
          </div>
          
          <div className={styles.modalWorkInfo}>
            <h2 className={styles.modalTitle}>{work.title}</h2>
            <p className={styles.modalWorkDescription}>{work.fullDescription}</p>
            
            <div className={styles.workDetails}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Локация:</span>
                <span className={styles.detailValue}>{work.location}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Год:</span>
                <span className={styles.detailValue}>{work.year}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Заказчик:</span>
                <span className={styles.detailValue}>{work.client}</span>
              </div>
            </div>
            
            <div className={styles.workResults}>
              <h4>Результаты проекта:</h4>
              <p>{work.results}</p>
            </div>
            
            {work.technologies && work.technologies.length > 0 && (
              <div className={styles.workTechnologies}>
                <h4>Примененные технологии:</h4>
                <div className={styles.techTags}>
                  {work.technologies.map((tech, index) => (
                    <span key={index} className={styles.techTag}>{tech}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkModal;