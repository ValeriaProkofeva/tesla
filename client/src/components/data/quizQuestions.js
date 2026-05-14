export const quizQuestions = [
  {
    id: 1,
    question: 'Какой тип оборудования вам нужен?',
    type: 'single',
    options: [
      { value: 'transformer', label: 'Силовой трансформатор' },
      { value: 'ktp', label: 'Комплектная трансформаторная подстанция (КТП)' },
      { value: 'capacitor', label: 'Конденсаторная установка (УКРМ, АКУ)' },
      { value: 'device', label: 'Коммутационные аппараты (разъединители, выключатели)' },
      { value: 'current-transformer', label: 'Трансформаторы тока' },
      { value: 'other', label: 'Другое оборудование (реакторы, станки, сборные комплекты)' }
    ],
    categoryMapping: {
      'transformer': ['oil-transformer', 'dry-transformer', 'multipurpose'],
      'ktp': ['ktp-concrete', 'ktp-insulated', 'ktp-indoor', 'ktp-outdoor'],
      'capacitor': ['capacitor'],
      'device': ['devices'],
      'current-transformer': ['current-transformer'],
      'other': ['optics', 'assembly', 'multipurpose']
    }
  },
  {
    id: 2,
    question: 'Какая мощность оборудования вам требуется?',
    type: 'single',
    options: [
      { value: 'up-to-63', label: 'До 63 кВА' },
      { value: '63-250', label: '63 - 250 кВА' },
      { value: '250-630', label: '250 - 630 кВА' },
      { value: '630-1000', label: '630 - 1000 кВА' },
      { value: '1000-2500', label: '1000 - 2500 кВА' },
      { value: 'over-2500', label: 'Свыше 2500 кВА' },
      { value: 'not-applicable', label: 'Не применимо / не знаю' }
    ]
  },
  {
    id: 3,
    question: 'Какое напряжение на высокой стороне (ВН) вам нужно?',
    type: 'single',
    options: [
      { value: '0.4', label: '0,4 кВ' },
      { value: '6', label: '6 кВ' },
      { value: '10', label: '10 кВ' },
      { value: '20', label: '20 кВ' },
      { value: '35', label: '35 кВ' },
      { value: 'not-applicable', label: 'Не применимо / не знаю' }
    ]
  },
  {
    id: 4,
    question: 'Какое напряжение на низкой стороне (НН) вам нужно?',
    type: 'single',
    options: [
      { value: '0.23', label: '0,23 кВ (230 В)' },
      { value: '0.4', label: '0,4 кВ (380 В)' },
      { value: '0.69', label: '0,69 кВ' },
      { value: '6-10', label: '6-10 кВ' },
      { value: 'not-applicable', label: 'Не применимо / не знаю' }
    ]
  },
  {
    id: 5,
    question: 'Какой тип изоляции предпочтителен?',
    type: 'single',
    options: [
      { value: 'oil', label: 'Масляный (традиционный, надежный)' },
      { value: 'dry', label: 'Сухой (литая изоляция, безопасный, экологичный)' },
      { value: 'hermetic', label: 'Герметичный (без обслуживания, азотная подушка)' },
      { value: 'any', label: 'Любой' }
    ]
  },
  {
    id: 6,
    question: 'Где будет установлено оборудование?',
    type: 'single',
    options: [
      { value: 'outdoor', label: 'На улице (наружная установка)' },
      { value: 'indoor', label: 'В помещении (внутренняя установка)' },
      { value: 'any', label: 'Не имеет значения' }
    ]
  },
  {
    id: 7,
    question: 'Требуется ли высокая энергоэффективность?',
    type: 'single',
    options: [
      { value: 'yes', label: 'Да, важны потери (класс Х2К2/Х3К2)' },
      { value: 'no', label: 'Нет, стандартное исполнение' },
      { value: 'not-applicable', label: 'Не применимо' }
    ]
  },
  {
    id: 8,
    question: 'Для какой сферы или отрасли вам нужно оборудование?',
    type: 'single',
    options: [
      { value: 'power', label: 'Энергетика / электростанции' },
      { value: 'industry', label: 'Промышленные предприятия' },
      { value: 'oil-gas', label: 'Нефтегазовый комплекс' },
      { value: 'construction', label: 'Строительство (теплообработка бетона)' },
      { value: 'railway', label: 'Железная дорога / автоматика' },
      { value: 'general', label: 'Общее назначение' }
    ]
  }
];

// Функция проверки наличия текста в описании товара
const containsKeyword = (text, keywords) => {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return keywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
};

export const categoryMap = {
  'transformer': ['oil-transformer', 'dry-transformer', 'multipurpose'],
  'ktp': ['ktp-concrete', 'ktp-insulated', 'ktp-indoor', 'ktp-outdoor'],
  'capacitor': ['capacitor'],
  'device': ['devices'],
  'current-transformer': ['current-transformer'],
  'other': ['optics', 'assembly', 'multipurpose']
};

// Диапазоны мощности
export const powerRanges = {
  'up-to-63': { min: 0, max: 63 },
  '63-250': { min: 63, max: 250 },
  '250-630': { min: 250, max: 630 },
  '630-1000': { min: 630, max: 1000 },
  '1000-2500': { min: 1000, max: 2500 },
  'over-2500': { min: 2500, max: Infinity }
};

// Функция для применения фильтров
const applyFilters = (products, filters) => {
  let filtered = [...products];
  
  // Фильтр по категории (из ответа на вопрос 1)
  if (filters.category && filters.category !== 'all' && categoryMap[filters.category]) {
    const allowedCategories = categoryMap[filters.category];
    filtered = filtered.filter(p => allowedCategories.includes(p.category));
  }
  
  // Фильтр по мощности (из ответа на вопрос 2)
  if (filters.powerRange && filters.powerRange !== 'all' && filters.powerRange !== 'not-applicable') {
    const range = powerRanges[filters.powerRange];
    if (range) {
      filtered = filtered.filter(p => {
        if (p.powerMin !== null && p.powerMax !== null) {
          return p.powerMax >= range.min && p.powerMin <= range.max;
        }
        return true; // Пропускаем товары без указания мощности
      });
    }
  }
  
  // Фильтр по напряжению ВН (из ответа на вопрос 3)
  if (filters.voltageHV && filters.voltageHV !== 'all' && filters.voltageHV !== 'not-applicable') {
    filtered = filtered.filter(p => p.voltageHV?.includes(filters.voltageHV));
  }
  
  // Фильтр по напряжению НН (из ответа на вопрос 4)
  if (filters.voltageLV && filters.voltageLV !== 'all' && filters.voltageLV !== 'not-applicable') {
    filtered = filtered.filter(p => p.voltageLV?.includes(filters.voltageLV));
  }
  
  // Фильтр по типу изоляции (из ответа на вопрос 5)
  if (filters.insulationType && filters.insulationType !== 'all') {
    filtered = filtered.filter(p => p.insulationType === filters.insulationType);
  }
  
  // Фильтр по типу установки (из ответа на вопрос 6)
  if (filters.installationType && filters.installationType !== 'all') {
    filtered = filtered.filter(p => p.installationType === filters.installationType);
  }
  
  // Фильтр по энергоэффективности (из ответа на вопрос 7)
  if (filters.efficiencyClass === 'yes') {
    filtered = filtered.filter(p => p.efficiencyClass !== null);
  }
  
  // Фильтр по отрасли (из ответа на вопрос 8)
  if (filters.industry && filters.industry !== 'all') {
    filtered = filtered.filter(p => p.industry === filters.industry || p.industry === 'general');
  }
  
  return filtered;
};

// Основная функция подбора товаров с каскадным смягчением критериев
export const matchProducts = (answers, allProducts) => {
  // Преобразуем ответы в фильтры
  const initialFilters = {
    category: answers[1] || 'all',
    powerRange: answers[2] || 'all',
    voltageHV: answers[3] || 'all',
    voltageLV: answers[4] || 'all',
    insulationType: answers[5] || 'all',
    installationType: answers[6] || 'all',
    efficiencyClass: answers[7] || 'all',
    industry: answers[8] || 'all'
  };
  
  // Уровни смягчения критериев (от строгого к мягкому)
  const filterLevels = [
    // Уровень 1: Все критерии
    {
      name: 'Точное совпадение',
      filters: { ...initialFilters }
    },
    // Уровень 2: Без отрасли
    {
      name: 'Без учета отрасли',
      filters: { ...initialFilters, industry: 'all' }
    },
    // Уровень 3: Без энергоэффективности
    {
      name: 'Без учета энергоэффективности',
      filters: { ...initialFilters, industry: 'all', efficiencyClass: 'all' }
    },
    // Уровень 4: Без типа установки
    {
      name: 'Без учета типа установки',
      filters: { ...initialFilters, industry: 'all', efficiencyClass: 'all', installationType: 'all' }
    },
    // Уровень 5: Без типа изоляции
    {
      name: 'Без учета типа изоляции',
      filters: { ...initialFilters, industry: 'all', efficiencyClass: 'all', installationType: 'all', insulationType: 'all' }
    },
    // Уровень 6: Без напряжения НН
    {
      name: 'Без учета напряжения НН',
      filters: { ...initialFilters, industry: 'all', efficiencyClass: 'all', installationType: 'all', insulationType: 'all', voltageLV: 'all' }
    },
    // Уровень 7: Без напряжения ВН
    {
      name: 'Без учета напряжения ВН',
      filters: { ...initialFilters, industry: 'all', efficiencyClass: 'all', installationType: 'all', insulationType: 'all', voltageLV: 'all', voltageHV: 'all' }
    },
    // Уровень 8: Только категория и мощность
    {
      name: 'Основные параметры',
      filters: { 
        category: initialFilters.category,
        powerRange: initialFilters.powerRange,
        voltageHV: 'all',
        voltageLV: 'all',
        insulationType: 'all',
        installationType: 'all',
        efficiencyClass: 'all',
        industry: 'all'
      }
    },
    // Уровень 9: Только категория (гарантированно что-то найдется)
    {
      name: 'Все товары категории',
      filters: {
        category: initialFilters.category,
        powerRange: 'all',
        voltageHV: 'all',
        voltageLV: 'all',
        insulationType: 'all',
        installationType: 'all',
        efficiencyClass: 'all',
        industry: 'all'
      }
    }
  ];
  
  // Применяем уровни смягчения
  for (const level of filterLevels) {
    const result = applyFilters(allProducts, level.filters);
    if (result.length > 0) {
      console.log(` Найдено ${result.length} товаров на уровне: ${level.name}`);
      return result;
    }
  }
  
  // Если всё равно ничего не найдено (маловероятно), возвращаем первые 8 товаров
  console.log(` Ничего не найдено, возвращаем первые 8 товаров`);
  return allProducts.slice(0, 8);
};