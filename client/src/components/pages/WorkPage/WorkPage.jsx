import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import WorkPageContent from './WorkPageContent';
import styles from './WorkPage.module.css';

function WorkPage() {
  return (
    <>
      <Header />
      <div className={styles.workPage}>
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>Наши работы</h1>
          <p className={styles.pageSubtitle}>
            Реализованные проекты в области энергетики и электротехники
          </p>
          <WorkPageContent />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default WorkPage;