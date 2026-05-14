import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { quizQuestions, matchProducts } from '../data/quizQuestions';
import styles from './Modal.module.css';
import ProductModal from './ProductModal';

const QuizModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { warning } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [resultProducts, setResultProducts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState([]);

    const [selectedProduct, setSelectedProduct] = useState(null);
  const [productModalOpen, setProductModalOpen] = useState(false);

  const questions = quizQuestions;
  const totalQuestions = questions.length;

  useEffect(() => {
    if (isOpen && allProducts.length === 0) {
      fetchProducts();
    }
  }, [isOpen]);

    const handleProductModalClose = () => {
    setProductModalOpen(false);
    setSelectedProduct(null);
  };

  // Открытие модального окна с товаром
  const handleOpenProductModal = (product) => {
    setSelectedProduct(product);
    setProductModalOpen(true);
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setAllProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setAnswers({});
      setResultProducts([]);
      setShowResult(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / totalQuestions) * 100;
  const isLastQuestion = currentStep === totalQuestions - 1;

  const handleAnswer = (value) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value
    });
  };

  const handleNext = () => {
    if (!answers[currentQuestion.id]) return;
    
    if (isLastQuestion) {
      findProducts();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const findProducts = () => {
    setLoading(true);
    
    setTimeout(() => {
      const matched = matchProducts(answers, allProducts);
      setResultProducts(matched);
      setShowResult(true);
      setLoading(false);
    }, 500);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({});
    setResultProducts([]);
    setShowResult(false);
  };

  const renderQuestionInput = () => {
    const question = currentQuestion;
    
    return (
      <div className={styles.optionsGroup}>
        {question.options.map(opt => (
          <label key={opt.value} className={styles.radioLabel}>
            <input
              type="radio"
              name="question"
              value={opt.value}
              checked={answers[question.id] === opt.value}
              onChange={(e) => handleAnswer(e.target.value)}
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={`${styles.modalContent} ${styles.modalLarge}`} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        
        <div className={styles.quizContainer}>
          <div className={styles.quizHeader}>
            <h2 className={styles.modalTitle}> Подбор оборудования</h2>
            <p className={styles.quizSubtitle}>
              Ответьте на {totalQuestions} вопросов, и мы подберем оптимальное оборудование из каталога
            </p>
          </div>
          
          {!showResult ? (
            <>
              <div className={styles.progressSection}>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                </div>
                <div className={styles.progressText}>
                  Вопрос {currentStep + 1} из {totalQuestions}
                </div>
              </div>
              
              <div className={styles.questionSection}>
                <h3 className={styles.questionText}>{currentQuestion.question}</h3>
                {renderQuestionInput()}
              </div>
              
              <div className={styles.navigationButtons}>
                <button
                  className={styles.backButton}
                  onClick={handleBack}
                  disabled={currentStep === 0}
                >
                  ← Назад
                </button>
                <button
                  className={styles.nextButton}
                  onClick={handleNext}
                  disabled={!answers[currentQuestion.id]}
                >
                  {isLastQuestion ? 'Подобрать ✓' : 'Далее →'}
                </button>
              </div>
            </>
          ) : (
            <div className={styles.resultSection}>
                {resultProducts.length < 3 && resultProducts.length > 0 && (
  <div className={styles.softeningHint}>
    <span>По вашему запросу найдено мало товаров. Мы расширили параметры поиска, чтобы показать вам больше вариантов.</span>
  </div>
)}
              {loading ? (
                <div className={styles.loadingResult}>
                  <div className={styles.spinner} />
                  <p>Подбираем оборудование...</p>
                </div>
              ) : resultProducts.length === 0 ? (
                <div className={styles.noResult}>
                  <h3>Не удалось подобрать оборудование</h3>
                  <p>По вашим критериям ничего не найдено. Попробуйте изменить параметры подбора или свяжитесь с нами для консультации.</p>
                  <div className={styles.noResultButtons}>
                    <button className={styles.restartButton} onClick={handleRestart}>
                      Пройти заново
                    </button>
                    <button className={styles.contactButton} onClick={onClose}>
                      Связаться с нами
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className={styles.resultHeader}>
                    <h3> Найдено {resultProducts.length} подходящих позиций</h3>
                    <p>На основе ваших ответов мы подобрали следующее оборудование:</p>
                  </div>
                  
                  <div className={styles.resultProductsGrid}>
                    {resultProducts.map(product => (
                      <div key={product.id} className={styles.resultProductCard}>
                        <div className={styles.resultProductImage}>
                          <img 
                            src={product.image || '/images/products/default.jpg'} 
                            alt={product.name}
                            onError={(e) => { e.target.src = '/images/products/default.jpg'; }}
                          />
                        </div>
                        <div className={styles.resultProductContent}>
                          <h4>{product.name}</h4>
                          <p>{product.shortDescription}</p>
                          <button 
                              className={styles.resultProductButton}
                              onClick={() => handleOpenProductModal(product)}
                            >
                              Подробнее →
                            </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className={styles.resultButtons}>
                    <button className={styles.restartButton} onClick={handleRestart}>
                      Новый подбор
                    </button>
                  </div>

                  <ProductModal
        isOpen={productModalOpen}
        onClose={handleProductModalClose}
        product={selectedProduct}
      />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizModal;