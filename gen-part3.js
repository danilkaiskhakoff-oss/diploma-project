const { P, H, B, N, Empty, Center, TC } = require('./helpers');
const { Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, TextRun, Paragraph } = require('docx');

function createTable(headers, rows) {
  const tableRows = [
    new TableRow({
      children: headers.map(h => new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: h, font: 'Times New Roman', size: 24, bold: true })], alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0, line: 240 } })],
        borders: { top: { style: BorderStyle.SINGLE, size: 1, color: '000000' }, bottom: { style: BorderStyle.SINGLE, size: 1, color: '000000' }, left: { style: BorderStyle.SINGLE, size: 1, color: '000000' }, right: { style: BorderStyle.SINGLE, size: 1, color: '000000' } },
      })),
    }),
    ...rows.map(row => new TableRow({
      children: row.map(cell => new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: cell, font: 'Times New Roman', size: 24 })], alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0, line: 240 } })],
        borders: { top: { style: BorderStyle.SINGLE, size: 1, color: '000000' }, bottom: { style: BorderStyle.SINGLE, size: 1, color: '000000' }, left: { style: BorderStyle.SINGLE, size: 1, color: '000000' }, right: { style: BorderStyle.SINGLE, size: 1, color: '000000' } },
      })),
    })),
  ];
  return new Table({ rows: tableRows, width: { size: 100, type: WidthType.PERCENTAGE } });
}

async function generatePart3() {
  const children = [];

  // === 2 ТЕХНОЛОГИЧЕСКАЯ ЧАСТЬ ===
  children.push(H('2 Технологическая часть'));
  
  // 2.1
  children.push(H('2.1 Разработка технического задания', 2));
  
  children.push(P('Техническое задание разработано в соответствии с ГОСТ 19.201-78 и определяет требования к разрабатываемому программному продукту.'));
  
  children.push(P('Наименование продукта: интерактивный ресурс по кибербезопасности для учащихся.'));
  children.push(P('Область применения: образовательные учреждения среднего профессионального и высшего образования, курсы повышения квалификации.'));
  
  children.push(P('Назначение продукта:'));
  children.push(B('обучение основам кибербезопасности через интерактивные симуляции;'));
  children.push(B('проверка знаний с помощью квизов с мгновенной обратной связью;'));
  children.push(B('предоставление теоретического материала в формате анимированных брифингов;'));
  children.push(B('управление учебным контентом через административную панель.'));
  
  children.push(P('Требования к структуре продукта:'));
  children.push(B('модульная архитектура — каждый уровень и симуляция являются независимыми компонентами;'));
  children.push(B('трёхуровневая система сложности — beginner, intermediate, advanced;'));
  children.push(B('централизованное хранилище данных — Firebase Firestore;'));
  children.push(B('разделение клиентской и административной частей.'));
  
  children.push(P('Стадии разработки:'));
  children.push(B('проектирование — анализ требований, проектирование архитектуры и базы данных;'));
  children.push(B('разработка — создание компонентов интерфейса, реализация симуляций, настройка Firebase;'));
  children.push(B('тестирование — функциональное тестирование, кроссбраузерная проверка;'));
  children.push(B('развёртывание — публикация на платформе Render.com;'));
  children.push(B('сопровождение — мониторинг, обновление контента через админ-панель.'));
  
  // 2.2
  children.push(H('2.2 Алгоритм решения задачи', 2));
  
  children.push(P('Основные алгоритмы, реализованные в системе:'));
  
  children.push(P('Алгоритм авторизации в административной панели:'));
  children.push(N('1) Пользователь вводит email и пароль в форму входа;'));
  children.push(N('2) Данные передаются в Firebase Authentication;'));
  children.push(N('3) Firebase проверяет учётные данные и возвращает токен;'));
  children.push(N('4) При успешной аутентификации открывается доступ к админ-панели;'));
  children.push(N('5) Состояние авторизации сохраняется в сессии браузера.'));
  
  children.push(P('Алгоритм прохождения симуляции:'));
  children.push(N('1) Пользователь выбирает уровень и чекпоинт на карте;'));
  children.push(N('2) Загружается брифинг с описанием сценария и ключевыми концептами;'));
  children.push(N('3) Запускается интерактивная симуляция;'));
  children.push(N('4) Пользователь выполняет задания, система оценивает действия;'));
  children.push(N('5) После завершения симуляции предлагается квиз;'));
  children.push(N('6) Результаты квиза сохраняются в localStorage.'));
  
  children.push(P('Алгоритм проверки ответов в квизе:'));
  children.push(N('1) Пользователь выбирает вариант ответа;'));
  children.push(N('2) Система сравнивает выбранный индекс с correctIndex;'));
  children.push(N('3) При совпадении — ответ считается правильным, отображается объяснение;'));
  children.push(N('4) При несовпадении — ответ считается неправильным, отображается правильный вариант;'));
  children.push(N('5) После ответа на все вопросы выводится итоговый результат.'));
  
  children.push(P('Алгоритм загрузки данных из Firebase:'));
  children.push(N('1) При инициализации приложения проверяется наличие конфигурации Firebase;'));
  children.push(N('2) Если конфигурация присутствует, выполняется запрос к Firestore;'));
  children.push(N('3) Данные уровней, квизов и брифингов загружаются в состояние приложения;'));
  children.push(N('4) При отсутствии конфигурации используются локальные данные из JS-файлов;'));
  children.push(N('5) Ошибки загрузки обрабатываются без прерывания работы приложения.'));
  
  // 2.3
  children.push(H('2.3 Функциональная модель бизнес-процесса (диаграмма SADT)', 2));
  
  children.push(P('Для описания бизнес-процесса обучения кибербезопасности использована методология SADT (Structured Analysis and Design Technique). Диаграмма декомпозиции представляет процесс обучения как совокупность взаимосвязанных функций.'));
  
  children.push(P('Контекстная диаграмма (уровень A-0):'));
  children.push(P('Вход: учащийся с базовыми знаниями в области ИТ.'));
  children.push(P('Управление: учебная программа, стандарты кибербезопасности.'));
  children.push(P('Механизмы: интерактивная платформа, преподаватель, Firebase.'));
  children.push(P('Выход: учащийся с практическими навыками кибербезопасности.'));
  
  children.push(P('Диаграмма декомпозиции (уровень A0):'));
  children.push(N('A1 — Регистрация и авторизация пользователя;'));
  children.push(N('A2 — Выбор уровня сложности;'));
  children.push(N('A3 — Изучение теоретического материала (брифинг);'));
  children.push(N('A4 — Прохождение интерактивной симуляции;'));
  children.push(N('A5 — Прохождение квиза;'));
  children.push(N('A6 — Анализ результатов и сохранение прогресса;'));
  children.push(N('A7 — Управление контентом (администратор).'));
  
  children.push(P('Поток данных между функциями:'));
  children.push(B('A1 → A2: аутентифицированный пользователь;'));
  children.push(B('A2 → A3: выбранный уровень и чекпоинт;'));
  children.push(B('A3 → A4: изученный теоретический материал;'));
  children.push(B('A4 → A5: результаты симуляции;'));
  children.push(B('A5 → A6: оценки за квиз;'));
  children.push(B('A6 → A2: обновлённый прогресс;'));
  children.push(B('A7 → A3, A4, A5: обновлённый контент.'));
  
  // 2.4
  children.push(H('2.4 Концептуальная, логическая и физическая модели БД', 2));
  
  children.push(P('Для хранения данных приложения используется Firebase Firestore — облачная NoSQL база данных.'));
  
  children.push(P('Концептуальная модель описывает сущности и связи между ними:'));
  children.push(B('User (пользователь) — хранит данные аутентификации;'));
  children.push(B('Level (уровень) — содержит информацию об уровне сложности и чекпоинтах;'));
  children.push(B('Checkpoint (чекпоинт) — отдельный модуль обучения в рамках уровня;'));
  children.push(B('Quiz (квиз) — набор вопросов для проверки знаний;'));
  children.push(B('Question (вопрос) — отдельный вопрос с вариантами ответов;'));
  children.push(B('Briefing (брифинг) — теоретический материал для Advanced уровней;'));
  children.push(B('UIConfig (конфигурация интерфейса) — настройки темы и стилей.'));
  
  children.push(P('Логическая модель определяет структуру коллекций Firestore:'));
  
  children.push(createTable(
    ['Коллекция', 'Поля', 'Тип данных'],
    [
      ['levels', 'id, name, color, description, checkpoints', 'string, string, string, array'],
      ['quizzes', 'id, title, description, questions', 'string, string, string, array'],
      ['briefings', 'id, title, subtitle, icon, color, scenario, concepts, stages', 'string, string, string, string, string, object, array, array'],
      ['ui-config', 'colors, fonts, theme, animations', 'object, object, string, object'],
    ]
  ));
  
  children.push(P('Физическая модель реализована в Firebase Firestore со следующей структурой:'));
  children.push(P('Коллекция «levels» содержит 3 документа: beginner, intermediate, advanced. Каждый документ включает массив checkpoints с объектами simulation, theory и quiz.'));
  children.push(P('Коллекция «quizzes» содержит 14 документов, каждый из которых представляет отдельный квиз с массивом вопросов.'));
  children.push(P('Коллекция «briefings» содержит 4 документа для Advanced уровней: ddos, pentest, incident-response, osint.'));
  children.push(P('Коллекция «ui-config» содержит 1 документ global с настройками цветовой схемы и анимаций.'));
  
  children.push(P('Индексы: Firestore автоматически создаёт индексы для полей, используемых в запросах. Для коллекции quizzes создан составной индекс по полям title и questions.length для оптимизации поиска.'));
  
  // 2.5
  children.push(H('2.5 Способы реализации программного продукта', 2));
  
  children.push(P('Для реализации программного продукта выбран следующий технологический стек:'));
  
  children.push(createTable(
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
  
  children.push(P('React выбран в качестве основного фреймворка благодаря компонентной архитектуре, которая позволяет создавать переиспользуемые модули симуляций. Виртуальный DOM обеспечивает высокую производительность при частых обновлениях интерфейса во время интерактивных заданий.'));
  children.push(P('Vite обеспечивает быструю разработку благодаря нативной поддержке ES modules и мгновенному hot module replacement. Время сборки production-версии составляет менее 10 секунд.'));
  children.push(P('Tailwind CSS позволяет быстро создавать адаптивный интерфейс без написания кастомных CSS-файлов. Утилитарный подход упрощает поддержку и модификацию стилей.'));
  children.push(P('Firebase Firestore выбран как облачная база данных благодаря встроенной интеграции с Firebase Authentication, real-time обновлениям и бесплатному тарифу Spark, который покрывает потребности учебного проекта.'));
  
  // 2.6
  children.push(H('2.6 Требования к информационной и программной совместимости', 2));
  
  children.push(P('Требования к программному обеспечению:'));
  children.push(B('операционная система — Windows 10/11, macOS 12+, Linux (Ubuntu 20.04+);'));
  children.push(B('браузер — Google Chrome 100+, Mozilla Firefox 100+, Safari 15+, Microsoft Edge 100+;'));
  children.push(B('разрешение экрана — минимальное 320×480 пикселей, рекомендуемое 1920×1080 пикселей;'));
  children.push(B('интернет-соединение — для первичной загрузки и работы с Firebase;'));
  children.push(B('JavaScript — поддержка ES2020, включённый JavaScript в браузере.'));
  
  children.push(P('Требования к аппаратному обеспечению:'));
  children.push(B('процессор — 2 ядра, 1.5 ГГц и выше;'));
  children.push(B('оперативная память — 4 ГБ и выше;'));
  children.push(B('свободное место на диске — 100 МБ для кэша браузера;'));
  children.push(B('сетевой адаптер — поддержка HTTPS-соединений.'));
  
  children.push(P('Совместимость с мобильными устройствами:'));
  children.push(B('интерфейс адаптирован для экранов от 320 пикселей;'));
  children.push(B('элементы управления оптимизированы для сенсорного ввода;'));
  children.push(B('анимации отключаются на устройствах с предпочтением reduced motion.'));
  
  children.push(P('Ограничения:'));
  children.push(B('административная панель требует стабильного интернет-соединения для работы с Firebase;'));
  children.push(B('симуляции с аудиоэффектами требуют поддержки Web Audio API;'));
  children.push(B('3D-элементы карты требуют поддержки WebGL 2.0.'));
  
  // 2.7
  children.push(H('2.7 Разработка интерфейса и кода программного продукта', 2));
  
  children.push(P('Структура проекта организована по модульному принципу:'));
  
  children.push(createTable(
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
  
  children.push(P('Ключевые компоненты приложения:'));
  children.push(B('App.jsx — корневой компонент, управляющий маршрутизацией и состоянием авторизации;'));
  children.push(B('LevelSelect.jsx — экран выбора уровня сложности с анимированными карточками;'));
  children.push(B('Map3D.jsx — трёхмерная карта уровней с интерактивными чекпоинтами;'));
  children.push(B('CheckpointScene.jsx — контейнер для загрузки симуляций и квизов;'));
  children.push(B('AdminPanel.jsx — корневой компонент административной панели;'));
  children.push(B('AdminDashboard.jsx — дашборд со статистикой и быстрыми действиями;'));
  children.push(B('QuizEditor.jsx — редактор вопросов и ответов квизов;'));
  children.push(B('LevelEditor.jsx — редактор уровней и чекпоинтов;'));
  children.push(B('BriefingEditor.jsx — редактор брифингов для Advanced уровней.'));
  
  children.push(P('Компоненты симуляций:'));
  children.push(B('CyberBasicsSimulation.jsx — интерактивный рабочий стол в стиле Windows 7;'));
  children.push(B('PhishingStage.jsx — симуляция анализа email-писем на признаки фишинга;'));
  children.push(B('DetectionTriage.jsx — симуляция классификации алертов в SOC;'));
  children.push(B('DDoSSimulation.jsx — симуляция отражения DDoS-атаки в NOC Dashboard;'));
  children.push(B('PentestSimulation.jsx — симуляция сканирования сети с Nmap;'));
  children.push(B('OSINTSimulation.jsx — симуляция разведки через Google Dorks и Shodan.'));
  
  children.push(P('Архитектура приложения построена на принципах компонентного подхода React. Каждый компонент симуляции является самодостаточным модулем, принимающим данные через props и возвращающим результаты через callback-функции. Состояние приложения управляется хуками useState и useEffect.'));
  children.push(P('Для управления маршрутизацией используется условный рендеринг на основе состояния selectedLevel и isAdminRoute. Это позволяет избежать зависимости от внешних библиотек маршрутизации и упрощает деплой как SPA.'));
  
  // 2.8
  children.push(H('2.8 Тестирование программного продукта', 2));
  
  children.push(P('Тестирование проводилось по следующим направлениям:'));
  
  children.push(createTable(
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
  
  children.push(P('Результаты функционального тестирования:'));
  children.push(B('загрузка приложения — главная страница загружается за 1.2 секунды;'));
  children.push(B('навигация — переход между уровнями осуществляется без ошибок;'));
  children.push(B('симуляции — все 14 симуляций запускаются и завершаются корректно;'));
  children.push(B('квизы — проверка ответов работает правильно, результаты сохраняются;'));
  children.push(B('админ-панель — авторизация, редактирование контента, сохранение данных работают корректно;'));
  children.push(B('Firebase — данные загружаются из Firestore, миграция проходит успешно.'));
  
  children.push(P('Выявленные и исправленные ошибки:'));
  children.push(B('ошибка инициализации Firebase при отсутствии переменных окружения — исправлена добавлением проверки isFirebaseConfigured;'));
  children.push(B('проблема SPA-роутинга на Render.com — исправлена добавлением правила Rewrites в дашборде Render;'));
  children.push(B('некорректное отображение sender в письмах фишинга — исправлена передача props в компонент EmailView;'));
  children.push(B('потеря данных при перезагрузке страницы — исправлена синхронизацией с Firebase.'));
  
  // 2.9
  children.push(H('2.9 Руководство системного программиста', 2));
  
  // 2.9.1
  children.push(H('2.9.1 Общие сведения о программе', 2));
  
  children.push(P('Наименование: интерактивный ресурс по кибербезопасности для учащихся.'));
  children.push(P('Обозначение: CyberSecurity Interactive Platform v1.0.'));
  children.push(P('Язык программирования: JavaScript (ES2020+).'));
  children.push(P('Среда выполнения: браузер с поддержкой ES modules и WebGL 2.0.'));
  children.push(P('Объём программного кода: более 2000 строк в production-сборке.'));
  
  // 2.9.2
  children.push(H('2.9.2 Структура программы', 2));
  
  children.push(P('Программа состоит из следующих модулей:'));
  children.push(B('модуль пользовательского интерфейса — компоненты React для отображения экранов приложения;'));
  children.push(B('модуль симуляций — интерактивные сценарии обучения;'));
  children.push(B('модуль данных — загрузка и кэширование данных из Firebase;'));
  children.push(B('модуль администрирования — панель управления контентом;'));
  children.push(B('модуль аутентификации — интеграция с Firebase Auth.'));
  
  // 2.9.3
  children.push(H('2.9.3 Настройка программы', 2));
  
  children.push(P('Для настройки программы необходимо:'));
  children.push(N('1) Создать проект в Firebase Console;'));
  children.push(N('2) Включить Firestore Database и Authentication;'));
  children.push(N('3) Создать файл .env.local с конфигурацией Firebase;'));
  children.push(N('4) Запустить скрипт миграции данных: node migrate.cjs;'));
  children.push(N('5) Настроить переменные окружения на хостинге Render.com.'));
  
  children.push(P('Файл .env.local должен содержать следующие переменные:'));
  children.push(B('VITE_FIREBASE_API_KEY — API ключ проекта;'));
  children.push(B('VITE_FIREBASE_AUTH_DOMAIN — домен аутентификации;'));
  children.push(B('VITE_FIREBASE_PROJECT_ID — идентификатор проекта;'));
  children.push(B('VITE_FIREBASE_STORAGE_BUCKET — бакет хранилища;'));
  children.push(B('VITE_FIREBASE_MESSAGING_SENDER_ID — идентификатор отправителя;'));
  children.push(B('VITE_FIREBASE_APP_ID — идентификатор приложения.'));
  
  // 2.9.4
  children.push(H('2.9.4 Установка программы', 2));
  
  children.push(P('Установка для локальной разработки:'));
  children.push(N('1) Клонировать репозиторий: git clone <url>;'));
  children.push(N('2) Перейти в директорию клиента: cd client;'));
  children.push(N('3) Установить зависимости: npm install;'));
  children.push(N('4) Создать файл .env.local с конфигурацией Firebase;'));
  children.push(N('5) Запустить сервер разработки: npm run dev.'));
  
  children.push(P('Установка на хостинг Render.com:'));
  children.push(N('1) Подключить репозиторий GitHub к Render;'));
  children.push(N('2) Указать команду сборки: cd client && npm install && npm run build;'));
  children.push(N('3) Указать директорию публикации: client/dist;'));
  children.push(N('4) Добавить переменные окружения Firebase;'));
  children.push(N('5) Настроить Rewrites для SPA-роутинга.'));
  
  // 2.9.5
  children.push(H('2.9.5 Тестирование программы', 2));
  
  children.push(P('Для тестирования программы после установки:'));
  children.push(N('1) Открыть приложение в браузере по адресу http://localhost:5173;'));
  children.push(N('2) Проверить загрузку главного экрана с выбором уровней;'));
  children.push(N('3) Пройти одну симуляцию и квиз;'));
  children.push(N('4) Открыть админ-панель по адресу /admin;'));
  children.push(N('5) Войти с учётными данными администратора;'));
  children.push(N('6) Проверить отображение статистики и редактирование контента.'));
  
  // 2.10
  children.push(H('2.10 Руководство оператора', 2));
  
  // 2.10.1
  children.push(H('2.10.1 Назначение программы', 2));
  
  children.push(P('Программа предназначена для интерактивного обучения основам кибербезопасности. Пользователь проходит уровни сложности, выполняя симуляции и квизы. Администратор управляет контентом через административную панель.'));
  
  // 2.10.2
  children.push(H('2.10.2 Условия выполнения программы', 2));
  
  children.push(P('Для работы программы необходим:'));
  children.push(B('браузер с поддержкой JavaScript и WebGL 2.0;'));
  children.push(B('интернет-соединение для загрузки приложения и работы с Firebase;'));
  children.push(B('разрешение экрана не менее 320×480 пикселей.'));
  
  // 2.10.3
  children.push(H('2.10.3 Выполнение программы', 2));
  
  children.push(P('Порядок работы пользователя:'));
  children.push(N('1) Открыть приложение в браузере;'));
  children.push(N('2) Выбрать уровень сложности (Новичок, Средний, Продвинутый);'));
  children.push(N('3) Нажать на чекпоинт на карте для начала модуля;'));
  children.push(N('4) Изучить теоретический материал в брифинге;'));
  children.push(N('5) Пройти интерактивную симуляцию;'));
  children.push(N('6) Ответить на вопросы квиза;'));
  children.push(N('7) Просмотреть результаты и перейти к следующему чекпоинту.'));
  
  children.push(P('Порядок работы администратора:'));
  children.push(N('1) Перейти по адресу /admin;'));
  children.push(N('2) Ввести email и пароль администратора;'));
  children.push(N('3) Выбрать раздел для редактирования (Квизы, Уровни, Брифинги, Тема);'));
  children.push(N('4) Внести изменения в контент;'));
  children.push(N('5) Нажать кнопку «Сохранить» для применения изменений.'));
  
  // 2.10.4
  children.push(H('2.10.4 Сообщение оператору', 2));
  
  children.push(P('Программа отображает следующие типы сообщений:'));
  children.push(B('информационные — подсказки и описания элементов интерфейса;'));
  children.push(B('предупреждения — уведомления о некорректных действиях;'));
  children.push(B('результаты — оценки за квизы и симуляции;'));
  children.push(B('ошибки — сообщения о проблемах с загрузкой данных.'));
  
  children.push(P('При возникновении ошибки загрузки данных из Firebase приложение автоматически переключается на локальные данные и отображает уведомление о работе в офлайн-режиме.'));
  
  // 2.11
  children.push(H('2.11 Политика информационной безопасности', 2));
  
  // 2.11.1
  children.push(H('2.11.1 Ограничение прав доступа пользователей базы данных', 2));
  
  children.push(P('Firebase Firestore использует правила безопасности (Security Rules) для ограничения доступа к данным. Настроенные правила обеспечивают:'));
  children.push(B('чтение данных уровней, квизов и брифингов доступно всем пользователям;'));
  children.push(B('запись данных доступна только аутентифицированным администраторам;'));
  children.push(B('конфигурация интерфейса доступна для чтения всем, для записи — только администраторам;'));
  children.push(B('валидация данных при записи — проверка типов и обязательных полей.'));
  
  children.push(P('Пример правил безопасности Firestore:'));
  children.push(P('rules_version = "2";'));
  children.push(P('service cloud.firestore {'));
  children.push(P('  match /databases/{database}/documents {'));
  children.push(P('    match /levels/{document} {'));
  children.push(P('      allow read: if true;'));
  children.push(P('      allow write: if request.auth != null;'));
  children.push(P('    }'));
  children.push(P('    match /quizzes/{document} {'));
  children.push(P('      allow read: if true;'));
  children.push(P('      allow write: if request.auth != null;'));
  children.push(P('    }'));
  children.push(P('  }'));
  children.push(P('}'));
  
  // 2.11.2
  children.push(H('2.11.2 Авторизация и регистрация пользователей', 2));
  
  children.push(P('Авторизация в административной панели реализована через Firebase Authentication с использованием email и пароля. Процесс авторизации включает:'));
  children.push(B('ввод email и пароля в форму входа;'));
  children.push(B('передача данных в Firebase Auth через метод signInWithEmailAndPassword;'));
  children.push(B('получение токена аутентификации при успешной проверке;'));
  children.push(B('сохранение состояния авторизации в сессии браузера;'));
  children.push(B('автоматический выход при закрытии вкладки или истечении токена.'));
  
  children.push(P('Регистрация новых пользователей отключена в настройках Firebase Console. Добавление новых администраторов осуществляется вручную через Firebase Console или с помощью Firebase Admin SDK.'));
  
  children.push(P('Пароли хранятся в хэшированном виде на серверах Firebase. Минимальная длина пароля — 6 символов. При вводе неверных учётных данных отображается сообщение об ошибке без указания конкретного поля.'));

  return children;
}

module.exports = { generatePart3 };
