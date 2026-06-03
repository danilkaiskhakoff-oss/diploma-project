import { db } from '../firebase/config';
import { collection, doc, setDoc } from 'firebase/firestore';
import { levels } from '../data/levels';
import { briefings } from '../data/briefings';

// Импорт всех квизов
import cyberBasicsQuiz from '../components/simulations/CyberBasicsQuiz';
import networkAttacksQuiz from '../components/simulations/NetworkAttacksQuiz';
import socialEngineeringQuiz from '../components/simulations/SocialEngineeringQuiz';
import ddosQuiz from '../components/simulations/DDoSQuiz';
import malwareQuiz from '../components/simulations/MalwareQuiz';
import osintQuiz from '../components/simulations/OSINTQuiz';
import pentestQuiz from '../components/simulations/PentestQuiz';
import irQuiz from '../components/simulations/IRQuiz';
import insiderQuiz from '../components/simulations/InsiderQuiz';
import socialMediaQuiz from '../components/simulations/SocialMediaQuiz';
import wifiQuiz from '../components/simulations/WifiQuiz';

// Маппинг квизов
const quizMapping = {
  'cyber-basics-quiz': { title: 'Основы кибербезопасности', description: 'Базовые понятия кибербезопасности' },
  'network-attacks-quiz': { title: 'Сетевые атаки', description: 'Вопросы о сетевых атаках' },
  'social-engineering-quiz': { title: 'Социальная инженерия', description: 'Вопросы о социальной инженерии' },
  'ddos-quiz': { title: 'DDoS-атаки', description: 'Вопросы о DDoS-атаках' },
  'malware-quiz': { title: 'Вирусы и малварь', description: 'Вопросы о вредоносном ПО' },
  'osint-quiz': { title: 'OSINT', description: 'Вопросы о разведке по открытым источникам' },
  'pentest-quiz': { title: 'Пентест', description: 'Вопросы о тестировании на проникновение' },
  'ir-quiz': { title: 'Incident Response', description: 'Вопросы о реагировании на инциденты' },
  'insider-quiz': { title: 'Инсайдерские угрозы', description: 'Вопросы об инсайдерских угрозах' },
  'social-media-quiz': { title: 'Безопасность в соцсетях', description: 'Вопросы о безопасности в социальных сетях' },
  'wifi-quiz': { title: 'Безопасность Wi-Fi', description: 'Вопросы о безопасности Wi-Fi' }
};

// Миграция уровней
async function migrateLevels() {
  console.log('Миграция уровней...');
  for (const [id, level] of Object.entries(levels)) {
    await setDoc(doc(db, 'levels', id), level);
    console.log(`  ✓ Уровень: ${id}`);
  }
  console.log('Уровни мигрированы!');
}

// Миграция брифингов
async function migrateBriefings() {
  console.log('Миграция брифингов...');
  for (const [id, briefing] of Object.entries(briefings)) {
    await setDoc(doc(db, 'briefings', id), briefing);
    console.log(`  ✓ Брифинг: ${id}`);
  }
  console.log('Брифинги мигрированы!');
}

// Миграция квизов
async function migrateQuizzes() {
  console.log('Миграция квизов...');
  
  // Примечание: Квизы экспортируют компоненты, а не данные
  // Нужно будет вручную скопировать данные из компонентов
  // Это временное решение - в реальности нужно рефакторить квизы
  
  const quizData = {
    'ddos-quiz': {
      title: 'DDoS-атаки',
      description: 'Вопросы о DDoS-атаках',
      questions: [
        {
          question: 'Что такое ботнет?',
          options: ['Антивирус', 'Сеть заражённых устройств', 'Файрвол', 'VPN'],
          correctIndex: 1,
          explanation: 'Ботнет — это сеть устройств, заражённых малварью и управляемых атакующим для DDoS-атак.'
        },
        {
          question: 'Какой сервис помогает защититься от DDoS?',
          options: ['Google Drive', 'Cloudflare', 'Photoshop', 'Excel'],
          correctIndex: 1,
          explanation: 'Cloudflare предоставляет CDN и DDoS-защиту, фильтруя malicious трафик до того, как он достигнет сервера.'
        },
        {
          question: 'Что такое SYN Flood?',
          options: ['UDP пакеты', 'Half-open TCP соединения', 'HTTP запросы', 'DNS запросы'],
          correctIndex: 1,
          explanation: 'SYN Flood — атака, при которой атакующий отправляет только SYN пакеты, создавая half-open соединения и перегружая таблицу соединений сервера.'
        },
        {
          question: 'Что делает Blackhole Routing?',
          options: ['Ускоряет трафик', 'Дропает весь трафик', 'Шифрует данные', 'Блокирует только атакующих'],
          correctIndex: 1,
          explanation: 'Blackhole Routing перенаправляет весь трафик в "чёрную дыру", дропая его. Это радикальная мера, которая блокирует и легитимный трафик.'
        }
      ]
    }
  };

  for (const [id, data] of Object.entries(quizData)) {
    await setDoc(doc(db, 'quizzes', id), data);
    console.log(`  ✓ Квиз: ${id}`);
  }
  console.log('Квизы мигрированы!');
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
  console.log('UI конфигурация мигрирована!');
}

// Запуск миграции
export async function runMigration() {
  console.log('=== Начало миграции данных в Firebase ===\n');
  
  try {
    await migrateLevels();
    console.log('');
    await migrateBriefings();
    console.log('');
    await migrateQuizzes();
    console.log('');
    await migrateUIConfig();
    
    console.log('\n=== Миграция завершена! ===');
  } catch (error) {
    console.error('Ошибка миграции:', error);
  }
}

export default runMigration;
