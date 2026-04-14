import { useState } from 'react';
import { worksData } from '../../data/worksData';
import WorkModal from '../../Modals/WorkModal';
import styles from './WorkPage.module.css';

function WorkPageContent() {
  const [selectedWork, setSelectedWork] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = (work) => {
    setSelectedWork(work);
    setModalOpen(true);
  };

  return (
    <>
      <div className={styles.worksGrid}>
        {worksData.map((work) => (
          <div key={work.id} className={styles.workCard}>
            <div className={styles.workImage}>
              <img 
                src={work.image} 
                alt={work.title}
                onError={(e) => {
                  e.target.src = '';
                }}
              />
              <div className={styles.workCategory}>{work.category}</div>
            </div>
            <div className={styles.workContent}>
              <h3 className={styles.workTitle}>{work.title}</h3>
              <button 
                className={styles.detailsButton}
                onClick={() => handleOpenModal(work)}
              >
                Подробнее →
              </button>
            </div>
          </div>
        ))}
      </div>

      <WorkModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        work={selectedWork}
      />
    </>
  );
}

export default WorkPageContent;