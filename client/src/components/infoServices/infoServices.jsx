import { useState } from 'react'
import styles from './infoServices.module.css'

function InfoServices() {

    return (
        <>
            <div className={styles.content}>
                <p className={styles.contentTxt}>Обратите внимание! Цена формируется индивидуально под запрос.
                    Для уточнения информации оставьте заявку - менеджер свяжется с вами в течении 2-х рабочих дней.</p>
            </div>
        </>
    )
}

export default InfoServices