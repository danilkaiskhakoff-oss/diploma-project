import { db, isFirebaseConfigured } from '../firebase/config';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  updateDoc
} from 'firebase/firestore';
import { levels } from '../data/levels';

const GUEST_PREFIX = 'cyberedu_progress_';

function getGuestKey(userId) {
  return GUEST_PREFIX + userId;
}

export async function saveProgress(userId, isRegistered, levelId, checkpointId, data) {
  const progressData = {
    completed: true,
    score: data.score || 0,
    total: data.total || 0,
    completedAt: new Date().toISOString()
  };

  if (isRegistered && isFirebaseConfigured && db) {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const progress = userData.progress || {};
        progress[levelId] = progress[levelId] || {};
        progress[levelId][checkpointId] = progressData;

        await updateDoc(userRef, { progress });
      } else {
        await setDoc(userRef, {
          progress: { [levelId]: { [checkpointId]: progressData } },
          createdAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error saving progress to Firestore:', error);
    }
  } else {
    try {
      const key = getGuestKey(userId);
      const existing = JSON.parse(localStorage.getItem(key) || '{}');
      existing[levelId] = existing[levelId] || {};
      existing[levelId][checkpointId] = progressData;
      localStorage.setItem(key, JSON.stringify(existing));
    } catch (error) {
      console.error('Error saving guest progress:', error);
    }
  }
}

export async function getProgress(userId, isRegistered) {
  if (isRegistered && isFirebaseConfigured && db) {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        return userSnap.data().progress || {};
      }
    } catch (error) {
      console.error('Error loading progress from Firestore:', error);
    }
    return {};
  } else {
    try {
      const key = getGuestKey(userId);
      return JSON.parse(localStorage.getItem(key) || '{}');
    } catch (error) {
      console.error('Error loading guest progress:', error);
      return {};
    }
  }
}

export async function resetProgress(userId, isRegistered) {
  if (isRegistered && isFirebaseConfigured && db) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { progress: {} });
    } catch (error) {
      console.error('Error resetting progress:', error);
    }
  } else {
    const key = getGuestKey(userId);
    localStorage.removeItem(key);
  }
}

export function getCompletedCheckpoints(progress, levelId) {
  const levelProgress = progress?.[levelId] || {};
  return Object.entries(levelProgress)
    .filter(([, data]) => data.completed)
    .map(([id]) => id);
}

export function calculateStats(progress) {
  let totalCheckpoints = 0;
  let completedCheckpoints = 0;
  let totalScore = 0;
  let totalPossible = 0;
  const levelStats = {};
  const details = [];

  Object.entries(levels).forEach(([levelId, level]) => {
    const levelProgress = progress?.[levelId] || {};
    const levelCheckpoints = level.checkpoints.length;
    totalCheckpoints += levelCheckpoints;

    let levelCompleted = 0;
    let levelScore = 0;
    let levelPossible = 0;

    level.checkpoints.forEach(cp => {
      const cpData = levelProgress[cp.id];
      totalCheckpoints++;

      if (cpData && cpData.completed) {
        completedCheckpoints++;
        levelCompleted++;
        totalScore += cpData.score;
        totalPossible += cpData.total;
        levelScore += cpData.score;
        levelPossible += cpData.total;

        details.push({
          checkpointId: cp.id,
          title: cp.title,
          levelId,
          levelName: level.name,
          levelColor: level.color,
          completed: true,
          score: cpData.score,
          total: cpData.total,
          completedAt: cpData.completedAt
        });
      } else {
        details.push({
          checkpointId: cp.id,
          title: cp.title,
          levelId,
          levelName: level.name,
          levelColor: level.color,
          completed: false,
          score: 0,
          total: cp.quiz?.length || 0,
          completedAt: null
        });
      }
    });

    levelStats[levelId] = {
      name: level.name,
      color: level.color,
      completed: levelCompleted,
      total: levelCheckpoints,
      percentage: levelCheckpoints > 0 ? Math.round((levelCompleted / levelCheckpoints) * 100) : 0,
      score: levelScore,
      possible: levelPossible
    };
  });

  const overallPercentage = totalCheckpoints > 0 ? Math.round((completedCheckpoints / totalCheckpoints) * 100) : 0;
  const averageScore = totalPossible > 0 ? (totalScore / totalPossible).toFixed(1) : '0.0';

  return {
    totalCheckpoints,
    completedCheckpoints,
    overallPercentage,
    averageScore,
    levelStats,
    details
  };
}

export function getAchievements(progress) {
  const stats = calculateStats(progress);
  const achievements = [];

  const allLevels = Object.values(stats.levelStats);
  const anyCompleted = stats.completedCheckpoints > 0;
  const perfectQuiz = stats.details.some(d => d.completed && d.score === d.total && d.total > 0);
  const intermediateComplete = allLevels.find(l => l.name === 'Средний')?.percentage === 100;
  const advancedComplete = allLevels.find(l => l.name === 'Продвинутый')?.percentage === 100;

  const allSimulations = stats.details.filter(d => {
    const level = levels[d.levelId];
    const cp = level?.checkpoints.find(c => c.id === d.checkpointId);
    return cp?.type === 'simulation';
  });
  const allBriefings = stats.details.filter(d => {
    const level = levels[d.levelId];
    const cp = level?.checkpoints.find(c => c.id === d.checkpointId);
    return d.levelId === 'advanced';
  });

  const allSimulationsCompleted = allSimulations.length > 0 && allSimulations.every(d => d.completed);
  const allBriefingsCompleted = allBriefings.length > 0 && allBriefings.every(d => d.completed);

  if (anyCompleted) {
    achievements.push({
      id: 'first-step',
      icon: '🏆',
      title: 'Первый шаг',
      description: 'Пройден первый чекпоинт',
      unlocked: true
    });
  } else {
    achievements.push({
      id: 'first-step',
      icon: '🏆',
      title: 'Первый шаг',
      description: 'Пройден первый чекпоинт',
      unlocked: false
    });
  }

  if (perfectQuiz) {
    achievements.push({
      id: 'sniper',
      icon: '🎯',
      title: 'Снайпер',
      description: '100% за квиз',
      unlocked: true
    });
  } else {
    achievements.push({
      id: 'sniper',
      icon: '🎯',
      title: 'Снайпер',
      description: '100% за квиз',
      unlocked: false
    });
  }

  if (intermediateComplete) {
    achievements.push({
      id: 'on-fire',
      icon: '🔥',
      title: 'На огне',
      description: 'Пройден весь Intermediate',
      unlocked: true
    });
  } else {
    achievements.push({
      id: 'on-fire',
      icon: '🔥',
      title: 'На огне',
      description: 'Пройден весь Intermediate',
      unlocked: false
    });
  }

  if (advancedComplete) {
    achievements.push({
      id: 'hacker',
      icon: '💀',
      title: 'Хакер',
      description: 'Пройден весь Advanced',
      unlocked: true
    });
  } else {
    achievements.push({
      id: 'hacker',
      icon: '💀',
      title: 'Хакер',
      description: 'Пройден весь Advanced',
      unlocked: false
    });
  }

  if (allBriefingsCompleted) {
    achievements.push({
      id: 'theorist',
      icon: '📚',
      title: 'Теоретик',
      description: 'Все брифинги прочитаны',
      unlocked: true
    });
  } else {
    achievements.push({
      id: 'theorist',
      icon: '📚',
      title: 'Теоретик',
      description: 'Все брифинги прочитаны',
      unlocked: false
    });
  }

  if (allSimulationsCompleted) {
    achievements.push({
      id: 'defender',
      icon: '🛡️',
      title: 'Защитник',
      description: 'Все симуляции пройдены',
      unlocked: true
    });
  } else {
    achievements.push({
      id: 'defender',
      icon: '🛡️',
      title: 'Защитник',
      description: 'Все симуляции пройдены',
      unlocked: false
    });
  }

  return achievements;
}
