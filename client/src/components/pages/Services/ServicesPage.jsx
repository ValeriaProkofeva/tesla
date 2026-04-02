import { useState } from 'react'
import styles from './Services.module.css'
import InfoServices from '../../infoServices/infoServices'
import Header from '../../Header/Header'
import Footer from '../../Footer/Footer'
import ServicesCard from './ServicesCard'


function ServicesPage() {

  return (
    <>
    <Header></Header>
    <h1 className={styles.ServH}>Услуги</h1>
    <div className={styles.Info}>
    <InfoServices></InfoServices>
    <button className={styles.expr}>Экспресс-диагностика</button>
    </div>
    <ServicesCard></ServicesCard>
    <Footer></Footer>
    </>
  )
}

export default ServicesPage
