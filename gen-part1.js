const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, HeadingLevel, BorderStyle, convertMillimetersToTwip, PageBreak } = require('docx');
const { T, P, H, TP, TC, B, N, Empty, Center } = require('./helpers');
const fs = require('fs');

async function generatePart1() {
  const children = [];

  // === ТИТУЛЬНЫЙ ЛИСТ ===
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
    children: [T('Выполнил: студент гр. 246А    ', { size: 24 }), T('Исхаков Д.Д.', { size: 24, italics: true })],
    alignment: AlignmentType.RIGHT,
    spacing: { line: 360 },
    indent: { right: convertMillimetersToTwip(5) },
  }));
  children.push(new Paragraph({
    children: [T('Руководитель:                    ', { size: 24 }), T('Бузова К.О.', { size: 24, italics: true })],
    alignment: AlignmentType.RIGHT,
    spacing: { line: 360, after: 480 },
    indent: { right: convertMillimetersToTwip(5) },
  }));
  
  for (let i = 0; i < 3; i++) children.push(Empty());
  children.push(Center('Бугульма, 2026', { size: 24 }));
  
  // === СОДЕРЖАНИЕ ===
  children.push(new PageBreak());
  children.push(new Paragraph({
    children: [T('СОДЕРЖАНИЕ', { size: 28, bold: true })],
    alignment: AlignmentType.JUSTIFIED,
    spacing: { before: 0, after: 240, line: 360 },
    indent: { firstLine: 0, left: 0, right: 0 },
  }));

  const tocItems = [
    { text: 'Введение', page: '3' },
    { text: '1 Общая часть', page: '5' },
    { text: '1.1 Анализ предметной области', page: '5' },
    { text: '1.2 Анализ существующих решений', page: '8' },
    { text: '1.3 Формирование основных требований к разрабатываемому программному продукту', page: '11' },
    { text: '2 Технологическая часть', page: '14' },
    { text: '2.1 Разработка технического задания', page: '14' },
    { text: '2.2 Алгоритм решения задачи', page: '17' },
    { text: '2.3 Функциональная модель бизнес-процесса (диаграмма SADT)', page: '19' },
    { text: '2.4 Концептуальная, логическая и физическая модели БД', page: '21' },
    { text: '2.5 Способы реализации программного продукта', page: '24' },
    { text: '2.6 Требования к информационной и программной совместимости', page: '26' },
    { text: '2.7 Разработка интерфейса и кода программного продукта', page: '28' },
    { text: '2.8 Тестирование программного продукта', page: '31' },
    { text: '2.9 Руководство системного программиста', page: '33' },
    { text: '2.10 Руководство оператора', page: '36' },
    { text: '2.11 Политика информационной безопасности', page: '38' },
    { text: '3 Экономическая часть', page: '41' },
    { text: '3.1 Расчёт затрат на разработку программного продукта', page: '41' },
    { text: '3.2 Расчёт затрат на внедрение программного продукта', page: '43' },
    { text: '3.3 Расчёт основных показателей экономической эффективности', page: '44' },
    { text: '4 Техника безопасности, охрана труда и окружающей среды', page: '45' },
    { text: 'Заключение', page: '50' },
    { text: 'Список использованных источников', page: '52' },
    { text: 'Список нормативных документов', page: '54' },
  ];

  tocItems.forEach(item => {
    children.push(new Paragraph({
      children: [
        new TextRun({ text: item.text, font: 'Times New Roman', size: 28 }),
        new TextRun({ text: '\t' + item.page, font: 'Times New Roman', size: 28 }),
      ],
      alignment: AlignmentType.JUSTIFIED,
      spacing: { before: 0, after: 0, line: 360 },
      indent: { firstLine: 0, left: 0, right: 0 },
    }));
  });

  // === ВВЕДЕНИЕ ===
  children.push(new PageBreak());
  children.push(H('Введение'));
  
  children.push(P('В современном мире информационные технологии проникают во все сферы жизни, и кибербезопасность становится одной из ключевых компетенций. По данным международных аналитических агентств, количество кибератак ежегодно увеличивается на 30–40%, при этом значительная часть инцидентов связана с недостаточной осведомлённостью пользователей.'));
  children.push(P('Интерактивные образовательные платформы позволяют эффективно формировать практические навыки в области кибербезопасности. В отличие от традиционных лекционных форматов, симуляции и тренажёры дают возможность отработать действия в безопасной среде, моделируя реальные сценарии угроз.'));
  children.push(P('Цель дипломного проекта — разработка и проектирование интерактивного ресурса по кибербезопасности для учащихся, обеспечивающего формирование практических навыков защиты информации через симуляции, квизы и обучающие модули.'));
  
  children.push(P('Для достижения цели поставлены следующие задачи:'));
  children.push(B('провести анализ предметной области и существующих решений в сфере интерактивного обучения кибербезопасности;'));
  children.push(B('сформировать функциональные и нефункциональные требования к разрабатываемому программному продукту;'));
  children.push(B('разработать техническое задание и алгоритмы решения задач;'));
  children.push(B('спроектировать базу данных и архитектуру приложения;'));
  children.push(B('реализовать пользовательский интерфейс и административную панель;'));
  children.push(B('провести тестирование программного продукта;'));
  children.push(B('разработать руководство пользователя и системного программиста.'));
  
  children.push(P('Объект исследования — процесс интерактивного обучения основам кибербезопасности.'));
  children.push(P('Предмет исследования — программный ресурс для интерактивного обучения кибербезопасности.'));
  children.push(P('Практическая значимость работы заключается в создании готового к использованию образовательного ресурса, который может быть применён в учебных заведениях для подготовки специалистов в области информационной безопасности.'));

  return children;
}

module.exports = { generatePart1 };
