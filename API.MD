# TrainingSpace API

Документация по backend API приложения **TrainingSpace**.

## Быстрый старт

- **Base URL (local):** `http://localhost:3002`
- **Базовый префикс API:** `/api`
- **Формат данных:** `application/json`
- **Авторизация:** JWT (cookie `token` или заголовок `Authorization: Bearer <token>`)

## Общий формат ответа

Все основные методы возвращают объект вида:

```json
{
  "success": true,
  "data": {},
  "message": "optional",
  "error": "optional"
}
```

Где:

- `success: true` - успешный запрос
- `success: false` - ошибка валидации, авторизации или сервера
- `data` - полезная нагрузка ответа
- `error` - текст ошибки

## Авторизация

Защищенные эндпоинты используют middleware `authGuard`:

- сначала ищется cookie `token`
- если cookie нет, проверяется заголовок `Authorization: Bearer <jwt>`
- при отсутствии/невалидности токена вернется `401`:

```json
{
  "success": false,
  "error": "Не авторизовано"
}
```

## Коды состояния

- `200` - успех
- `400` - ошибка валидации / некорректные данные
- `401` - не авторизован
- `404` - сущность не найдена или нет доступа
- `409` - конфликт (например, уже занят email/username)
- `500` - внутренняя ошибка сервера

---

## System

### GET `/api/health`

Проверка состояния API.

**Response 200**

```json
{
  "success": true,
  "message": "API работает корректно",
  "data": {
    "status": "OK",
    "timestamp": "2026-02-16T12:00:00.000Z",
    "uptime": 1234.56,
    "memory": {}
  }
}
```

---

## User

### POST `/api/user/registration`

Регистрация пользователя.

**Body**

```json
{
  "userName": "John123",
  "email": "john@example.com",
  "password": "StrongPass123!"
}
```

**Правила валидации**

- `userName`: 3..15 символов, допустимы `a-zA-Z0-9!@#$%^&*.`
- `email`: непустая строка
- `password`: 8..25 символов, допустимы `a-zA-Z0-9!@#$%^&*.`

**Response 200**

```json
{
  "success": true
}
```

---

### POST `/api/user/login`

Вход пользователя. Устанавливает httpOnly cookie `token`.

**Body**

```json
{
  "userName": "John123",
  "password": "StrongPass123!",
  "rememberMe": true
}
```

**Response 200**

```json
{
  "success": true,
  "data": {
    "token": "<jwt>"
  }
}
```

---

### POST `/api/user/logout` (auth)

Выход из системы и очистка cookie `token`.

**Response 200**

```json
{
  "success": true
}
```

---

### GET `/api/user/me` (auth)

Получение данных текущего пользователя.

**Response 200**

```json
{
  "success": true,
  "data": {
    "userData": {
      "publicId": "usr_xxx",
      "email": "john@example.com",
      "userName": "John123",
      "createdAt": "2026-02-16T12:00:00.000Z"
    }
  }
}
```

---

### POST `/api/user/change-email` (auth)

Смена email.

**Body**

```json
{
  "newEmail": "new@example.com",
  "currentPassword": "StrongPass123!"
}
```

**Response 200**

```json
{
  "success": true
}
```

---

### POST `/api/user/change-password` (auth)

Смена пароля.

**Body**

```json
{
  "currentPassword": "StrongPass123!",
  "newPassword": "NewStrongPass456!",
  "confirmPassword": "NewStrongPass456!"
}
```

**Response 200**

```json
{
  "success": true
}
```

---

## Goal

### POST `/api/goal/goal` (auth)

Создать цель.

**Body**

```json
{
  "name": "Сбросить 3 кг",
  "description": "К лету",
  "priority": "Высокий"
}
```

**Валидация**

- `name`: 3..40 символов (латиница/кириллица/цифры/часть спецсимволов)
- `description`: до 500 символов
- `priority`: непустая строка

---

### GET `/api/goal/goals` (auth)

Список целей пользователя.

---

### GET `/api/goal/short-goals` (auth)

Короткий список целей.

---

### GET `/api/goal/about-my-goal?goalId=<publicId>` (auth)

Детальная информация о цели.

---

### PUT `/api/goal/goal` (auth)

Обновить цель.

**Body**

```json
{
  "goalId": "goal_public_id",
  "name": "Сбросить 4 кг",
  "description": "Обновленное описание",
  "priority": "Средний"
}
```

---

### PUT `/api/goal/complete-goal` (auth)

Отметить цель как выполненную.

**Body**

```json
{
  "goalId": "goal_public_id"
}
```

---

### GET `/api/goal/completed-goals` (auth)

Список выполненных целей.

---

### DELETE `/api/goal/goal` (auth)

Удалить цель.

**Body**

```json
{
  "goalId": "goal_public_id"
}
```

---

## Nutrition

### POST `/api/nutrition/day` (auth)

Создать день питания.

**Body**

```json
{
  "name": "День 1",
  "description": "Контроль БЖУ",
  "date": "2026-02-15",
  "calories": 2200,
  "protein": 140,
  "fat": 70,
  "carb": 250
}
```

**Валидация**

- `name`: 3..40 символов
- `description`: до 500 символов
- `date`: валидная дата `YYYY-MM-DD`, не из будущего
- `calories`: 1..100000
- `protein`, `fat`, `carb`: 1..1000

---

### GET `/api/nutrition/days` (auth)

Список дней питания.

---

### GET `/api/nutrition/about-my-day?dayId=<publicId>` (auth)

Информация о конкретном дне.

---

### PUT `/api/nutrition/day` (auth)

Обновить день питания.

**Body**

```json
{
  "publicId": "day_public_id",
  "name": "День 1 обновлен",
  "description": "Новое описание",
  "date": "2026-02-15",
  "calories": 2300,
  "protein": 150,
  "fat": 75,
  "carb": 260
}
```

---

### DELETE `/api/nutrition/day` (auth)

Удалить день питания.

**Body**

```json
{
  "dayId": "day_public_id"
}
```

---

## Training

> В текущей реализации префикс роутера уже содержит `training`, поэтому полный путь выглядит как `/api/training/training`.

### POST `/api/training/training` (auth)

Создать тренировку.

**Body**

```json
{
  "name": "Спина и бицепс",
  "description": "Понедельник",
  "exercises": [1, 2, 3]
}
```

**Валидация**

- `name`: 3..40 символов
- `description`: необязательно, до 500 символов
- `exercises`: массив id упражнений, 1..20 элементов, только уникальные значения

---

### GET `/api/training/trainings` (auth)

Список тренировок пользователя.

---

### GET `/api/training/about-my-training?trainingId=<publicId>` (auth)

Информация о тренировке.

---

### PUT `/api/training/training` (auth)

Обновить тренировку.

**Body**

```json
{
  "trainingId": "training_public_id",
  "name": "Спина и бицепс (обновлено)",
  "description": "Новое описание",
  "exercises": [1, 2, 4]
}
```

---

### DELETE `/api/training/training` (auth)

Удалить тренировку.

**Body**

```json
{
  "trainingId": "training_public_id"
}
```

---

### GET `/api/training/:id/exercises` (auth)

Получить упражнения конкретной тренировки по числовому `id`.

---

## Exercises

> В текущей реализации полный путь: `/api/exercises/exercises`.

### GET `/api/exercises/exercises` (auth)

Справочник упражнений.

**Response 200 (пример)**

```json
{
  "success": true,
  "data": {
    "exercises": [
      {
        "id": 1,
        "name": "Присед",
        "difficulty": "middle",
        "description": "Базовое упражнение",
        "partOfTheBody": ["Ноги"]
      }
    ]
  }
}
```

---

## Activity

> В текущей реализации полный путь: `/api/activity/activity`.

### POST `/api/activity/activity` (auth)

Создать активность.

**Body**

```json
{
  "activityName": "Тренировка в зале",
  "description": "Вечерняя сессия",
  "activityType": "Силовая",
  "activityDifficult": "Средняя",
  "trainingId": 12,
  "performedAt": "2026-02-15",
  "exercises": [
    {
      "id": 1,
      "try": [
        { "id": 1, "weight": 60, "quantity": 10 },
        { "id": 2, "weight": 65, "quantity": 8 }
      ]
    }
  ]
}
```

**Валидация**

- `activityName`: 3..40 символов
- `description`: до 500 символов
- `activityType`, `activityDifficult`: непустые строки
- `trainingId`: число > 0
- `performedAt`: валидная дата `YYYY-MM-DD`
- `exercises`: непустой массив, в каждом элементе есть `id` и непустой массив `try`
- `try[].id` > 0, `try[].weight` >= 0, `try[].quantity` > 0

---

### GET `/api/activity/activities` (auth)

Список активностей пользователя.

---

### GET `/api/activity/about-my-activity?activityId=<publicId>` (auth)

Информация об активности.

---

### PUT `/api/activity/activity` (auth)

Обновить активность.

**Body**

```json
{
  "publicId": "activity_public_id",
  "name": "Новое название",
  "description": "Новое описание",
  "type": "Кардио",
  "difficulty": "Лёгкая",
  "trainingId": 12,
  "activityDate": "2026-02-15",
  "exercises": [
    {
      "id": 1,
      "try": [{ "id": 1, "weight": 20, "quantity": 15 }]
    }
  ]
}
```

---

### DELETE `/api/activity/activity` (auth)

Удалить активность.

**Body**

```json
{
  "activityId": "activity_public_id"
}
```

---

## Statistics

### GET `/api/statistics/main-information` (auth)

Главные карточки статистики.

**Response 200 (структура)**

```json
{
  "success": true,
  "data": {
    "mainCardsData": {
      "totalDays": 0,
      "totalTraining": 0,
      "totalGoalComplete": 0,
      "totalActivity": 0
    }
  }
}
```

---

### GET `/api/statistics/nutrition-information` (auth)

Сводные показатели по питанию.

**Response 200 (структура)**

```json
{
  "success": true,
  "data": {
    "nutritionCardData": {
      "averageCalories": 0,
      "averageProtein": 0,
      "averageFat": 0,
      "averageCarb": 0
    }
  }
}
```

---

### GET `/api/statistics/nutrition-graphic` (auth)

Данные для графика питания.

**Response 200 (структура)**

```json
{
  "success": true,
  "data": {
    "graphicData": [
      {
        "date": "2026-02-15",
        "calories": 2200,
        "protein": 140,
        "fat": 70,
        "carb": 250
      }
    ]
  }
}
```

---

## Ошибки и замечания

- Для большинства ошибок валидации возвращается `400` с `success: false`.
- Для отсутствия/невалидности JWT - `401`.
- Если объект не найден или нет доступа - `404`.
- На бэкенде есть общий fallback для неизвестных маршрутов:

```json
{
  "error": "Маршрут не найден",
  "path": "/api/unknown"
}
```

