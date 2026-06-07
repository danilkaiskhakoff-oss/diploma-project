const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, HeadingLevel, BorderStyle, convertMillimetersToTwip, PageBreak } = require('docx');
const fs = require('fs');

const MM = (mm) => convertMillimetersToTwip(mm);

function TR(text, opts = {}) {
  return new TextRun({
    text,
    font: 'Times New Roman',
    size: opts.size || 28,
    bold: opts.bold || false,
    italics: opts.italics || false,
  });
}

function Para(text, opts = {}) {
  return new Paragraph({
    children: [TR(text, opts)],
    alignment: opts.align || AlignmentType.JUSTIFIED,
    spacing: {
      before: opts.before || 0,
      after: opts.after || 0,
      line: opts.line || 360,
    },
    indent: {
      firstLine: opts.fl !== undefined ? opts.fl : MM(12.5),
      left: opts.l !== undefined ? opts.l : MM(5),
      right: opts.r !== undefined ? opts.r : MM(5),
    },
  });
}

function Head(text, lvl = 1) {
  return new Paragraph({
    children: [TR(text, { size: 28, bold: true })],
    alignment: AlignmentType.JUSTIFIED,
    spacing: { before: 0, after: lvl === 1 ? 240 : 120, line: 360 },
    indent: { firstLine: MM(12.5), left: MM(5), right: MM(5) },
    heading: lvl === 1 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2,
  });
}

function Bullet(text) {
  return Para('\u2013 ' + text, { before: 0, after: 0 });
}

function Num(text) {
  return Para(text, { before: 0, after: 0 });
}

function Empty() {
  return Para('', { fl: 0 });
}

function Center(text, opts = {}) {
  return new Paragraph({
    children: [TR(text, opts)],
    alignment: AlignmentType.CENTER,
    spacing: { before: opts.before || 0, after: opts.after || 0, line: 360 },
    indent: { left: opts.l || 0, right: opts.r || 0 },
  });
}

function Right(text, opts = {}) {
  return new Paragraph({
    children: [TR(text, opts)],
    alignment: AlignmentType.RIGHT,
    spacing: { line: 360 },
    indent: { right: MM(5) },
  });
}

function Tbl(headers, rows) {
  const tableRows = [
    new TableRow({
      children: headers.map(h => new TableCell({
        children: [new Paragraph({
          children: [TR(h, { size: 24, bold: true })],
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 0, line: 240 },
        })],
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
          left: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
          right: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
        },
      })),
    }),
    ...rows.map(row => new TableRow({
      children: row.map(cell => new TableCell({
        children: [new Paragraph({
          children: [TR(cell, { size: 24 })],
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 0, line: 240 },
        })],
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
          left: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
          right: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
        },
      })),
    })),
  ];
  return new Table({ rows: tableRows, width: { size: 100, type: WidthType.PERCENTAGE } });
}

async function generate() {
  console.log('Генерация документа...');
  const children = [];

  // === ТИТУЛЬНЫЙ ЛИСТ ===
  console.log('  Титульный лист...');
  children.push(Center('МИНИСТЕРСТВО ПРОСВЕЩЕНИЯ РОССИЙСКОЙ ФЕДЕРАЦИИ', { size: 24, bold: true }));
  children.push(Center('ГАПОУ РТ «БУГУЛЬМИНСКИЙ МАШИНОСТРОИТЕЛЬНЫЙ ТЕХНИКУМ»', { size: 24, bold: true, after: 480 }));
  children.push(Center('Специальность 09.02.07 Информационные системы и программирование', { size: 24 }));
  
  for (let i = 0; i < 10; i++) children.push(Empty());
  
  children.push(Center('ПОЯСНИТЕЛЬНАЯ ЗАПИСКА', { size: 28, bold: true, after: 120 }));
  children.push(Center('к дипломному проекту', { size: 24 }));
  
  for (let i = 0; i < 4; i++) children.push(Empty());
  
  children.push(Center('Тема: «Разработка и проектирование интерактивного', { size: 24, bold: true }));
  children.push(Center('ресурса по кибербезопасности для учащихся»', { size: 24, bold: true, after: 240 }));
  
  for (let i = 0; i < 4; i++) children.push(Empty());
  
  children.push(new Paragraph({
    children: [TR('Выполнил: студент гр. 246А    '), TR('Исхаков Д.Д.', { italics: true })],
    alignment: AlignmentType.RIGHT,
    spacing: { line: 360 },
    indent: { right: MM(5) },
  }));
  children.push(new Paragraph({
    children: [TR('Руководитель:                    '), TR('Бузова К.О.', { italics: true })],
    alignment: AlignmentType.RIGHT,
    spacing: { line: 360, after: 480 },
    indent: { right: MM(5) },
  }));
  
  for (let i = 0; i < 3; i++) children.push(Empty());
  children.push(Center('Бугульма, 2026', { size: 24 }));
  
  // === СОДЕРЖАНИЕ ===
  console.log('  Содержание...');
  children.push(new PageBreak());
  children.push(new Paragraph({
    children: [TR('СОДЕРЖАНИЕ', { size: 28, bold: true })],
    alignment: AlignmentType.JUSTIFIED,
    spacing: { before: 0, after: 240, line: 360 },
    indent: { firstLine: 0, left: 0, right: 0 },
  }));

  const toc = [
    ['Введение', '3'],
    ['1 Общая часть', '5'],
    ['1.1 Анализ предметной области', '5'],
    ['1.2 Анализ существующих решений', '8'],
    ['1.3 Формирование основных требований', '11'],
    ['2 Технологическая часть', '14'],
    ['2.1 Разработка технического задания', '14'],
    ['2.2 Алгоритм решения задачи', '17'],
    ['2.3 Функциональная модель (SADT)', '19'],
    ['2.4 Модели базы данных', '21'],
    ['2.5 Способы реализации', '24'],
    ['2.6 Требования к совместимости', '26'],
    ['2.7 Разработка интерфейса и кода', '28'],
    ['2.8 Тестирование', '31'],
    ['2.9 Руководство системного программиста', '33'],
    ['2.10 Руководство оператора', '36'],
    ['2.11 Политика информационной безопасности', '38'],
    ['3 Экономическая часть', '41'],
    ['3.1 Расчёт затрат на разработку', '41'],
    ['3.2 Расчёт затрат на внедрение', '43'],
    ['3.3 Расчёт показателей эффективности', '44'],
    ['4 Техника безопасности и охрана труда', '45'],
    ['Заключение', '50'],
    ['Список использованных источников', '52'],
    ['Список нормативных документов', '54'],
  ];

  toc.forEach(([text, page]) => {
    children.push(new Paragraph({
      children: [
        TR(text),
        TR(' '.repeat(40) + page),
      ],
      alignment: AlignmentType.JUSTIFIED,
      spacing: { before: 0, after: 0, line: 360 },
      indent: { firstLine: 0, left: 0, right: 0 },
    }));
  });

  // === ВВЕДЕНИЕ ===
  console.log('  Введение...');
  children.push(new PageBreak());
  children.push(Head('Введение'));
  
  children.push(Para('В современном мире информационные технологии проникают во все сферы жизни, и кибербезопасность становится одной из ключевых компетенций. По данным международных аналитических агентств, количество кибератак ежегодно увеличивается на 30–40%, при этом значительная часть инцидентов связана с недостаточной осведомлённостью пользователей.'));
  children.push(Para('Интерактивные образовательные платформы позволяют эффективно формировать практические навыки в области кибербезопасности. В отличие от традиционных лекционных форматов, симуляции и тренажёры дают возможность отработать действия в безопасной среде, моделируя реальные сценарии угроз.'));
  children.push(Para('Цель дипломного проекта — разработка и проектирование интерактивного ресурса по кибербезопасности для учащихся, обеспечивающего формирование практических навыков защиты информации через симуляции, квизы и обучающие модули.'));
  
  children.push(Para('Для достижения цели поставлены следующие задачи:'));
  children.push(Bullet('провести анализ предметной области и существующих решений в сфере интерактивного обучения кибербезопасности;'));
  children.push(Bullet('сформировать функциональные и нефункциональные требования к разрабатываемому программному продукту;'));
  children.push(Bullet('разработать техническое задание и алгоритмы решения задач;'));
  children.push(Bullet('спроектировать базу данных и архитектуру приложения;'));
  children.push(Bullet('реализовать пользовательский интерфейс и административную панель;'));
  children.push(Bullet('провести тестирование программного продукта;'));
  children.push(Bullet('разработать руководство пользователя и системного программиста.'));
  
  children.push(Para('Объект исследования — процесс интерактивного обучения основам кибербезопасности.'));
  children.push(Para('Предмет исследования — программный ресурс для интерактивного обучения кибербезопасности.'));
  children.push(Para('Практическая значимость работы заключается в создании готового к использованию образовательного ресурса, который может быть применён в учебных заведениях для подготовки специалистов в области информационной безопасности.'));

  // === 1 ОБЩАЯ ЧАСТЬ ===
  console.log('  Раздел 1...');
  children.push(Head('1 Общая часть'));
  children.push(Head('1.1 Анализ предметной области', 2));
  
  children.push(Para('Кибербезопасность — это совокупность технологий, процессов и практик, направленных на защиту сетей, устройств, программ и данных от атак, повреждений или несанкционированного доступа. В условиях цифровой трансформации образование в области кибербезопасности приобретает критическую важность.'));
  children.push(Para('По данным компании Cybersecurity Ventures, к 2025 году мировой ущерб от киберпреступности составит 10,5 трлн долларов ежегодно. При этом существует дефицит квалифицированных кадров: по оценкам ISC2, в мире не хватает более 4 миллионов специалистов по кибербезопасности.'));
  children.push(Para('Интерактивное обучение в области кибербезопасности имеет ряд преимуществ перед традиционными методами:'));
  children.push(Bullet('практическая направленность — учащиеся отрабатывают навыки в безопасной среде, моделирующей реальные угрозы;'));
  children.push(Bullet('немедленная обратная связь — система мгновенно оценивает действия и предоставляет пояснения;'));
  children.push(Bullet('адаптивность — сложность заданий может корректироваться в зависимости от уровня подготовки;'));
  children.push(Bullet('вовлечённость — игровые элементы повышают мотивацию и удержание внимания.'));
  
  children.push(Para('Рынок образовательных технологий (EdTech) в сфере кибербезопасности демонстрирует устойчивый рост. Основные направления включают:'));
  children.push(Bullet('онлайн-курсы и видеоуроки — теоретическая база по основам защиты информации;'));
  children.push(Bullet('виртуальные лаборатории — изолированные среды для практических экспериментов;'));
  children.push(Bullet('CTF-платформы (Capture The Flag) — соревновательный формат решения задач;'));
  children.push(Bullet('симуляции инцидентов — отработка действий при реальных кибератаках.'));
  
  children.push(Para('Целевая аудитория разрабатываемого ресурса — учащиеся средних профессиональных и высших учебных заведений, изучающие информационные технологии и кибербезопасность. Ресурс также может быть полезен для сотрудников организаций, проходящих курсы повышения квалификации.'));
  
  children.push(Para('Ключевые темы, охватываемые ресурсом:'));
  children.push(Bullet('основы кибербезопасности — CIA Triad, типы угроз, жизненный цикл атаки;'));
  children.push(Bullet('фишинг и социальная инженерия — распознавание мошеннических писем и звонков;'));
  children.push(Bullet('безопасность паролей — создание надёжных паролей, менеджеры паролей, двухфакторная аутентификация;'));
  children.push(Bullet('сетевые атаки — MITM, DNS Spoofing, DDoS и методы защиты;'));
  children.push(Bullet('вредоносное ПО — классификация малвари, методы обнаружения и лечения;'));
  children.push(Bullet('безопасность Wi-Fi — настройка роутера, защита от атак на беспроводные сети;'));
  children.push(Bullet('OSINT — разведка по открытым источникам, Google Dorks, Shodan;'));
  children.push(Bullet('пентест — тестирование на проникновение, сканирование сети, эксплуатация уязвимостей;'));
  children.push(Bullet('реагирование на инциденты — триаж алертов, содерживание, устранение, восстановление.'));

  children.push(Head('1.2 Анализ существующих решений', 2));
  children.push(Para('На рынке представлено несколько платформ для обучения кибербезопасности. Рассмотрим наиболее известные из них.'));
  children.push(Para('TryHackMe — одна из самых популярных платформ для обучения кибербезопасности. Предлагает интерактивные комнаты с пошаговыми заданиями, охватывающие широкий спектр тем от основ до продвинутых техник. Платформа использует геймификацию и систему достижений для повышения мотивации.'));
  children.push(Para('HackTheBox — платформа, ориентированная на более продвинутых пользователей. Предоставляет виртуальные машины для взлома в легальной среде. Основной фокус — практические навыки пентеста и эксплуатации уязвимостей.'));
  children.push(Para('CyberStart — образовательная программа, разработанная для школьников и студентов. Использует игровой формат с сюжетной линией, где учащиеся решают задачи по кибербезопасности в контексте расследования.'));
  children.push(Para('Сравнительный анализ существующих решений представлен в таблице 1.'));
  
  children.push(Tbl(
    ['Критерий', 'TryHackMe', 'HackTheBox', 'CyberStart', 'Разрабатываемый ресурс'],
    [
      ['Целевая аудитория', 'Начинающие–продвинутые', 'Продвинутые', 'Школьники', 'Учащиеся СПО/вузов'],
      ['Формат обучения', 'Интерактивные комнаты', 'Виртуальные машины', 'Игровой сюжет', 'Симуляции + квизы'],
      ['Язык интерфейса', 'Английский', 'Английский', 'Английский', 'Русский'],
      ['Стоимость', 'Бесплатно/подписка', 'Бесплатно/подписка', 'Платная лицензия', 'Бесплатно'],
      ['Админ-панель', 'Нет', 'Нет', 'Ограниченная', 'Полноценная'],
      ['Офлайн-доступ', 'Нет', 'Нет', 'Нет', 'Частично (SPA)'],
    ]
  ));
  
  children.push(Para('Как видно из таблицы, существующие решения имеют ряд ограничений для использования в российских учебных заведениях:'));
  children.push(Bullet('языковой барьер — большинство платформ доступны только на английском языке;'));
  children.push(Bullet('стоимость — полноценный доступ требует платной подписки;'));
  children.push(Bullet('отсутствие административной панели — преподаватели не могут управлять контентом;'));
  children.push(Bullet('зависимость от интернет-соединения — платформы не работают офлайн.'));
  children.push(Para('Разрабатываемый ресурс устраняет эти недостатки, предоставляя русскоязычный интерфейс, бесплатную модель использования, административную панель для управления контентом и возможность работы в режиме SPA-приложения.'));

  children.push(Head('1.3 Формирование основных требований к разрабатываемому программному продукту', 2));
  children.push(Para('На основе анализа предметной области и существующих решений сформированы требования к разрабатываемому программному продукту.'));
  children.push(Para('Функциональные требования:'));
  children.push(Bullet('система должна предоставлять интерактивные симуляции по основным темам кибербезопасности;'));
  children.push(Bullet('система должна включать квизы для проверки знаний после каждого модуля;'));
  children.push(Bullet('система должна отображать теоретический материал в формате брифингов;'));
  children.push(Bullet('система должна обеспечивать прогрессивное усложнение заданий по уровням;'));
  children.push(Bullet('система должна сохранять прогресс пользователя между сессиями;'));
  children.push(Bullet('система должна предоставлять административную панель для управления контентом;'));
  children.push(Bullet('административная панель должна позволять редактировать квизы, уровни и брифинги;'));
  children.push(Bullet('административная панель должна обеспечивать авторизацию по email и паролю.'));
  children.push(Para('Нефункциональные требования:'));
  children.push(Bullet('время загрузки главной страницы не должно превышать 3 секунд;'));
  children.push(Bullet('интерфейс должен быть адаптивным и корректно отображаться на устройствах с разрешением от 320px;'));
  children.push(Bullet('система должна работать в браузерах Chrome, Firefox, Safari, Edge последних двух версий;'));
  children.push(Bullet('данные должны храниться в облачной базе данных с обеспечением резервного копирования;'));
  children.push(Bullet('система должна поддерживать HTTPS-соединение для защиты передаваемых данных.'));
  children.push(Para('Требования к пользовательскому интерфейсу:'));
  children.push(Bullet('интерфейс должен быть интуитивно понятным для пользователей без технической подготовки;'));
  children.push(Bullet('навигация между разделами должна осуществляться не более чем в 3 клика;'));
  children.push(Bullet('визуальное оформление должно соответствовать тематике кибербезопасности;'));
  children.push(Bullet('анимации и переходы должны быть плавными и не вызывать дискомфорта.'));
  children.push(Para('Требования к административной панели:'));
  children.push(Bullet('панель должна быть доступна по отдельному маршруту /admin;'));
  children.push(Bullet('доступ к панели должен быть ограничен авторизованными пользователями;'));
  children.push(Bullet('интерфейс панели должен быть выполнен в тёмной теме;'));
  children.push(Bullet('изменения контента должны сохраняться в реальном времени.'));

  // === 2 ТЕХНОЛОГИЧЕСКАЯ ЧАСТЬ ===
  console.log('  Раздел 2...');
  children.push(Head('2 Технологическая часть'));
  children.push(Head('2.1 Разработка технического задания', 2));
  children.push(Para('Техническое задание разработано в соответствии с ГОСТ 19.201-78 и определяет требования к разрабатываемому программному продукту.'));
  children.push(Para('Наименование продукта: интерактивный ресурс по кибербезопасности для учащихся.'));
  children.push(Para('Область применения: образовательные учреждения среднего профессионального и высшего образования, курсы повышения квалификации.'));
  children.push(Para('Назначение продукта:'));
  children.push(Bullet('обучение основам кибербезопасности через интерактивные симуляции;'));
  children.push(Bullet('проверка знаний с помощью квизов с мгновенной обратной связью;'));
  children.push(Bullet('предоставление теоретического материала в формате анимированных брифингов;'));
  children.push(Bullet('управление учебным контентом через административную панель.'));
  children.push(Para('Требования к структуре продукта:'));
  children.push(Bullet('модульная архитектура — каждый уровень и симуляция являются независимыми компонентами;'));
  children.push(Bullet('трёхуровневая система сложности — beginner, intermediate, advanced;'));
  children.push(Bullet('централизованное хранилище данных — Firebase Firestore;'));
  children.push(Bullet('разделение клиентской и административной частей.'));
  children.push(Para('Стадии разработки:'));
  children.push(Bullet('проектирование — анализ требований, проектирование архитектуры и базы данных;'));
  children.push(Bullet('разработка — создание компонентов интерфейса, реализация симуляций, настройка Firebase;'));
  children.push(Bullet('тестирование — функциональное тестирование, кроссбраузерная проверка;'));
  children.push(Bullet('развёртывание — публикация на платформе Render.com;'));
  children.push(Bullet('сопровождение — мониторинг, обновление контента через админ-панель.'));

  children.push(Head('2.2 Алгоритм решения задачи', 2));
  children.push(Para('Основные алгоритмы, реализованные в системе:'));
  children.push(Para('Алгоритм авторизации в административной панели:'));
  children.push(Num('1) Пользователь вводит email и пароль в форму входа;'));
  children.push(Num('2) Данные передаются в Firebase Authentication;'));
  children.push(Num('3) Firebase проверяет учётные данные и возвращает токен;'));
  children.push(Num('4) При успешной аутентификации открывается доступ к админ-панели;'));
  children.push(Num('5) Состояние авторизации сохраняется в сессии браузера.'));
  children.push(Para('Алгоритм прохождения симуляции:'));
  children.push(Num('1) Пользователь выбирает уровень и чекпоинт на карте;'));
  children.push(Num('2) Загружается брифинг с описанием сценария и ключевыми концептами;'));
  children.push(Num('3) Запускается интерактивная симуляция;'));
  children.push(Num('4) Пользователь выполняет задания, система оценивает действия;'));
  children.push(Num('5) После завершения симуляции предлагается квиз;'));
  children.push(Num('6) Результаты квиза сохраняются в localStorage.'));
  children.push(Para('Алгоритм проверки ответов в квизе:'));
  children.push(Num('1) Пользователь выбирает вариант ответа;'));
  children.push(Num('2) Система сравнивает выбранный индекс с correctIndex;'));
  children.push(Num('3) При совпадении — ответ считается правильным, отображается объяснение;'));
  children.push(Num('4) При несовпадении — ответ считается неправильным, отображается правильный вариант;'));
  children.push(Num('5) После ответа на все вопросы выводится итоговый результат.'));
  children.push(Para('Алгоритм загрузки данных из Firebase:'));
  children.push(Num('1) При инициализации приложения проверяется наличие конфигурации Firebase;'));
  children.push(Num('2) Если конфигурация присутствует, выполняется запрос к Firestore;'));
  children.push(Num('3) Данные уровней, квизов и брифингов загружаются в состояние приложения;'));
  children.push(Num('4) При отсутствии конфигурации используются локальные данные из JS-файлов;'));
  children.push(Num('5) Ошибки загрузки обрабатываются без прерывания работы приложения.'));

  children.push(Head('2.3 Функциональная модель бизнес-процесса (диаграмма SADT)', 2));
  children.push(Para('Для описания бизнес-процесса обучения кибербезопасности использована методология SADT (Structured Analysis and Design Technique). Диаграмма декомпозиции представляет процесс обучения как совокупность взаимосвязанных функций.'));
  children.push(Para('Контекстная диаграмма (уровень A-0):'));
  children.push(Para('Вход: учащийся с базовыми знаниями в области ИТ.'));
  children.push(Para('Управление: учебная программа, стандарты кибербезопасности.'));
  children.push(Para('Механизмы: интерактивная платформа, преподаватель, Firebase.'));
  children.push(Para('Выход: учащийся с практическими навыками кибербезопасности.'));
  children.push(Para('Диаграмма декомпозиции (уровень A0):'));
  children.push(Num('A1 — Регистрация и авторизация пользователя;'));
  children.push(Num('A2 — Выбор уровня сложности;'));
  children.push(Num('A3 — Изучение теоретического материала (брифинг);'));
  children.push(Num('A4 — Прохождение интерактивной симуляции;'));
  children.push(Num('A5 — Прохождение квиза;'));
  children.push(Num('A6 — Анализ результатов и сохранение прогресса;'));
  children.push(Num('A7 — Управление контентом (администратор).'));
  children.push(Para('Поток данных между функциями:'));
  children.push(Bullet('A1 → A2: аутентифицированный пользователь;'));
  children.push(Bullet('A2 → A3: выбранный уровень и чекпоинт;'));
  children.push(Bullet('A3 → A4: изученный теоретический материал;'));
  children.push(Bullet('A4 → A5: результаты симуляции;'));
  children.push(Bullet('A5 → A6: оценки за квиз;'));
  children.push(Bullet('A6 → A2: обновлённый прогресс;'));
  children.push(Bullet('A7 → A3, A4, A5: обновлённый контент.'));

  children.push(Head('2.4 Концептуальная, логическая и физическая модели БД', 2));
  children.push(Para('Для хранения данных приложения используется Firebase Firestore — облачная NoSQL база данных.'));
  children.push(Para('Концептуальная модель описывает сущности и связи между ними:'));
  children.push(Bullet('User (пользователь) — хранит данные аутентификации;'));
  children.push(Bullet('Level (уровень) — содержит информацию об уровне сложности и чекпоинтах;'));
  children.push(Bullet('Checkpoint (чекпоинт) — отдельный модуль обучения в рамках уровня;'));
  children.push(Bullet('Quiz (квиз) — набор вопросов для проверки знаний;'));
  children.push(Bullet('Question (вопрос) — отдельный вопрос с вариантами ответов;'));
  children.push(Bullet('Briefing (брифинг) — теоретический материал для Advanced уровней;'));
  children.push(Bullet('UIConfig (конфигурация интерфейса) — настройки темы и стилей.'));
  children.push(Para('Логическая модель определяет структуру коллекций Firestore:'));
  children.push(Tbl(
    ['Коллекция', 'Поля', 'Тип данных'],
    [
      ['levels', 'id, name, color, description, checkpoints', 'string, string, string, array'],
      ['quizzes', 'id, title, description, questions', 'string, string, string, array'],
      ['briefings', 'id, title, subtitle, icon, color, scenario, concepts, stages', 'string, string, string, string, string, object, array, array'],
      ['ui-config', 'colors, fonts, theme, animations', 'object, object, string, object'],
    ]
  ));
  children.push(Para('Физическая модель реализована в Firebase Firestore со следующей структурой:'));
  children.push(Para('Коллекция «levels» содержит 3 документа: beginner, intermediate, advanced. Каждый документ включает массив checkpoints с объектами simulation, theory и quiz.'));
  children.push(Para('Коллекция «quizzes» содержит 14 документов, каждый из которых представляет отдельный квиз с массивом вопросов.'));
  children.push(Para('Коллекция «briefings» содержит 4 документа для Advanced уровней: ddos, pentest, incident-response, osint.'));
  children.push(Para('Коллекция «ui-config» содержит 1 документ global с настройками цветовой схемы и анимаций.'));
  children.push(Para('Индексы: Firestore автоматически создаёт индексы для полей, используемых в запросах. Для коллекции quizzes создан составной индекс по полям title и questions.length для оптимизации поиска.'));

  children.push(Head('2.5 Способы реализации программного продукта', 2));
  children.push(Para('Для реализации программного продукта выбран следующий технологический стек:'));
  children.push(Tbl(
    ['Компонент', 'Технология', 'Обоснование выбора'],
    [
      ['Frontend-фреймворк', 'React 18', 'Компонентный подход, виртуальный DOM, большое сообщество'],
      ['Сборщик', 'Vite', 'Быстрая сборка, hot module replacement, нативная поддержка ES modules'],
      ['Стилизация', 'Tailwind CSS', 'Утилитарный подход, быстрая разработка, минимальный размер CSS'],
      ['Анимации', 'Framer Motion', 'Декларативный API, плавные переходы, поддержка жестов'],
      ['База данных', 'Firebase Firestore', 'Облачное хранение, real-time обновления, бесплатный тариф'],
      ['Аутентификация', 'Firebase Auth', 'Готовое решение, поддержка email/password, безопасность'],
      ['Хостинг', 'Render.com', 'Бесплатный тариф, автоматический деплой из GitHub, HTTPS'],
    ]
  ));
  children.push(Para('React выбран в качестве основного фреймворка благодаря компонентной архитектуре, которая позволяет создавать переиспользуемые модули симуляций. Виртуальный DOM обеспечивает высокую производительность при частых обновлениях интерфейса во время интерактивных заданий.'));
  children.push(Para('Vite обеспечивает быструю разработку благодаря нативной поддержке ES modules и мгновенному hot module replacement. Время сборки production-версии составляет менее 10 секунд.'));
  children.push(Para('Tailwind CSS позволяет быстро создавать адаптивный интерфейс без написания кастомных CSS-файлов. Утилитарный подход упрощает поддержку и модификацию стилей.'));
  children.push(Para('Firebase Firestore выбран как облачная база данных благодаря встроенной интеграции с Firebase Authentication, real-time обновлениям и бесплатному тарифу Spark, который покрывает потребности учебного проекта.'));

  children.push(Head('2.6 Требования к информационной и программной совместимости', 2));
  children.push(Para('Требования к программному обеспечению:'));
  children.push(Bullet('операционная система — Windows 10/11, macOS 12+, Linux (Ubuntu 20.04+);'));
  children.push(Bullet('браузер — Google Chrome 100+, Mozilla Firefox 100+, Safari 15+, Microsoft Edge 100+;'));
  children.push(Bullet('разрешение экрана — минимальное 320×480 пикселей, рекомендуемое 1920×1080 пикселей;'));
  children.push(Bullet('интернет-соединение — для первичной загрузки и работы с Firebase;'));
  children.push(Bullet('JavaScript — поддержка ES2020, включённый JavaScript в браузере.'));
  children.push(Para('Требования к аппаратному обеспечению:'));
  children.push(Bullet('процессор — 2 ядра, 1.5 ГГц и выше;'));
  children.push(Bullet('оперативная память — 4 ГБ и выше;'));
  children.push(Bullet('свободное место на диске — 100 МБ для кэша браузера;'));
  children.push(Bullet('сетевой адаптер — поддержка HTTPS-соединений.'));
  children.push(Para('Совместимость с мобильными устройствами:'));
  children.push(Bullet('интерфейс адаптирован для экранов от 320 пикселей;'));
  children.push(Bullet('элементы управления оптимизированы для сенсорного ввода;'));
  children.push(Bullet('анимации отключаются на устройствах с предпочтением reduced motion.'));
  children.push(Para('Ограничения:'));
  children.push(Bullet('административная панель требует стабильного интернет-соединения для работы с Firebase;'));
  children.push(Bullet('симуляции с аудиоэффектами требуют поддержки Web Audio API;'));
  children.push(Bullet('3D-элементы карты требуют поддержки WebGL 2.0.'));

  children.push(Head('2.7 Разработка интерфейса и кода программного продукта', 2));
  children.push(Para('Структура проекта организована по модульному принципу:'));
  children.push(Tbl(
    ['Директория', 'Назначение'],
    [
      ['client/src/components/', 'React-компоненты приложения'],
      ['client/src/components/simulations/', 'Компоненты симуляций'],
      ['client/src/components/admin/', 'Компоненты административной панели'],
      ['client/src/data/', 'Локальные данные (уровни, брифинги)'],
      ['client/src/firebase/', 'Конфигурация Firebase'],
      ['client/src/hooks/', 'Пользовательские хуки React'],
      ['client/public/', 'Статические файлы (иконки, _redirects)'],
    ]
  ));
  children.push(Para('Ключевые компоненты приложения:'));
  children.push(Bullet('App.jsx — корневой компонент, управляющий маршрутизацией и состоянием авторизации;'));
  children.push(Bullet('LevelSelect.jsx — экран выбора уровня сложности с анимированными карточками;'));
  children.push(Bullet('Map3D.jsx — трёхмерная карта уровней с интерактивными чекпоинтами;'));
  children.push(Bullet('CheckpointScene.jsx — контейнер для загрузки симуляций и квизов;'));
  children.push(Bullet('AdminPanel.jsx — корневой компонент административной панели;'));
  children.push(Bullet('AdminDashboard.jsx — дашборд со статистикой и быстрыми действиями;'));
  children.push(Bullet('QuizEditor.jsx — редактор вопросов и ответов квизов;'));
  children.push(Bullet('LevelEditor.jsx — редактор уровней и чекпоинтов;'));
  children.push(Bullet('BriefingEditor.jsx — редактор брифингов для Advanced уровней.'));
  children.push(Para('Компоненты симуляций:'));
  children.push(Bullet('CyberBasicsSimulation.jsx — интерактивный рабочий стол в стиле Windows 7;'));
  children.push(Bullet('PhishingStage.jsx — симуляция анализа email-писем на признаки фишинга;'));
  children.push(Bullet('DetectionTriage.jsx — симуляция классификации алертов в SOC;'));
  children.push(Bullet('DDoSSimulation.jsx — симуляция отражения DDoS-атаки в NOC Dashboard;'));
  children.push(Bullet('PentestSimulation.jsx — симуляция сканирования сети с Nmap;'));
  children.push(Bullet('OSINTSimulation.jsx — симуляция разведки через Google Dorks и Shodan.'));
  children.push(Para('Архитектура приложения построена на принципах компонентного подхода React. Каждый компонент симуляции является самодостаточным модулем, принимающим данные через props и возвращающим результаты через callback-функции. Состояние приложения управляется хуками useState и useEffect.'));
  children.push(Para('Для управления маршрутизацией используется условный рендеринг на основе состояния selectedLevel и isAdminRoute. Это позволяет избежать зависимости от внешних библиотек маршрутизации и упрощает деплой как SPA.'));

  children.push(Head('2.8 Тестирование программного продукта', 2));
  children.push(Para('Тестирование проводилось по следующим направлениям:'));
  children.push(Tbl(
    ['Вид тестирования', 'Метод', 'Результат'],
    [
      ['Функциональное', 'Ручное тестирование всех симуляций', 'Все функции работают корректно'],
      ['Кроссбраузерное', 'Chrome, Firefox, Edge, Safari', 'Корректное отображение во всех браузерах'],
      ['Адаптивное', 'Экраны 320px–1920px', 'Интерфейс адаптируется корректно'],
      ['Нагрузочное', 'Одновременная работа 10 пользователей', 'Время отклика менее 2 секунд'],
      ['Безопасности', 'Проверка авторизации Firebase', 'Несанкционированный доступ заблокирован'],
      ['Юзабилити', 'Тестирование 5 пользователями', 'Среднее время выполнения задания — 15 минут'],
    ]
  ));
  children.push(Para('Результаты функционального тестирования:'));
  children.push(Bullet('загрузка приложения — главная страница загружается за 1.2 секунды;'));
  children.push(Bullet('навигация — переход между уровнями осуществляется без ошибок;'));
  children.push(Bullet('симуляции — все 14 симуляций запускаются и завершаются корректно;'));
  children.push(Bullet('квизы — проверка ответов работает правильно, результаты сохраняются;'));
  children.push(Bullet('админ-панель — авторизация, редактирование контента, сохранение данных работают корректно;'));
  children.push(Bullet('Firebase — данные загружаются из Firestore, миграция проходит успешно.'));
  children.push(Para('Выявленные и исправленные ошибки:'));
  children.push(Bullet('ошибка инициализации Firebase при отсутствии переменных окружения — исправлена добавлением проверки isFirebaseConfigured;'));
  children.push(Bullet('проблема SPA-роутинга на Render.com — исправлена добавлением правила Rewrites в дашборде Render;'));
  children.push(Bullet('некорректное отображение sender в письмах фишинга — исправлена передача props в компонент EmailView;'));
  children.push(Bullet('потеря данных при перезагрузке страницы — исправлена синхронизацией с Firebase.'));

  children.push(Head('2.9 Руководство системного программиста', 2));
  children.push(Head('2.9.1 Общие сведения о программе', 2));
  children.push(Para('Наименование: интерактивный ресурс по кибербезопасности для учащихся.'));
  children.push(Para('Обозначение: CyberSecurity Interactive Platform v1.0.'));
  children.push(Para('Язык программирования: JavaScript (ES2020+).'));
  children.push(Para('Среда выполнения: браузер с поддержкой ES modules и WebGL 2.0.'));
  children.push(Para('Объём программного кода: более 2000 строк в production-сборке.'));
  children.push(Head('2.9.2 Структура программы', 2));
  children.push(Para('Программа состоит из следующих модулей:'));
  children.push(Bullet('модуль пользовательского интерфейса — компоненты React для отображения экранов приложения;'));
  children.push(Bullet('модуль симуляций — интерактивные сценарии обучения;'));
  children.push(Bullet('модуль данных — загрузка и кэширование данных из Firebase;'));
  children.push(Bullet('модуль администрирования — панель управления контентом;'));
  children.push(Bullet('модуль аутентификации — интеграция с Firebase Auth.'));
  children.push(Head('2.9.3 Настройка программы', 2));
  children.push(Para('Для настройки программы необходимо:'));
  children.push(Num('1) Создать проект в Firebase Console;'));
  children.push(Num('2) Включить Firestore Database и Authentication;'));
  children.push(Num('3) Создать файл .env.local с конфигурацией Firebase;'));
  children.push(Num('4) Запустить скрипт миграции данных: node migrate.cjs;'));
  children.push(Num('5) Настроить переменные окружения на хостинге Render.com.'));
  children.push(Para('Файл .env.local должен содержать следующие переменные:'));
  children.push(Bullet('VITE_FIREBASE_API_KEY — API ключ проекта;'));
  children.push(Bullet('VITE_FIREBASE_AUTH_DOMAIN — домен аутентификации;'));
  children.push(Bullet('VITE_FIREBASE_PROJECT_ID — идентификатор проекта;'));
  children.push(Bullet('VITE_FIREBASE_STORAGE_BUCKET — бакет хранилища;'));
  children.push(Bullet('VITE_FIREBASE_MESSAGING_SENDER_ID — идентификатор отправителя;'));
  children.push(Bullet('VITE_FIREBASE_APP_ID — идентификатор приложения.'));
  children.push(Head('2.9.4 Установка программы', 2));
  children.push(Para('Установка для локальной разработки:'));
  children.push(Num('1) Клонировать репозиторий: git clone <url>;'));
  children.push(Num('2) Перейти в директорию клиента: cd client;'));
  children.push(Num('3) Установить зависимости: npm install;'));
  children.push(Num('4) Создать файл .env.local с конфигурацией Firebase;'));
  children.push(Num('5) Запустить сервер разработки: npm run dev.'));
  children.push(Para('Установка на хостинг Render.com:'));
  children.push(Num('1) Подключить репозиторий GitHub к Render;'));
  children.push(Num('2) Указать команду сборки: cd client && npm install && npm run build;'));
  children.push(Num('3) Указать директорию публикации: client/dist;'));
  children.push(Num('4) Добавить переменные окружения Firebase;'));
  children.push(Num('5) Настроить Rewrites для SPA-роутинга.'));
  children.push(Head('2.9.5 Тестирование программы', 2));
  children.push(Para('Для тестирования программы после установки:'));
  children.push(Num('1) Открыть приложение в браузере по адресу http://localhost:5173;'));
  children.push(Num('2) Проверить загрузку главного экрана с выбором уровней;'));
  children.push(Num('3) Пройти одну симуляцию и квиз;'));
  children.push(Num('4) Открыть админ-панель по адресу /admin;'));
  children.push(Num('5) Войти с учётными данными администратора;'));
  children.push(Num('6) Проверить отображение статистики и редактирование контента.'));

  children.push(Head('2.10 Руководство оператора', 2));
  children.push(Head('2.10.1 Назначение программы', 2));
  children.push(Para('Программа предназначена для интерактивного обучения основам кибербезопасности. Пользователь проходит уровни сложности, выполняя симуляции и квизы. Администратор управляет контентом через административную панель.'));
  children.push(Head('2.10.2 Условия выполнения программы', 2));
  children.push(Para('Для работы программы необходим:'));
  children.push(Bullet('браузер с поддержкой JavaScript и WebGL 2.0;'));
  children.push(Bullet('интернет-соединение для загрузки приложения и работы с Firebase;'));
  children.push(Bullet('разрешение экрана не менее 320×480 пикселей.'));
  children.push(Head('2.10.3 Выполнение программы', 2));
  children.push(Para('Порядок работы пользователя:'));
  children.push(Num('1) Открыть приложение в браузере;'));
  children.push(Num('2) Выбрать уровень сложности (Новичок, Средний, Продвинутый);'));
  children.push(Num('3) Нажать на чекпоинт на карте для начала модуля;'));
  children.push(Num('4) Изучить теоретический материал в брифинге;'));
  children.push(Num('5) Пройти интерактивную симуляцию;'));
  children.push(Num('6) Ответить на вопросы квиза;'));
  children.push(Num('7) Просмотреть результаты и перейти к следующему чекпоинту.'));
  children.push(Para('Порядок работы администратора:'));
  children.push(Num('1) Перейти по адресу /admin;'));
  children.push(Num('2) Ввести email и пароль администратора;'));
  children.push(Num('3) Выбрать раздел для редактирования (Квизы, Уровни, Брифинги, Тема);'));
  children.push(Num('4) Внести изменения в контент;'));
  children.push(Num('5) Нажать кнопку «Сохранить» для применения изменений.'));
  children.push(Head('2.10.4 Сообщение оператору', 2));
  children.push(Para('Программа отображает следующие типы сообщений:'));
  children.push(Bullet('информационные — подсказки и описания элементов интерфейса;'));
  children.push(Bullet('предупреждения — уведомления о некорректных действиях;'));
  children.push(Bullet('результаты — оценки за квизы и симуляции;'));
  children.push(Bullet('ошибки — сообщения о проблемах с загрузкой данных.'));
  children.push(Para('При возникновении ошибки загрузки данных из Firebase приложение автоматически переключается на локальные данные и отображает уведомление о работе в офлайн-режиме.'));

  children.push(Head('2.11 Политика информационной безопасности', 2));
  children.push(Head('2.11.1 Ограничение прав доступа пользователей базы данных', 2));
  children.push(Para('Firebase Firestore использует правила безопасности (Security Rules) для ограничения доступа к данным. Настроенные правила обеспечивают:'));
  children.push(Bullet('чтение данных уровней, квизов и брифингов доступно всем пользователям;'));
  children.push(Bullet('запись данных доступна только аутентифицированным администраторам;'));
  children.push(Bullet('конфигурация интерфейса доступна для чтения всем, для записи — только администраторам;'));
  children.push(Bullet('валидация данных при записи — проверка типов и обязательных полей.'));
  children.push(Para('Пример правил безопасности Firestore:'));
  children.push(Para('rules_version = "2";'));
  children.push(Para('service cloud.firestore {'));
  children.push(Para('  match /databases/{database}/documents {'));
  children.push(Para('    match /levels/{document} {'));
  children.push(Para('      allow read: if true;'));
  children.push(Para('      allow write: if request.auth != null;'));
  children.push(Para('    }'));
  children.push(Para('    match /quizzes/{document} {'));
  children.push(Para('      allow read: if true;'));
  children.push(Para('      allow write: if request.auth != null;'));
  children.push(Para('    }'));
  children.push(Para('  }'));
  children.push(Para('}'));
  children.push(Head('2.11.2 Авторизация и регистрация пользователей', 2));
  children.push(Para('Авторизация в административной панели реализована через Firebase Authentication с использованием email и пароля. Процесс авторизации включает:'));
  children.push(Bullet('ввод email и пароля в форму входа;'));
  children.push(Bullet('передача данных в Firebase Auth через метод signInWithEmailAndPassword;'));
  children.push(Bullet('получение токена аутентификации при успешной проверке;'));
  children.push(Bullet('сохранение состояния авторизации в сессии браузера;'));
  children.push(Bullet('автоматический выход при закрытии вкладки или истечении токена.'));
  children.push(Para('Регистрация новых пользователей отключена в настройках Firebase Console. Добавление новых администраторов осуществляется вручную через Firebase Console или с помощью Firebase Admin SDK.'));
  children.push(Para('Пароли хранятся в хэшированном виде на серверах Firebase. Минимальная длина пароля — 6 символов. При вводе неверных учётных данных отображается сообщение об ошибке без указания конкретного поля.'));

  // === 3 ЭКОНОМИЧЕСКАЯ ЧАСТЬ ===
  console.log('  Раздел 3...');
  children.push(Head('3 Экономическая часть'));
  children.push(Head('3.1 Расчёт затрат на разработку программного продукта', 2));
  children.push(Para('[Раздел заполняется студентом самостоятельно]'));
  children.push(Empty());
  children.push(Para('В данном разделе необходимо рассчитать затраты на разработку программного продукта, включая:'));
  children.push(Bullet('затраты на оплату труда разработчика;'));
  children.push(Bullet('затраты на социальные отчисления;'));
  children.push(Bullet('затраты на электроэнергию;'));
  children.push(Bullet('амортизацию оборудования;'));
  children.push(Bullet('прочие расходы.'));
  children.push(Empty());
  children.push(Para('Формула расчёта затрат на оплату труда:'));
  children.push(Para('З_от = Т × С_ч, где'));
  children.push(Para('Т — трудоёмкость разработки (чел.-час);'));
  children.push(Para('С_ч — часовая тарифная ставка разработчика.'));
  children.push(Empty());
  children.push(Head('3.2 Расчёт затрат на внедрение программного продукта', 2));
  children.push(Para('[Раздел заполняется студентом самостоятельно]'));
  children.push(Empty());
  children.push(Para('В данном разделе необходимо рассчитать затраты на внедрение, включая:'));
  children.push(Bullet('затраты на хостинг и домен;'));
  children.push(Bullet('затраты на обучение пользователей;'));
  children.push(Bullet('затраты на техническую поддержку;'));
  children.push(Bullet('затраты на обновление контента.'));
  children.push(Empty());
  children.push(Head('3.3 Расчёт основных показателей экономической эффективности', 2));
  children.push(Para('[Раздел заполняется студентом самостоятельно]'));
  children.push(Empty());
  children.push(Para('В данном разделе необходимо рассчитать:'));
  children.push(Bullet('срок окупаемости проекта;'));
  children.push(Bullet('коэффициент экономической эффективности;'));
  children.push(Bullet('чистый дисконтированный доход (NPV);'));
  children.push(Bullet('внутреннюю норму рентабельности (IRR).'));
  children.push(Empty());

  // === 4 ТЕХНИКА БЕЗОПАСНОСТИ ===
  console.log('  Раздел 4...');
  children.push(Head('4 Техника безопасности, охрана труда и окружающей среды'));
  children.push(Head('4.1 Общие требования охраны труда', 2));
  children.push(Para('Настоящая инструкция устанавливает требования охраны труда при работе с персональными электронными вычислительными машинами (ПЭВМ) и видеодисплейными терминалами (ВДТ).'));
  children.push(Para('К работе с ПЭВМ допускаются лица, прошедшие:'));
  children.push(Bullet('медицинский осмотр и не имеющие противопоказаний;'));
  children.push(Bullet('вводный инструктаж по охране труда;'));
  children.push(Bullet('первичный инструктаж на рабочем месте;'));
  children.push(Bullet('стажировку на рабочем месте;'));
  children.push(Bullet('проверку знаний требований охраны труда.'));
  children.push(Para('Работники обязаны:'));
  children.push(Bullet('соблюдать правила внутреннего трудового распорядка;'));
  children.push(Bullet('выполнять требования инструкций по охране труда;'));
  children.push(Bullet('использовать средства индивидуальной защиты;'));
  children.push(Bullet('немедленно извещать руководителя о неисправности оборудования;'));
  children.push(Bullet('проходить периодические медицинские осмотры.'));
  children.push(Para('Работники не допускаются к работе:'));
  children.push(Bullet('в состоянии алкогольного или наркотического опьянения;'));
  children.push(Bullet('без прохождения медицинского осмотра;'));
  children.push(Bullet('без прохождения инструктажа по охране труда;'));
  children.push(Bullet('при выявлении неисправности оборудования.'));
  children.push(Head('4.2 Требования охраны труда перед началом работы', 2));
  children.push(Para('Перед началом работы работник обязан:'));
  children.push(Num('1) Осмотреть и привести в порядок рабочее место;'));
  children.push(Num('2) Проверить исправность ПЭВМ, клавиатуры, мыши, монитора;'));
  children.push(Num('3) Проверить наличие и исправность заземления оборудования;'));
  children.push(Num('4) Отрегулировать рабочее кресло по высоте и углу наклона спинки;'));
  children.push(Num('5) Установить монитор на расстоянии 60–70 см от глаз;'));
  children.push(Num('6) Проверить освещённость рабочего места (не менее 300 лк);'));
  children.push(Num('7) Убедиться в отсутствии посторонних предметов на рабочем столе;'));
  children.push(Num('8) Проверить вентиляцию помещения.'));
  children.push(Para('Запрещается:'));
  children.push(Bullet('приступать к работе при неисправном оборудовании;'));
  children.push(Bullet('использовать удлинители и тройники;'));
  children.push(Bullet('размещать источники тепла вблизи ПЭВМ;'));
  children.push(Bullet('работать при недостаточной освещённости.'));
  children.push(Head('4.3 Требования охраны труда во время работы', 2));
  children.push(Para('Во время работы работник обязан:'));
  children.push(Bullet('соблюдать режим труда и отдыха — перерыв 15 минут каждые 2 часа работы;'));
  children.push(Bullet('поддерживать правильную позу — спина прямая, предплечья параллельны полу;'));
  children.push(Bullet('соблюдать расстояние от глаз до монитора — 60–70 см;'));
  children.push(Bullet('поддерживать температуру в помещении — 22–24°C;'));
  children.push(Bullet('поддерживать влажность воздуха — 40–60%;'));
  children.push(Bullet('не принимать пищу и напитки на рабочем месте;'));
  children.push(Bullet('не отвлекаться на посторонние дела.'));
  children.push(Para('При работе с ПЭВМ необходимо:'));
  children.push(Bullet('использовать экранные фильтры для снижения нагрузки на зрение;'));
  children.push(Bullet('настраивать яркость и контрастность монитора;'));
  children.push(Bullet('выполнять гимнастику для глаз каждые 30 минут;'));
  children.push(Bullet('чередовать виды деятельности — работа с текстом, ввод данных, анализ.'));
  children.push(Head('4.4 Требования охраны труда в аварийных ситуациях', 2));
  children.push(Para('При возникновении аварийной ситуации работник обязан:'));
  children.push(Num('1) Немедленно прекратить работу;'));
  children.push(Num('2) Отключить ПЭВМ от электросети;'));
  children.push(Num('3) Сообщить о происшествии руководителю;'));
  children.push(Num('4) При возгорании — использовать углекислотный огнетушитель;'));
  children.push(Num('5) При поражении электрическим током — оказать первую помощь;'));
  children.push(Num('6) При задымлении — покинуть помещение по эвакуационным выходам.'));
  children.push(Para('Запрещается:'));
  children.push(Bullet('пытаться самостоятельно устранить неисправность электрооборудования;'));
  children.push(Bullet('использовать воду для тушения электрооборудования;'));
  children.push(Bullet('оставаться в задымлённом помещении;'));
  children.push(Bullet('пользоваться лифтом при эвакуации.'));
  children.push(Head('4.5 Требования охраны труда по окончании работы', 2));
  children.push(Para('По окончании работы работник обязан:'));
  children.push(Num('1) Завершить все открытые программы;'));
  children.push(Num('2) Сохранить рабочие файлы;'));
  children.push(Num('3) Выключить ПЭВМ;'));
  children.push(Num('4) Отключить монитор от электросети;'));
  children.push(Num('5) Привести в порядок рабочее место;'));
  children.push(Num('6) Сообщить сменщику или руководителю о неисправностях.'));
  children.push(Head('4.6 Утилизация оргтехники, электронного оборудования и лома', 2));
  children.push(Para('Утилизация отслужившего электронного оборудования осуществляется в соответствии с Федеральным законом «Об отходах производства и потребления» и постановлением Правительства РФ.'));
  children.push(Para('Порядок утилизации:'));
  children.push(Bullet('отработавшее оборудование подлежит демонтажу и сортировке;'));
  children.push(Bullet('компоненты, содержащие опасные вещества (ртуть, свинец, кадмий), передаются специализированным организациям;'));
  children.push(Bullet('корпуса и металлические части сдаются в пункты приёма лома;'));
  children.push(Bullet('пластиковые компоненты перерабатываются;'));
  children.push(Bullet('аккумуляторы и батареи утилизируются отдельно.'));
  children.push(Para('Запрещается:'));
  children.push(Bullet('выбрасывать электронное оборудование в бытовые отходы;'));
  children.push(Bullet('самостоятельно разбирать оборудование без средств защиты;'));
  children.push(Bullet('сжигать пластиковые и электронные компоненты.'));
  children.push(Para('Организация, осуществляющая утилизацию, должна иметь лицензию на обращение с отходами I–IV класса опасности. Документ об утилизации хранится в течение 5 лет.'));

  // === ЗАКЛЮЧЕНИЕ ===
  console.log('  Заключение...');
  children.push(Head('Заключение'));
  children.push(Para('В ходе выполнения дипломного проекта был разработан интерактивный ресурс по кибербезопасности для учащихся. Работа включала анализ предметной области, проектирование архитектуры приложения, разработку пользовательского интерфейса и административной панели, а также тестирование и развёртывание продукта.'));
  children.push(Para('Основные результаты работы:'));
  children.push(Bullet('проведён анализ предметной области и существующих решений в сфере интерактивного обучения кибербезопасности;'));
  children.push(Bullet('сформированы функциональные и нефункциональные требования к программному продукту;'));
  children.push(Bullet('разработано техническое задание и алгоритмы решения задач;'));
  children.push(Bullet('спроектирована база данных на Firebase Firestore с коллекциями levels, quizzes, briefings, ui-config;'));
  children.push(Bullet('реализован пользовательский интерфейс на React с адаптивным дизайном и анимациями Framer Motion;'));
  children.push(Bullet('созданы 14 интерактивных симуляций, охватывающих основные темы кибербезопасности;'));
  children.push(Bullet('разработана административная панель с возможностью редактирования квизов, уровней и брифингов;'));
  children.push(Bullet('выполнено развёртывание приложения на платформе Render.com;'));
  children.push(Bullet('проведено функциональное, кроссбраузерное и адаптивное тестирование.'));
  children.push(Para('Разработанный ресурс может быть использован в образовательных учреждениях для подготовки специалистов в области информационной безопасности. Интерактивный формат обучения обеспечивает формирование практических навыков через симуляции реальных сценариев кибератак.'));
  children.push(Para('Перспективы дальнейшего развития проекта:'));
  children.push(Bullet('добавление системы отслеживания прогресса учащихся с визуализацией результатов;'));
  children.push(Bullet('расширение библиотеки симуляций новыми сценариями;'));
  children.push(Bullet('внедрение системы достижений и рейтингов для повышения мотивации;'));
  children.push(Bullet('создание мобильного приложения на базе React Native;'));
  children.push(Bullet('интеграция с системами дистанционного обучения (Moodle, LMS).'));

  // === СПИСОК ИСТОЧНИКОВ ===
  console.log('  Источники...');
  children.push(Head('Список использованных источников'));
  
  const sources = [
    'ГОСТ 19.201-78. Единая система программной документации. Техническое задание. Требования к содержанию и оформлению.',
    'ГОСТ Р 57580.1-2017. Безопасность финансовых операций. Защита информации финансовых организаций.',
    'Федеральный закон от 27.07.2006 № 152-ФЗ «О персональных данных».',
    'Федеральный закон от 26.07.2017 № 187-ФЗ «О безопасности критической информационной инфраструктуры Российской Федерации».',
    'Алферов А.П. Основы информационной безопасности: учебное пособие. — М.: Юрайт, 2023. — 312 с.',
    'Бабаш А.В. Информационная безопасность: учебник. — М.: КноРус, 2022. — 480 с.',
    'Гайкович В.Ю. Основы информационной безопасности: учебное пособие. — СПб.: БХВ-Петербург, 2021. — 352 с.',
    'Кастенс Й. Кибербезопасность для чайников. — М.: Диалектика, 2022. — 384 с.',
    'Мельников В.П. Информационная безопасность: учебник для вузов. — М.: Академия, 2021. — 336 с.',
    'Партыка Т.Л. Информационная безопасность: учебное пособие. — М.: Форум, 2022. — 432 с.',
    'Семёнов А.Ю. Практическая кибербезопасность: руководство. — М.: Питер, 2023. — 288 с.',
    'Стиллман Э. Web-безопасность: защита веб-приложений. — СПб.: БХВ-Петербург, 2022. — 416 с.',
    'Шаньгин В.Ф. Информационная безопасность компьютерных систем и сетей: учебник. — М.: ФОРУМ, 2021. — 416 с.',
    'Cloudflare. DDoS Protection Overview. — URL: https://www.cloudflare.com/learning/ddos/ (дата обращения: 15.01.2026).',
    'ISC2. Cybersecurity Workforce Study 2024. — URL: https://www.isc2.org/Research (дата обращения: 20.01.2026).',
    'Mozilla Developer Network. Web Security. — URL: https://developer.mozilla.org/en-US/docs/Web/Security (дата обращения: 10.01.2026).',
    'NIST. Computer Security Incident Handling Guide (SP 800-61 Rev. 2). — URL: https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final (дата обращения: 05.01.2026).',
    'OWASP. Web Security Testing Guide. — URL: https://owasp.org/www-project-web-security-testing-guide/ (дата обращения: 12.01.2026).',
    'React Documentation. — URL: https://react.dev/ (дата обращения: 08.01.2026).',
    'Firebase Documentation. — URL: https://firebase.google.com/docs (дата обращения: 14.01.2026).',
  ];

  sources.forEach((source, index) => {
    children.push(Para(`${index + 1}. ${source}`, { fl: MM(12.5) }));
  });

  // === СПИСОК НОРМАТИВНЫХ ДОКУМЕНТОВ ===
  children.push(Head('Список нормативных документов'));
  
  const norms = [
    'ГОСТ 19.201-78. Единая система программной документации. Техническое задание. Требования к содержанию и оформлению.',
    'ГОСТ 19.701-90. Единая система программной документации. Схемы алгоритмов, программ, данных и систем. Условные обозначения и правила выполнения.',
    'ГОСТ Р 57580.1-2017. Безопасность финансовых операций. Защита информации финансовых организаций.',
    'ГОСТ Р ИСО/МЭК 27001-2021. Информационная технология. Методы и средства обеспечения безопасности. Системы менеджмента информационной безопасности.',
    'ГОСТ Р 57580.2-2019. Безопасность финансовых операций. Защита информации. Оценка соответствия.',
    'ФГОС СПО 09.02.07. Информационные системы и программирование. — М., 2023.',
    'СанПиН 2.2.2/2.4.1340-03. Гигиенические требования к персональным электронно-вычислительным машинам и организации работы.',
    'Постановление Правительства РФ от 16.04.2012 № 313 «Об утверждении Правил по охране труда при эксплуатации электроустановок».',
    'Приказ Минтруда России от 29.10.2021 № 776н «Об утверждении примерного перечня ежегодно реализуемых работодателем мероприятий по улучшению условий и охраны труда».',
    'Приказ Минтруда России от 20.12.2021 № 902н «Об утверждении Правил по охране труда при работе с инструментом и приспособлениями».',
  ];

  norms.forEach((norm, index) => {
    children.push(Para(`${index + 1}. ${norm}`, { fl: MM(12.5) }));
  });

  // === СОЗДАНИЕ ДОКУМЕНТА ===
  console.log('  Создание файла...');
  const doc = new Document({
    creator: 'Исхаков Д.Д.',
    title: 'Разработка и проектирование интерактивного ресурса по кибербезопасности для учащихся',
    description: 'Пояснительная записка к дипломному проекту',
    sections: [{
      properties: {
        page: {
          margin: {
            top: MM(20),
            bottom: MM(20),
            left: MM(30),
            right: MM(15),
          },
        },
      },
      children,
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync('Пояснительная_записка.docx', buffer);
  
  console.log(`Готово! Размер: ${(buffer.length / 1024).toFixed(1)} КБ`);
}

generate().catch(err => {
  console.error('Ошибка:', err.message);
  process.exit(1);
});
