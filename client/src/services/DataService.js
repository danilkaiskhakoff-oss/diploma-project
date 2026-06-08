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
        snapshot.forEach(doc => {
          levelsCache[doc.id] = { id: doc.id, ...doc.data() };
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
        snapshot.forEach(doc => {
          briefingsCache[doc.id] = { id: doc.id, ...doc.data() };
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
 * Если Firestore не настроен — извлекает квизы из статических уровней
 */
export async function getQuizzes() {
  if (isFirebaseConfigured && db) {
    try {
      const snapshot = await getDocs(collection(db, 'quizzes'));
      if (!snapshot.empty) {
        quizzesCache = {};
        snapshot.forEach(doc => {
          quizzesCache[doc.id] = { id: doc.id, ...doc.data() };
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
          title: cp.title + ' — Квиз',
          description: `Квиз по теме "${cp.title}"`,
          levelId: level.id,
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
      const levels = {};
      snapshot.forEach(doc => {
        levels[doc.id] = { id: doc.id, ...doc.data() };
      });
      levelsCache = levels;
      callback(levels);
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
      const quizzes = {};
      snapshot.forEach(doc => {
        quizzes[doc.id] = { id: doc.id, ...doc.data() };
      });
      quizzesCache = quizzes;
      callback(quizzes);
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
  if (isFirebaseConfigured && db) {
    try {
      const docSnap = await getDoc(doc(db, 'quizzes', quizId));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
    } catch (error) {
      console.warn('Failed to load quiz from Firestore:', error);
    }
  }
  // Fallback: find in static levels
  for (const level of Object.values(staticLevels)) {
    for (const cp of level.checkpoints) {
      if (cp.id + '-quiz' === quizId && cp.quiz) {
        return {
          id: quizId,
          title: cp.title + ' — Квиз',
          levelId: level.id,
          questions: cp.quiz
        };
      }
    }
  }
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
