import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast  } from '../../context/ToastContext';

import ServiceRequestModal from '../../Modals/ServiceRequestModal';
import styles from './Services.module.css';

function ServicesCard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
     const { error } = useToast(); // Добавляем уведомления

  const [selectedService, setSelectedService] = useState({ type: '', name: '' });

  const navigateToCatalog = () => {
    navigate('/catalog');
  };

   const handleOpenModal = (serviceType, serviceName) => {
    if (!user) {
      error('Для отправки заявки необходимо авторизоваться', 5000);
      return;
    }
    setSelectedService({ type: serviceType, name: serviceName });
    setModalOpen(true);
  };

  const getServiceType = (title) => {
    const types = {
      'Продажа оборудования': 'sale',
      'Ремонт трансформаторов': 'repair',
      'Промышленный электромонтаж': 'electromontage',
      'Пуско-наладочные работы и ЭТЛ': 'commissioning',
    };
    return types[title] || '';
  };

  return (
    <>
      <div className={styles.ServicesCards}>
        <div className={styles.ServicesCard}>
          <div className={styles.Left}>
            <div className={styles.CardH1}>
              <p className={styles.CardH}>Продажа оборудования</p>
            </div>
            <div className={styles.CardH3}>
              <p className={styles.CardTxt}>Мы предлагаем надежное решение для оснащения объектов энергетики, промышленности и строительства.</p>
              <p className={styles.CardTxt}>С ассортиментом можно ознакомиться в <span
                onClick={navigateToCatalog} style={{ cursor: 'pointer' }} className={styles.CardTxtSpan}>каталоге</span>.</p>
            </div>
            <div className={styles.CardContent}>
              <p className={styles.CardH2}>Почему стоит работать с нами?</p>
              <ol className={styles.CardContentOl}>
                <li className={styles.CardContentTxt}>Только проверенное качество. Мы поставляем сертифицированное оборудование от ведущих производителей, соответствующее ГОСТ и ТУ. Каждая единица техники проходит предпродажную проверку.</li>
                <li className={styles.CardContentTxt}>Помощь в оформлении заказа. Подбор оборудования – ответственная задача. Наши специалисты помогут точно рассчитать мощность, номиналы и комплектацию, чтобы вы не переплачивали за избыточные характеристики и получили именно то, что соответствует задачам вашего объекта.</li>
                <li className={styles.CardContentTxt}>Оперативная доставка. Организуем логистику под ваш график. Работаем с любой сложностью маршрутов, обеспечивая бережную транспортировку крупногабаритных трансформаторов и подстанций до склада заказчика или непосредственно на строительную площадку.</li>
              </ol>
            </div>
            <button 
              className={styles.ServButt}
              onClick={() => handleOpenModal('sale', 'Продажа оборудования')}
            >
              Отправить заявку
            </button>
          </div>
          <div className={styles.Right}>
            <img className={styles.RightImg} src="client/public/images/Serv1.jpg" alt="Продажа" />
          </div>
        </div>

        <div className={styles.ServicesCard}>
          <div className={styles.Left}>
            <div className={styles.CardH1}>
              <p className={styles.CardH}>Ремонт трансформаторов</p>
            </div>
            <p className={styles.CardTxt}>Мы предлагаем полный спектр решений: от профессионального ремонта до выгодной утилизации старого оборудования с зачетом стоимости в счет нового.</p>
            <div className={styles.CardContent}>
              <div className={styles.Card}>
                <p className={styles.CardH2}>Ремонт трансформаторов любой сложности</p>
                <p className={styles.CardTxt}>Выполняем восстановление работоспособности силовых трансформаторов (включая ТМГ) и комплектных трансформаторных подстанций (КТП).</p>
                <ol className={styles.CardContentOl}>
                  <li className={styles.CardContentTxt}>Диагностика и капитальный ремонт активных частей (обмоток, магнитопроводов);</li>
                  <li className={styles.CardContentTxt}>Ремонт и замена вводов, переключателей, систем охлаждения;</li>
                  <li className={styles.CardContentTxt}>Восстановление герметичности, замена масла, сушка изоляции;</li>
                  <li className={styles.CardContentTxt}>Постремонтные испытания (с выдачей протоколов).</li>
                </ol>
              </div>
              <div className={styles.Card}>
                <p className={styles.CardH2}>Выкуп Б/У трансформаторов и КТП</p>
                <p className={styles.CardTxt}>Мы покупаем бывшие в употреблении трансформаторы, подстанции и электротехническое оборудование, которые еще могут принести пользу.</p>
                <ol className={styles.CardContentOl}>
                  <li className={styles.CardContentTxt}>Честная оценка технического состояния;</li>
                  <li className={styles.CardContentTxt}>Быстрая оплата и демонтаж (при необходимости);</li>
                  <li className={styles.CardContentTxt}>Вывоз силами нашей компании.</li>
                </ol>
              </div>
              <div className={styles.Card}>
                <p className={styles.CardH2}>Трейд-ин трансформаторов – выгодная замена</p>
                <p className={styles.CardTxt}>Устаревшее или аварийное оборудование – в зачет нового!</p>
                <p className={styles.CardH4}>Услуга «Трейд-ин» позволяет вам:</p>
                <ol className={styles.CardContentOl}>
                  <li className={styles.CardContentTxt}>Сдать старый трансформатор по согласованной цене;</li>
                  <li className={styles.CardContentTxt}>Получить скидку на покупку другого оборудования;</li>
                  <li className={styles.CardContentTxt}>Освободиться от сложностей с утилизацией и хранением неликвидных активов.</li>
                </ol>
              </div>
            </div>
            <button 
              className={styles.ServButt}
              onClick={() => handleOpenModal('repair', 'Ремонт трансформаторов')}
            >
              Отправить заявку
            </button>
          </div>
          <div className={styles.Right}>
            <img className={styles.RightImg} src="client/public/images/Serv2.jpg" alt="Ремонт" />
          </div>
        </div>

        <div className={styles.ServicesCard}>
          <div className={styles.Left}>
            <div className={styles.CardH1}>
              <p className={styles.CardH}>Промышленный электромонтаж</p>
            </div>
            <div className={styles.CardH3}>
              <p className={styles.CardTxt}>Выполняем полный комплекс электромонтажных работ на объектах любой сложности – от строительства подстанций до монтажа солнечной генерации. Гарантируем соблюдение ПУЭ, сроков и техническую грамотность решений.</p>
            </div>
            <div className={styles.CardContent}>
              <p className={styles.CardH2}>Направления работ:</p>
              <ol className={styles.CardContentOl}>
                <li className={styles.CardContentTxt}> <span className={styles.CardContentTxtSpan}>Строительство трансформаторных подстанций (КТП, БКТП)</span> <br />Возведение подстанций с нуля: от проектирования до пусконаладки. Монтаж силовых трансформаторов, вводных устройств, систем защиты и учета.</li>
                <li className={styles.CardContentTxt}> <span className={styles.CardContentTxtSpan}>Монтаж распределительных устройств (РУ, РУСН, ГРЩ)</span> <br />Сборка, установка и подключение распределительных щитов, панелей, шкафов управления. Обеспечиваем надежную коммутацию и защиту сетей 0,4-110 кВ.</li>
                <li className={styles.CardContentTxt}> <span className={styles.CardContentTxtSpan}>Монтаж и ремонт линий электропередач (ЛЭП)</span> <br />Строительство новых и обслуживание существующих воздушных и кабельных линий. Работы под напряжением (при необходимости), замена опор, проводов, муфт.</li>
                <li className={styles.CardContentTxt}> <span className={styles.CardContentTxtSpan}>Строительство солнечных электрических станций (СЭС)</span> <br />Проектирование и установка промышленных и коммерческих солнечных электростанций. Подключение к сетям, монтаж инверторов, модулей, систем мониторинга.</li>
              </ol>
            </div>
            <button 
              className={styles.ServButt}
              onClick={() => handleOpenModal('electromontage', 'Промышленный электромонтаж')}
            >
              Отправить заявку
            </button>
          </div>
          <div className={styles.Right}>
            <img className={styles.RightImg} src="client/public/images/Serv3.jpg" alt="Электромонтаж" />
          </div>
        </div>

        <div className={styles.ServicesCard}>
          <div className={styles.Left}>
            <div className={styles.CardH1}>
              <p className={styles.CardH}>Пуско-наладочные работы и ЭТЛ</p>
            </div>
            <div className={styles.CardH3}>
              <p className={styles.CardTxt}>Обеспечиваем ввод электрооборудования в эксплуатацию с полным набором протоколов испытаний. Выполняем пусконаладку систем защиты, автоматики и учета, проводим диагностику действующего оборудования.</p>
            </div>
            <div className={styles.CardContent}>
              <p className={styles.CardH2}>Направления работ:</p>
              <ol className={styles.CardContentOl}>
                <li className={styles.CardContentTxt}> <span className={styles.CardContentTxtSpan}>Пуско-наладочные работы систем РЗА, автоматизации, учета и энергосбережения</span> <br />Настройка релейной защиты и противоаварийной автоматики (РЗА), АСУ ТП, коммерческого и технического учета электроэнергии (АИИС КУЭ). Обеспечиваем селективность, чувствительность и соответствие заданным режимам.</li>
                <li className={styles.CardContentTxt}> <span className={styles.CardContentTxtSpan}>Диагностические работы систем электроснабжения</span> <br />Оценка технического состояния действующего оборудования: силовых трансформаторов, кабельных линий, распределительных устройств, заземляющих устройств. Выявление скрытых дефектов до аварии.</li>
                <li className={styles.CardContentTxt}> <span className={styles.CardContentTxtSpan}>Тепловизионный контроль</span> <br />Бесконтактная диагностика оборудования под нагрузкой. Выявляем перегревы контактных соединений, токоведущих частей, изоляторов, очаги перегрева в РУ и на ЛЭП. Предотвращаем аварийные отключения.</li>
                <li className={styles.CardContentTxt}> <span className={styles.CardContentTxtSpan}>Измерение показателей качества электроэнергии</span> <br />Анализ параметров сети: отклонения напряжения, коэффициенты мощности (cos φ), гармонические искажения, несимметрия. Выработка рекомендаций по установке компенсирующего оборудования (конденсаторных установок, фильтров).</li>
                <li className={styles.CardContentTxt}> <span className={styles.CardContentTxtSpan}>Электротехническая лаборатория (ЭТЛ)</span> <br />Проведение испытаний электрооборудования: измерение сопротивления изоляции, проверка заземляющих устройств, испытания повышенным напряжением, проверка автоматических выключателей.</li>
              </ol>
            </div>
            <button 
              className={styles.ServButt}
              onClick={() => handleOpenModal('commissioning', 'Пуско-наладочные работы и ЭТЛ')}
            >
              Отправить заявку
            </button>
          </div>
          <div className={styles.Right}>
            <img className={styles.RightImg} src="client/public/images/Serv4.jpg" alt="Пуско-наладка" />
          </div>
        </div>
      </div>

      <ServiceRequestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        serviceType={selectedService.type}
        serviceName={selectedService.name}
      />
    </>
  );
}

export default ServicesCard;