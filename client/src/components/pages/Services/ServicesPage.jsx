import { useState } from 'react'
import styles from './Services.module.css'
import InfoServices from '../../infoServices/infoServices'
import Header from '../../Header/Header'
import Footer from '../../Footer/Footer'
import ServicesCard from './ServicesCard'
import DiagnosticModal from '../../Modals/DiagnosticModal'


function ServicesPage() {
const [diagnosticOpen, setDiagnosticOpen] = useState(false);

  return (
    <>
    <Header></Header>
    <h1 className={styles.ServH}>Услуги</h1>
    <div className={styles.Info}>
    <InfoServices></InfoServices>
    <button 
          className={styles.expr}
          onClick={() => setDiagnosticOpen(true)}
        >
          Экспресс-диагностика
        </button>
    </div>
    <DiagnosticModal
        isOpen={diagnosticOpen}
        onClose={() => setDiagnosticOpen(false)}
      />
    <ServicesCard></ServicesCard>
    <Footer></Footer>
    </>
  )
}

export default ServicesPage
