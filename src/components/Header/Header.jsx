import { useState } from 'react'
import styles from './Header.module.css'

function Header() {

  return (
    <>
    <div className={styles.HeaderContainer}>
        <div className={styles.HeaderLeft}>
            <div className={styles.logo}>
                <img src="/src/assets/logo.svg" alt="логотип" />
            </div>
        </div>
    </div>
      
    </>
  )
}

export default Header
