import { useState } from 'react'
import styles from './HomePage.module.css'
import Header from '../../Header/Header'
import ContentHome from './ContentHome'
import Footer from '../../Footer/Footer'

function HomePage() {

  return (
    <>
      <Header></Header>
      <ContentHome></ContentHome>
      <Footer></Footer>
    </>
  )
}

export default HomePage
