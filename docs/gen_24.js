const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, convertMillimetersToTwip } = require('docx');
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
    spacing: { before: opts.before || 0, after: opts.after || 0, line: opts.line || 360 },
    indent: { firstLine: opts.fl !== undefined ? opts.fl : MM(12.5), left: MM(5), right: MM(5) },
  });
}

function Head(text) {
  return new Paragraph({
    children: [TR(text, { size: 28, bold: true })],
    alignment: AlignmentType.JUSTIFIED,
    spacing: { before: 0, after: 240, line: 360 },
    indent: { firstLine: 0, left: MM(5), right: MM(5) },
  });
}

function Bullet(text) {
  return Para('\u2013 ' + text, { before: 0, after: 0 });
}

function Center(text) {
  return new Paragraph({
    children: [TR(text, { size: 28, bold: true })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 240, line: 360 },
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
  const children = [];

  children.push(Center('2.4 Концептуальная, логическая и физическая модели БД'));
  children.push(Para('Проектирование базы данных выполнено в три этапа: концептуальное, логическое и физическое моделирование. В качестве СУБД используется Firebase Firestore — документо-ориентированная NoSQL база данных реального времени.'));

  children.push(Para('Концептуальная модель: Основные сущности предметной области: «Пользователь» (User) — хранит данные аутентификации и прогресс; «Чекпоинт» (Checkpoint) — учебный модуль с контентом; «Результат» (Result) — связь между пользователем и чекпоинтом с оценкой; «Уровень» (Level) — группа чекпоинтов по сложности; «Квиз» (Quiz) — вопросы для проверки знаний; «Брифинг» (Briefing) — теоретический материал; «Достижение» (Achievement) — награды пользователя.'));

  children.push(Para('Логическая модель: Структура коллекций Firestore:'));

  children.push(Para('Таблица 1 — Структура коллекции levels'));
  children.push(Tbl(
    ['Поле', 'Тип', 'Описание'],
    [
      ['title', 'string', 'Название уровня'],
      ['description', 'string', 'Описание уровня'],
      ['difficulty', 'string', 'Уровень сложности (beginner/intermediate/advanced)'],
      ['order', 'number', 'Порядковый номер уровня'],
      ['checkpoints', 'array', 'Массив чекпоинтов уровня'],
    ]
  ));

  children.push(Para('Таблица 2 — Структура коллекции checkpoints'));
  children.push(Tbl(
    ['Поле', 'Тип', 'Описание'],
    [
      ['title', 'string', 'Название чекпоинта'],
      ['levelId', 'string', 'Идентификатор уровня-родителя'],
      ['order', 'number', 'Порядковый номер в уровне'],
      ['simulation', 'object', 'Настройки симуляции (тип, сценарий)'],
      ['quiz', 'array', 'Массив вопросов квиза: { question, options, correctIndex }'],
      ['briefing', 'object', 'Ссылка на теоретический материал'],
    ]
  ));

  children.push(Para('Таблица 3 — Структура коллекции users'));
  children.push(Tbl(
    ['Поле', 'Тип', 'Описание'],
    [
      ['uid', 'string', 'Идентификатор пользователя (Firebase UID)'],
      ['displayName', 'string', 'Отображаемое имя'],
      ['email', 'string', 'Email (для зарегистрированных)'],
      ['createdAt', 'timestamp', 'Дата создания аккаунта'],
      ['lastLoginAt', 'timestamp', 'Дата последнего входа'],
      ['progress', 'map', 'Карта прогресса по чекпоинтам'],
      ['achievements', 'array', 'Массив полученных достижений'],
    ]
  ));

  children.push(Para('Таблица 4 — Структура коллекции quizzes'));
  children.push(Tbl(
    ['Поле', 'Тип', 'Описание'],
    [
      ['title', 'string', 'Название квиза'],
      ['description', 'string', 'Описание квиза'],
      ['questions', 'array', 'Массив вопросов: { question, options, correctIndex, explanation }'],
    ]
  ));

  children.push(Para('Таблица 5 — Структура коллекции briefings'));
  children.push(Tbl(
    ['Поле', 'Тип', 'Описание'],
    [
      ['id', 'string', 'Идентификатор брифинга'],
      ['title', 'string', 'Название'],
      ['subtitle', 'string', 'Подзаголовок'],
      ['icon', 'string', 'Иконка-эмодзи'],
      ['color', 'string', 'Цвет в формате HEX'],
      ['scenario', 'object', 'Сценарий (роль, компания, ситуация, цель)'],
      ['concepts', 'array', 'Массив ключевых понятий'],
      ['stages', 'array', 'Массив этапов обучения'],
    ]
  ));

  children.push(Para('Таблица 6 — Структура коллекции ui-config'));
  children.push(Tbl(
    ['Поле', 'Тип', 'Описание'],
    [
      ['theme', 'string', 'Тема оформления (dark/light)'],
      ['title', 'string', 'Заголовок приложения'],
      ['logo', 'string', 'URL или путь к логотипу'],
    ]
  ));

  children.push(Para('Физическая модель: База данных развёрнута в проекте Firebase cybersecurity-platform-c6bfc. Регион размещения данных — us-central1. Правила безопасности Firestore настроены на разграничение доступа: чтение и запись своих данных разрешены только аутентифицированному пользователю по UID; административные данные доступны только администратору.'));

  const doc = new Document({ sections: [{ children }] });
  const buffer = await Packer.toBuffer(doc);
  const outPath = 'docs/2.4_Model_BD_v2.docx';
  fs.writeFileSync(outPath, buffer);
  console.log('Готово! Файл: ' + outPath + ' (' + (buffer.length / 1024).toFixed(1) + ' КБ)');
}

generate().catch(console.error);
