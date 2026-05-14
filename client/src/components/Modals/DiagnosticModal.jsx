import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ServiceRequestModal from './ServiceRequestModal';
import { diagnosticQuestions } from '../data/diagnosticQuestions';
import styles from './Modal.module.css';

const DiagnosticModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { warning } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);

  const questions = diagnosticQuestions;

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setAnswers({});
      setResult(null);
      setShowResult(false);
      setShowServiceModal(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentQuestion = questions[currentStep];
  const isLastQuestion = currentStep === questions.length - 1;
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleAnswer = (value) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value
    });
  };

  const handleNext = () => {
    if (!answers[currentQuestion.id]) return;
    
    if (isLastQuestion) {
      generateDiagnosis();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateDiagnosis = () => {
    // Анализ ответов и генерация заключения
    const symptoms = answers[2] || [];
    const transformerType = answers[1];
    const hasMaintenance = answers[3] === 'Да';
    const hasExternalImpact = answers[4] === 'Да';
    
    let diagnosis = '';
    let recommendations = [];
    let severity = 'medium';
    
    // Анализ симптомов
    const hasSeriousSymptoms = symptoms.includes('Запах гари или дыма') || 
                               symptoms.includes('Масло на корпусе (для масляных)');
    const hasOverheating = symptoms.includes('Нагрев корпуса выше нормы');
    const hasNoise = symptoms.includes('Повышенный шум или гул');
    const hasPowerIssues = symptoms.includes('Падение напряжения на выходе') ||
                           symptoms.includes('Периодические отключения');
    
    // Определение серьезности
    if (hasSeriousSymptoms) {
      severity = 'high';
      diagnosis = 'Выявлены признаки серьезной неисправности. Возможны внутренние повреждения обмоток или изоляции.';
      recommendations = [
        'НЕМЕДЛЕННО отключите трансформатор от сети',
        'Вызовите специалиста для срочной диагностики',
        'Не пытайтесь устранить неисправность самостоятельно'
      ];
    } else if (hasOverheating) {
      severity = 'medium';
      diagnosis = 'Обнаружены признаки перегрева оборудования. Возможны проблемы с системой охлаждения или перегрузка.';
      recommendations = [
        'Проверьте систему охлаждения',
        'Оцените фактическую нагрузку',
        'Проведите тепловизионный контроль'
      ];
    } else if (hasNoise) {
      severity = 'medium';
      diagnosis = 'Повышенный шум может указывать на ослабление креплений или проблемы с магнитопроводом.';
      recommendations = [
        'Проверьте крепления и затяжку болтов',
        'Проведите вибродиагностику',
        'Требуется осмотр специалистом'
      ];
    } else if (hasPowerIssues) {
      severity = 'medium';
      diagnosis = 'Обнаружены проблемы с выходными характеристиками. Возможны неисправности в системе управления или контактных соединениях.';
      recommendations = [
        'Проверьте контактные соединения',
        'Выполните замеры выходного напряжения',
        'Проведите диагностику системы автоматики'
      ];
    } else {
      severity = 'low';
      diagnosis = 'Предварительных признаков критических неисправностей не обнаружено. Оборудование, вероятно, в рабочем состоянии.';
      recommendations = [
        'Проведите плановое техническое обслуживание',
        'Проверьте контактные соединения',
        'Выполните замеры сопротивления изоляции'
      ];
    }
    
    // Дополнительные рекомендации
    if (!hasMaintenance) {
      recommendations.push(' Рекомендуется провести внеплановое техническое обслуживание');
    }
    
    if (hasExternalImpact) {
      recommendations.push(' После внешних воздействий необходима углубленная диагностика');
    }
    
    setResult({
      diagnosis,
      recommendations,
      severity,
      transformerType,
      symptoms,
      answers
    });
    setShowResult(true);
  };

  // Формирование комментария для заявки
  const getDiagnosticComment = () => {
    return ` **Результаты экспресс-диагностики**

**Диагноз:** ${result?.diagnosis}

**Рекомендации:**
${result?.recommendations.map(r => `• ${r}`).join('\n')}

**Степень риска:** ${result?.severity === 'high' ? 'Высокая' : result?.severity === 'medium' ? 'Средняя' : 'Низкая'}

---
Заявка создана после прохождения экспресс-диагностики.
Дата диагностики: ${new Date().toLocaleString('ru-RU')}`;
  };

  const handleRepairRequest = () => {
    if (!user) {
      warning('**Необходима авторизация**\nДля записи на ремонт войдите в свой аккаунт');
      return;
    }
    
    // Открываем модальное окно заявки на услугу с предзаполненными данными
    setShowServiceModal(true);
  };

  const handleServiceModalClose = () => {
    setShowServiceModal(false);
    onClose(); // Закрываем окно диагностики
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
    setShowResult(false);
  };

  // Рендер разных типов вопросов
  const renderQuestionInput = () => {
    const question = currentQuestion;
    
    if (question.type === 'yesno') {
      return (
        <div className={styles.optionsGroup}>
          {question.options.map(opt => (
            <label key={opt} className={styles.radioLabel}>
              <input
                type="radio"
                name="question"
                value={opt}
                checked={answers[question.id] === opt}
                onChange={(e) => handleAnswer(e.target.value)}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      );
    }
    
    if (question.type === 'multiple') {
      const selectedValues = answers[question.id] || [];
      const handleMultipleChange = (opt) => {
        const newValues = selectedValues.includes(opt)
          ? selectedValues.filter(v => v !== opt)
          : [...selectedValues, opt];
        handleAnswer(newValues);
      };
      
      return (
        <div className={styles.optionsGroup}>
          {question.options.map(opt => (
            <label key={opt} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                value={opt}
                checked={selectedValues.includes(opt)}
                onChange={() => handleMultipleChange(opt)}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      );
    }
    
    // single choice
    return (
      <div className={styles.optionsGroup}>
        {question.options.map(opt => (
          <label key={opt} className={styles.radioLabel}>
            <input
              type="radio"
              name="question"
              value={opt}
              checked={answers[question.id] === opt}
              onChange={(e) => handleAnswer(e.target.value)}
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className={styles.modalOverlay} onClick={onClose}>
        <div className={`${styles.modalContent} ${styles.modalLarge}`} onClick={(e) => e.stopPropagation()}>
          <button className={styles.closeButton} onClick={onClose}>×</button>
          
          <div className={styles.diagnosticContainer}>
            <div className={styles.diagnosticHeader}>
              <h2 className={styles.modalTitle}>
                 Экспресс-диагностика неисправностей
              </h2>
              <p className={styles.diagnosticSubtitle}>
                Ответьте на вопросы для предварительной оценки состояния оборудования
              </p>
            </div>
            
            {!showResult ? (
              <>
                {/* Прогресс-бар */}
                <div className={styles.progressSection}>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                  </div>
                  <div className={styles.progressText}>
                    Вопрос {currentStep + 1} из {questions.length}
                  </div>
                </div>
                
                {/* Вопрос */}
                <div className={styles.questionSection}>
                  <h3 className={styles.questionText}>{currentQuestion.question}</h3>
                  {renderQuestionInput()}
                </div>
                
                {/* Навигация */}
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
                    disabled={!answers[currentQuestion.id] || (currentQuestion.type === 'multiple' && answers[currentQuestion.id]?.length === 0)}
                  >
                    {isLastQuestion ? 'Завершить диагностику' : 'Далее →'}
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Результаты диагностики */}
                <div className={styles.resultSection}>
                  <div className={`${styles.severityBadge} ${styles[`severity${result.severity}`]}`}>
                    {result.severity === 'high' && ' Высокая степень риска'}
                    {result.severity === 'medium' && ' Средняя степень риска'}
                    {result.severity === 'low' && ' Низкая степень риска'}
                  </div>
                  
                  <div className={styles.diagnosisBlock}>
                    <h4> Заключение:</h4>
                    <p>{result.diagnosis}</p>
                  </div>
                  
                  <div className={styles.recommendationsBlock}>
                    <h4> Рекомендации:</h4>
                    <ul>
                      {result.recommendations.map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className={styles.actionButtons}>
                    <button className={styles.repairButton} onClick={handleRepairRequest}>
                       Записаться на ремонт
                    </button>
                    <button className={styles.resetButton} onClick={handleReset}>
                      Пройти заново
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Модальное окно заявки на услугу с предзаполненными данными */}
      {showServiceModal && (
        <ServiceRequestModal
          isOpen={showServiceModal}
          onClose={handleServiceModalClose}
          preFilledData={{
            serviceType: 'repair',
            serviceName: 'Ремонт трансформатора (экспресс-диагностика)',
            comment: getDiagnosticComment()
          }}
        />
      )}
    </>
  );
};

export default DiagnosticModal;