import { db, isFirebaseConfigured } from '../firebase/config';
import { doc, getDoc, getDocs, collection, onSnapshot } from 'firebase/firestore';
import { levels as staticLevels } from '../data/levels';
import { briefings as staticBriefings } from '../data/briefings';

// Cache for Firestore data
let levelsCache = null;
let briefingsCache = null;
let quizzesCache = null;

/**
 * Загружает уровни из Firestore с fallback на статические данные
 */
export async function getLevels() {
  if (isFirebaseConfigured && db) {
    try {
      const snapshot = await getDocs(collection(db, 'levels'));
      if (!snapshot.empty) {
        levelsCache = {};
        snapshot.forEach(d => {
          levelsCache[d.id] = { id: d.id, ...d.data() };
        });
        return levelsCache;
      }
    } catch (error) {
      console.warn('Failed to load levels from Firestore, using static data:', error);
    }
  }
  return staticLevels;
}

/**
 * Загружает брифинги из Firestore с fallback на статические данные
 */
export async function getBriefings() {
  if (isFirebaseConfigured && db) {
    try {
      const snapshot = await getDocs(collection(db, 'briefings'));
      if (!snapshot.empty) {
        briefingsCache = {};
        snapshot.forEach(d => {
          briefingsCache[d.id] = { id: d.id, ...d.data() };
        });
        return briefingsCache;
      }
    } catch (error) {
      console.warn('Failed to load briefings from Firestore, using static data:', error);
    }
  }
  return staticBriefings;
}

/**
 * Загружает квизы из Firestore
 * Если Firestore не настроен или пуст — извлекает квизы из статических уровней
 */
export async function getQuizzes() {
  if (isFirebaseConfigured && db) {
    try {
      const snapshot = await getDocs(collection(db, 'quizzes'));
      if (!snapshot.empty) {
        quizzesCache = {};
        snapshot.forEach(d => {
          quizzesCache[d.id] = { id: d.id, ...d.data() };
        });
        return quizzesCache;
      }
    } catch (error) {
      console.warn('Failed to load quizzes from Firestore, extracting from static data:', error);
    }
  }
  // Fallback: extract quizzes from static levels
  quizzesCache = {};
  Object.values(staticLevels).forEach(level => {
    level.checkpoints.forEach(cp => {
      if (cp.quiz && cp.quiz.length > 0) {
        quizzesCache[cp.id + '-quiz'] = {
          id: cp.id + '-quiz',
          title: cp.title,
          description: `Квиз по теме "${cp.title}"`,
          levelId: level.id,
          levelName: level.name,
          questions: cp.quiz
        };
      }
    });
  });
  return quizzesCache;
}

/**
 * Real-time подписка на уровни
 */
export function subscribeToLevels(callback) {
  if (isFirebaseConfigured && db) {
    return onSnapshot(collection(db, 'levels'), (snapshot) => {
      if (!snapshot.empty) {
        const levels = {};
        snapshot.forEach(d => {
          levels[d.id] = { id: d.id, ...d.data() };
        });
        levelsCache = levels;
        callback(levels);
      } else {
        callback(staticLevels);
      }
    }, (error) => {
      console.warn('Firestore subscription error, using static data:', error);
      callback(staticLevels);
    });
  }
  callback(staticLevels);
  return () => {};
}

/**
 * Real-time подписка на квизы
 */
export function subscribeToQuizzes(callback) {
  if (isFirebaseConfigured && db) {
    return onSnapshot(collection(db, 'quizzes'), (snapshot) => {
      if (!snapshot.empty) {
        const quizzes = {};
        snapshot.forEach(d => {
          quizzes[d.id] = { id: d.id, ...d.data() };
        });
        quizzesCache = quizzes;
        callback(quizzes);
      } else {
        // Fallback: extract from static levels
        const fallback = {};
        Object.values(staticLevels).forEach(level => {
          level.checkpoints.forEach(cp => {
            if (cp.quiz && cp.quiz.length > 0) {
              fallback[cp.id + '-quiz'] = {
                id: cp.id + '-quiz',
                title: cp.title,
                levelId: level.id,
                levelName: level.name,
                questions: cp.quiz
              };
            }
          });
        });
        callback(fallback);
      }
    }, (error) => {
      console.warn('Firestore subscription error:', error);
      callback({});
    });
  }
  callback({});
  return () => {};
}

/**
 * Загружает один уровень по ID
 */
export async function getLevel(levelId) {
  if (isFirebaseConfigured && db) {
    try {
      const docSnap = await getDoc(doc(db, 'levels', levelId));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
    } catch (error) {
      console.warn('Failed to load level from Firestore:', error);
    }
  }
  return staticLevels[levelId] || null;
}

/**
 * Загружает один брифинг по ID
 */
export async function getBriefing(briefingId) {
  if (isFirebaseConfigured && db) {
    try {
      const docSnap = await getDoc(doc(db, 'briefings', briefingId));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
    } catch (error) {
      console.warn('Failed to load briefing from Firestore:', error);
    }
  }
  return staticBriefings[briefingId] || null;
}

/**
 * Загружает один квиз по ID
 */
export async function getQuiz(quizId) {
  console.log('[DataService.getQuiz] Called with quizId:', quizId);
  console.log('[DataService.getQuiz] isFirebaseConfigured:', isFirebaseConfigured, 'db:', !!db);
  
  if (isFirebaseConfigured && db) {
    try {
      const docSnap = await getDoc(doc(db, 'quizzes', quizId));
      console.log('[DataService.getQuiz] Firestore doc exists:', docSnap.exists());
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() };
        console.log('[DataService.getQuiz] Returning Firestore data, questions:', data.questions?.length);
        return data;
      }
    } catch (error) {
      console.warn('[DataService.getQuiz] Firestore error:', error);
    }
  }
  
  console.log('[DataService.getQuiz] Fallback to static data');
  // Fallback: find in static levels
  for (const level of Object.values(staticLevels)) {
    for (const cp of level.checkpoints) {
      if (cp.id + '-quiz' === quizId && cp.quiz) {
        console.log('[DataService.getQuiz] Found in static levels:', cp.id);
        return {
          id: quizId,
          title: cp.title,
          levelId: level.id,
          levelName: level.name,
          questions: cp.quiz
        };
      }
    }
  }
  console.log('[DataService.getQuiz] Not found anywhere, returning null');
  return null;
}

/**
 * Получает все чекпоинты из всех уровней
 */
export async function getAllCheckpoints() {
  const levels = await getLevels();
  const checkpoints = [];
  Object.values(levels).forEach(level => {
    level.checkpoints.forEach(cp => {
      checkpoints.push({ ...cp, levelId: level.id, levelName: level.name, levelColor: level.color });
    });
  });
  return checkpoints;
}

/**
 * Получает квизы, сгруппированные по уровням
 */
export async function getQuizzesByLevel() {
  const levels = await getLevels();
  const quizzes = await getQuizzes();
  const grouped = {};

  // Initialize groups
  Object.values(levels).forEach(level => {
    grouped[level.id] = {
      level: level,
      quizzes: []
    };
  });

  // Group quizzes
  Object.values(quizzes).forEach(quiz => {
    const levelId = quiz.levelId;
    if (grouped[levelId]) {
      grouped[levelId].quizzes.push(quiz);
    }
  });

  return grouped;
}

/**
 * Запуск миграции данных из статических файлов в Firestore
 */
export async function runMigration() {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase не настроен');
  }

  const { setDoc, doc: firestoreDoc } = await import('firebase/firestore');
  let totalQuizzes = 0;

  console.log('=== Начало миграции данных в Firebase ===\n');

  // Миграция уровней
  console.log('Миграция уровней...');
  for (const [id, level] of Object.entries(staticLevels)) {
    await setDoc(firestoreDoc(db, 'levels', id), level);
    console.log(`  ✓ Уровень: ${id} (${level.checkpoints.length} чекпоинтов)`);
  }

  // Миграция брифингов
  console.log('\nМиграция брифингов...');
  for (const [id, briefing] of Object.entries(staticBriefings)) {
    await setDoc(firestoreDoc(db, 'briefings', id), briefing);
    console.log(`  ✓ Брифинг: ${id}`);
  }

  // Миграция квизов
  console.log('\nМиграция квизов...');
  for (const [levelId, level] of Object.entries(staticLevels)) {
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
        await setDoc(firestoreDoc(db, 'quizzes', quizId), quizData);
        console.log(`  ✓ Квиз: ${quizId} (${cp.quiz.length} вопросов, уровень: ${level.name})`);
        totalQuizzes++;
      }
    }
  }

  // Миграция UI config
  console.log('\nМиграция UI конфигурации...');
  const uiConfig = {
    colors: { primary: '#00ff88', secondary: '#ffaa00', accent: '#ff4444', background: '#0a0a0a', text: '#ffffff' },
    fonts: { heading: 'sans-serif', body: 'sans-serif' },
    theme: 'dark',
    animations: { enabled: true, duration: 0.3 }
  };
  await setDoc(firestoreDoc(db, 'ui-config', 'global'), uiConfig);

  console.log(`\n=== Миграция завершена! Всего квизов: ${totalQuizzes} ===`);

  return { levels: Object.keys(staticLevels).length, briefings: Object.keys(staticBriefings).length, quizzes: totalQuizzes };
}
