import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './HomePage.module.css';

function ContentHome() {
  const { user } = useAuth();
  const { success, error: showError, warning } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    consent: false,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

  const navigateToServices = () => {
    navigate('/services');
  };

  const partnersData = [
    {
      name: "ОАО «МЭТЗ ИМ. В.И.Козлова»",
      url: "https://metz.by/",
      target: "_blank"
    },
    {
      name: "АО «Завод «Инвертор»",
      url: "https://www.sbp-invertor.ru/",
      target: "_blank"
    },
    {
      name: "ООО «ЮНИГРИН ИНЖИНИРИНГ»",
      url: "https://unigreen-energy.com/ru/",
      target: "_blank"
    },
    {
      name: "ООО «СК «Ликос»",
      url: "http://likosstroy.ru/",
      target: "_blank"
    },
    {
      name: "ООО «ОренбургЭлектроСетьСтрой»",
      url: "https://mehkolonna99.ru/",
      target: "_blank"
    },
    {
      name: "АО «ПО «Стрела»",
      url: "https://orgstrela.ru/",
      target: "_blank"
    },
    {
      name: "АО «Желдорреммаш»",
      url: "https://zdrm.locotech.ru/",
      target: "_blank"
    },
    {
      name: "ООО «Таврида Электрик»",
      url: "https://www.tavrida.ru/ter/",
      target: "_blank"
    }
  ];

  // Валидация формы
  const validateForm = () => {
    const newErrors = {};

    // Валидация имени
    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно для заполнения';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Имя должно содержать минимум 2 символа';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Имя не должно превышать 100 символов';
    }

    // Валидация телефона
    if (!formData.phone.trim()) {
      newErrors.phone = 'Телефон обязателен для заполнения';
    } else {
      const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
      const cleanPhone = formData.phone.replace(/\s/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        newErrors.phone = 'Введите корректный номер телефона (например: +7 999 123-45-67)';
      }
    }

    // Валидация согласия
    if (!formData.consent) {
      newErrors.consent = 'Необходимо согласие на обработку персональных данных';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обработчик изменения полей
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    // Очищаем ошибку поля при вводе
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Форматирование телефона
  const formatPhone = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length === 0) return '';
    if (cleaned.length <= 1) return `+7`;
    if (cleaned.length <= 4) return `+7 (${cleaned.slice(1)}`;
    if (cleaned.length <= 7) return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4)}`;
    if (cleaned.length <= 9) return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setFormData({ ...formData, phone: formatted });
  };

  // Отправка формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Проверка авторизации
    if (!user) {
      warning('**Необходима авторизация**\nДля отправки заявки войдите в свой аккаунт');
      return;
    }

    if (!validateForm()) {
      showError('**Проверьте форму**\nПожалуйста, заполните все поля правильно');
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/consultations',
        {
          name: formData.name.trim(),
          phone: formData.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      success('**Заявка успешно отправлена!**\nМы свяжемся с вами в ближайшее время');

      // Очищаем форму
      setFormData({
        name: '',
        phone: '',
        consent: false,
      });

    } catch (error) {
      showError(error.response?.data?.error || '**Ошибка отправки**\nПопробуйте позже');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
       <div className={styles.About}>
        <p className={styles.AboutH1}>О компании</p>
        <div className={styles.AboutCont}>
          <div className={styles.AboutLeft}>
            <p className={styles.AboutTxt}>ООО «Тесла» - современная производственная компания, основным направлением деятельности которой является строительство, ремонт и эксплуатация объектов энергетики.</p>
            <p className={styles.AboutTxt2}>За время деятельности компании успешно реализованы сложные энергетические проекты – электрические подстанции и распределительные пункты 0,4- 35 кВ, воздушные и кабельные линии электропередач, объекты солнечной энергетики и многое другое.</p>
          </div>
          <div className={styles.AboutRight}>
            <img className={styles.AboutImg} src="/images/about.jpg" alt="Вышка" loading='lazy' />
          </div>
        </div>
      </div>

      <div className={styles.Services}>
        <div className={styles.servicesH}>
          <p className={styles.servicesH1}>Услуги</p>
          <p className={styles.servicesTxt}>Практикуем комплексный подход: продажа, доставка, монтаж, лаборатория, наладка.</p>
        </div>
        <div className={styles.servicesCards}>
          <div className={styles.servecesCard}>
            <img src="/images/sale.jpg" alt="Продажа" loading='lazy' />
            <div className={styles.cardTxt}>
              <p className={styles.cardTxt1}>Продажа оборудования</p>
              <p className={styles.cardTxt2} onClick={navigateToServices}
              style={{ cursor: 'pointer' }}>Читать подробнее →</p>
            </div>
          </div>
          <div className={styles.servecesCard}>
            <img src="/images/repair.jpg" alt="Ремонт" loading='lazy' />
            <div className={styles.cardTxt}>
              <p className={styles.cardTxt1}>Ремонт трансформаторов</p>
              <p className={styles.cardTxt2} onClick={navigateToServices}
              style={{ cursor: 'pointer' }}>Читать подробнее →</p>
            </div>
          </div>
          <div className={styles.servecesCard}>
            <img src="/images/montage.jpg" alt="Монтаж" loading='lazy' />
            <div className={styles.cardTxt}>
              <p className={styles.cardTxt1}>Промышленный электромонтаж</p>
              <p className={styles.cardTxt2} onClick={navigateToServices}
              style={{ cursor: 'pointer' }}>Читать подробнее →</p>
            </div>
          </div>
          <div className={styles.servecesCard}>
            <img src="/images/work.jpg" alt="Работы" loading='lazy' />
            <div className={styles.cardTxt}>
              <p className={styles.cardTxt1}>Пуско-наладочные работы и ЭТЛ</p>
              <p className={styles.cardTxt2} onClick={navigateToServices}
              style={{ cursor: 'pointer' }}>Читать подробнее →</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.privilege}>
        <div className={styles.privilegeH}>
          <p className={styles.privilegeH1}>Наши преимущества</p>
        </div>
        <div className={styles.privilegeBoxes}>
          <div className={styles.privilegeBox}>
            <p className={styles.privilegeBoxH1}>Гарантия качества</p>
            <p className={styles.privilegeBoxTxt}>являемся представителями Минского электротехнического завода им. В.И. Козлова</p>
          </div>
          <div className={styles.privilegeBox}>
            <p className={styles.privilegeBoxH1}>Комплексный подход</p>
            <p className={styles.privilegeBoxTxt}>продажа, доставка, монтаж, лаборатория, а также поможем с продажей в трейд-ин</p>
          </div>
          <div className={styles.privilegeBox1}>
            <p className={styles.privilegeBoxH1}>Опыт работы</p>
            <p className={styles.privilegeBoxTxt}>работаем с 2008 года, сотрудничаем с крупными компаниями города</p>
          </div>
        </div>
      </div>

      <div className={styles.partners}>
        <p className={styles.partnersH1}>Партнеры</p>
        <div className={styles.partnersWrapper}>
          <div className={styles.partnersSlide}>
            {partnersData.map((partner, index) => (
              <a
                key={`original-${index}`}
                href={partner.url}
                target={partner.target}
                rel="noopener noreferrer"
                className={styles.partnersLink}
              >
                <p className={styles.partnersTxt}>{partner.name}</p>
              </a>
            ))}
            {partnersData.map((partner, index) => (
              <a
                key={`duplicate-${index}`}
                href={partner.url}
                target={partner.target}
                rel="noopener noreferrer"
                className={styles.partnersLink}
              >
                <p className={styles.partnersTxt}>{partner.name}</p>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.HomeForm}>
        <p className={styles.FormH1}>Получить консультацию</p>
        <p className={styles.FormTxt}>Остались вопросы? Оставьте свои данные и мы свяжемся с вами</p>
        
        <form className={styles.Form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Имя *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder='Иванов Иван'
              className={errors.name ? styles.errorInput : ''}
            />
            {errors.name && <div className={styles.errorText}>{errors.name}</div>}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="phone">Контактный телефон *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              placeholder='+7 (999) 123-45-67'
              className={errors.phone ? styles.errorInput : ''}
            />
            {errors.phone && <div className={styles.errorText}>{errors.phone}</div>}
          </div>
          
          <div className={styles.formGroup1}>
            <input
              className={styles.checkboxInput}
              type="checkbox"
              id="consent"
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
            />
            <label htmlFor="consent" className={styles.checkboxLabel}>
              Я соглашаюсь на обработку персональных данных в соответствии с
              <a href="/privacy-policy" target="_blank" className={styles.link}> политикой конфиденциальности</a>
            </label>
          </div>
          {errors.consent && <div className={styles.errorText}>{errors.consent}</div>}
          
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={submitting}
          >
            {submitting ? 'Отправка...' : 'Отправить'}
          </button>
        </form>
      </div>
    </>
  );
}

export default ContentHome;