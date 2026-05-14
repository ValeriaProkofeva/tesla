import { useState } from 'react'
import styles from './CatalogPage.module.css'
import InfoServices from '../../infoServices/infoServices'
import Header from '../../Header/Header'
import Footer from '../../Footer/Footer'
import CatalogCard from './CatalogCard'
import QuizModal from '../../Modals/QuizModal'


function CatalogPage() {

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [quizOpen, setQuizOpen] = useState(false);
  const itemsPerPage = 12;

  const categories = [
    { id: 'all', name: 'Все товары' },
    { id: 'capacitor', name: 'Автоматические конденсаторные установки' },
    { id: 'devices', name: 'Аппараты' },
    { id: 'diesel', name: 'Дизельные электростанции в железобетонной оболочке' },
    { id: 'ktp-concrete', name: 'КТП в железобетонной монолитной оболочке' },
    { id: 'ktp-insulated', name: 'КТП в утепленной оболочке' },
    { id: 'ktp-indoor', name: 'КТП внутренней установки и НКУ' },
    { id: 'ktp-outdoor', name: 'КТП наружной установки' },
    { id: 'multipurpose', name: 'Многоцелевые трансформаторы' },
    { id: 'optics', name: 'Оптическое станкостроение и вакуумная техника' },
    { id: 'assembly', name: 'Сборные комплекты оборудования' },
    { id: 'oil-transformer', name: 'Трансформаторы силовые масляные' },
    { id: 'dry-transformer', name: 'Трансформаторы силовые сухие' },
    { id: 'current-transformer', name: 'Трансформаторы тока' },
    { id: 'cathodic', name: 'Установки катодной защиты' },
  ];

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  return (
    <>
      <Header></Header>
      <div className={styles.Info}>
        <InfoServices></InfoServices>
        <button className={styles.quizButton} onClick={() => setQuizOpen(true)} >Помочь с подбором товара </button>
      </div>

      <div className={styles.catalogPage}>
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>Каталог продукции</h1>

          <div className={styles.catalogLayout}>
            <aside className={styles.filterSidebar}>
              <h3 className={styles.filterTitle}>Категории</h3>
              <ul className={styles.filterList}>
                {categories.map(category => (
                  <li key={category.id}>
                    <button
                      className={`${styles.filterButton} ${selectedCategory === category.id ? styles.active : ''}`}
                      onClick={() => handleCategoryChange(category.id)}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            <div className={styles.productsContent}>
              <CatalogCard
                selectedCategory={selectedCategory}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
<QuizModal isOpen={quizOpen} onClose={() => setQuizOpen(false)} />
      <Footer></Footer>
    </>
  )
}

export default CatalogPage
