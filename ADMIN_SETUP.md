# Настройка Firebase Admin Panel

## Шаг 1: Создание Firebase проекта

1. Перейдите на https://console.firebase.google.com
2. Нажмите "Add project"
3. Введите название: `cybersecurity-platform`
4. Отключите Google Analytics (не нужно)
5. Нажмите "Create project"

## Шаг 2: Настройка Firestore

1. В Firebase Console перейдите в "Firestore Database"
2. Нажмите "Create database"
3. Выберите "Start in test mode" (для разработки)
4. Выберите регион: `eur3` (Europe)
5. Нажмите "Enable"

## Шаг 3: Настройка Authentication

1. Перейдите в "Authentication"
2. Нажмите "Get started"
3. Выберите "Email/Password" provider
4. Включите "Email/Password"
5. Нажмите "Save"

## Шаг 4: Создание админ-пользователя

1. В "Authentication" нажмите "Add user"
2. Email: `isxakov2006@bk.ru`
3. Password: `qawsedr=-0`
4. Нажмите "Add user"

## Шаг 5: Получение конфигурации

1. Перейдите в "Project Settings" (шестерёнка)
2. Прокрутите до "Your apps"
3. Нажмите "Web app" (</>)
4. Введите название: `CyberSecurity Platform`
5. Скопируйте `firebaseConfig` объект

## Шаг 6: Настройка环境变量

1. Создайте файл `client/.env` (скопируйте из `.env.example`)
2. Заполните значения из Firebase config:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=cybersecurity-platform.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=cybersecurity-platform
VITE_FIREBASE_STORAGE_BUCKET=cybersecurity-platform.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

## Шаг 7: Настройка Security Rules

1. В Firebase Console перейдите в "Firestore Database" → "Rules"
2. Замените правила на:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Публичное чтение
    match /{document=**} {
      allow read: if true;
    }
    
    // Запись только для аутентифицированных пользователей
    match /levels/{levelId} {
      allow write: if request.auth != null;
    }
    
    match /quizzes/{quizId} {
      allow write: if request.auth != null;
    }
    
    match /briefings/{briefingId} {
      allow write: if request.auth != null;
    }
    
    match /ui-config/{docId} {
      allow write: if request.auth != null;
    }
    
    match /simulations/{simId} {
      allow write: if request.auth != null;
    }
    
    // Admin коллекция - только чтение
    match /admin/{document=**} {
      allow read: if request.auth != null;
      allow write: if false;
    }
  }
}
```

3. Нажмите "Publish"

## Шаг 8: Миграция данных

После настройки Firebase, данные нужно перенести из локальных файлов.

**Вариант A: Ручная миграция через Firebase Console**

1. Перейдите в Firestore Database
2. Создайте коллекции вручную:
   - `levels`
   - `quizzes`
   - `briefings`
   - `ui-config`

**Вариант B: Автоматическая миграция (скрипт)**

Скрипт миграции находится в `client/src/scripts/migrate-to-firebase.js`

Для запуска:
1. Откройте консоль браузера на сайте
2. Импортируйте и запустите функцию миграции

## Шаг 9: Деплой на Render

1. Добавьте переменные окружения в Render Dashboard:
   - VITE_FIREBASE_API_KEY
   - VITE_FIREBASE_AUTH_DOMAIN
   - VITE_FIREBASE_PROJECT_ID
   - VITE_FIREBASE_STORAGE_BUCKET
   - VITE_FIREBASE_MESSAGING_SENDER_ID
   - VITE_FIREBASE_APP_ID

2. Запуште изменения на ветку `cyber-interactive`

3. Render автоматически задеплоит

## Использование админ-панели

1. Перейдите на `https://your-site.com/admin`
2. Войдите с email: `isxakov2006@bk.ru` и паролем: `qawsedr=-0`
3. Используйте меню слева для навигации

## Структура данных

```
Firestore/
├── levels/
│   ├── beginner/
│   ├── intermediate/
│   └── advanced/
── quizzes/
│   ├── ddos-quiz/
│   ├── pentest-quiz/
│   └── ...
├── briefings/
│   ├── ddos/
│   ├── pentest/
│   └── ...
├── ui-config/
│   └── global/
└── simulations/
    └── ...
```

## Troubleshooting

**Ошибка "Firebase not configured"**
- Проверьте, что файл `.env` существует и заполнен

**Ошибка "Permission denied"**
- Проверьте Security Rules в Firebase Console

**Ошибка "User not found"**
- Убедитесь, что пользователь создан в Authentication

**Админка не загружается**
- Проверьте консоль браузера на ошибки
- Убедитесь, что Firebase SDK установлен (`npm install firebase`)
