import { db } from '../firebase/config';
import { collection, doc, setDoc } from 'firebase/firestore';
import { levels } from '../data/levels';
import { briefings } from '../data/briefings';

// Миграция уровней
async function migrateLevels() {
  console.log('Миграция уровней...');
  for (const [id, level] of Object.entries(levels)) {
    await setDoc(doc(db, 'levels', id), level);
    console.log(`  ✓ Уровень: ${id} (${level.checkpoints.length} чекпоинтов)`);
  }
  console.log('Уровни мигрированы!\n');
}

// Миграция брифингов
async function migrateBriefings() {
  console.log('Миграция брифингов...');
  for (const [id, briefing] of Object.entries(briefings)) {
    await setDoc(doc(db, 'briefings', id), briefing);
    console.log(`  ✓ Брифинг: ${id}`);
  }
  console.log('Брифинги мигрированы!\n');
}

// Миграция квизов — извлекаем из уровней и добавляем levelId
async function migrateQuizzes() {
  console.log('Миграция квизов...');
  let totalQuizzes = 0;

  for (const [levelId, level] of Object.entries(levels)) {
    for (const cp of level.checkpoints) {
      if (cp.quiz && cp.quiz.length > 0) {
        const quizId = `${cp.id}-quiz`;
        const quizData = {
          title: cp.title,
          description: `Квиз по теме "${cp.title}"`,
          levelId: levelId,
          levelName: level.name,
          questions: cp.quiz
        };
        await setDoc(doc(db, 'quizzes', quizId), quizData);
        console.log(`  ✓ Квиз: ${quizId} (${cp.quiz.length} вопросов, уровень: ${level.name})`);
        totalQuizzes++;
      }
    }
  }
  console.log(`\nВсего мигрировано квизов: ${totalQuizzes}\n`);
}

// Миграция UI конфигурации
async function migrateUIConfig() {
  console.log('Миграция UI конфигурации...');
  const uiConfig = {
    colors: {
      primary: '#00ff88',
      secondary: '#ffaa00',
      accent: '#ff4444',
      background: '#0a0a0a',
      text: '#ffffff'
    },
    fonts: {
      heading: 'sans-serif',
      body: 'sans-serif'
    },
    theme: 'dark',
    animations: {
      enabled: true,
      duration: 0.3
    }
  };
  await setDoc(doc(db, 'ui-config', 'global'), uiConfig);
  console.log('UI конфигурация мигрирована!\n');
}

// Запуск миграции
export async function runMigration() {
  console.log('=== Начало миграции данных в Firebase ===\n');

  try {
    await migrateLevels();
    await migrateBriefings();
    await migrateQuizzes();
    await migrateUIConfig();

    console.log('=== Миграция завершена! ===');
  } catch (error) {
    console.error('Ошибка миграции:', error);
  }
}

export default runMigration;
