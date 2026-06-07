require('dotenv').config({ path: './.env.local' });
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Инициализация Firebase Admin
const serviceAccount = {
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  clientEmail: process.env.VITE_FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.VITE_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Данные для миграции
const levels = JSON.parse(fs.readFileSync(path.join(__dirname, 'levels-data.json'), 'utf-8'));
const briefings = JSON.parse(fs.readFileSync(path.join(__dirname, 'briefings-data.json'), 'utf-8'));
const quizzes = JSON.parse(fs.readFileSync(path.join(__dirname, 'quizzes-data.json'), 'utf-8'));

async function migrate() {
  console.log('=== Начало миграции данных в Firebase ===\n');

  try {
    // Миграция уровней
    console.log('Миграция уровней...');
    const levelsRef = db.collection('levels');
    for (const [id, level] of Object.entries(levels)) {
      await levelsRef.doc(id).set(level);
      console.log(`  ✓ Уровень: ${id}`);
    }
    console.log('Уровни мигрированы!\n');

    // Миграция брифингов
    console.log('Миграция брифингов...');
    const briefingsRef = db.collection('briefings');
    for (const [id, briefing] of Object.entries(briefings)) {
      await briefingsRef.doc(id).set(briefing);
      console.log(`  ✓ Брифинг: ${id}`);
    }
    console.log('Брифинги мигрированы!\n');

    // Миграция квизов
    console.log('Миграция квизов...');
    const quizzesRef = db.collection('quizzes');
    for (const [id, quiz] of Object.entries(quizzes)) {
      await quizzesRef.doc(id).set(quiz);
      console.log(`  ✓ Квиз: ${id}`);
    }
    console.log('Квизы мигрированы!\n');

    // Миграция UI конфигурации
    console.log('Миграция UI конфигурации...');
    const uiConfig = {
      colors: {
        primary: '#00ff88',
        secondary: '#ffaa00',
        accent: '#ff4444',
        background: '#0a0a0a',
        text: '#ffffff',
      },
      fonts: {
        heading: 'sans-serif',
        body: 'sans-serif',
      },
      theme: 'dark',
      animations: {
        enabled: true,
        duration: 0.3,
      },
    };
    await db.collection('ui-config').doc('global').set(uiConfig);
    console.log('UI конфигурация мигрирована!\n');

    console.log('=== Миграция завершена! ===');
  } catch (error) {
    console.error('Ошибка миграции:', error);
  } finally {
    process.exit(0);
  }
}

migrate();
