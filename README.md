# Finance_Monitoring_Team_Proj
Командний проєкт з Веб-розробки

# Finance Monitoring

Вебзастосунок для управління особистими фінансами.

## Команда

- Женя — Backend + Database
- Лёша — Frontend
- Вика — Wallet Logic + Testing
- Рита — Git Flow + CI/CD + Deployment

## Технології

### Backend
C# / ASP.NET Core (Minimal API), Entity Framework Core

### Frontend
React (Vite) + Recharts

### Database
PostgreSQL

### DevOps
Git, GitHub, GitHub Actions, Docker, Docker Compose

## Функціональність

- Кілька валют (UAH, USD, EUR за замовчуванням, можна додавати свої)
- Кілька гаманців, прив'язаних до валюти
- Додавання/видалення джерел доходу
- Додавання/видалення категорій витрат
- Облік доходів і витрат (транзакції) з описом та датою
- Перегляд доходів/витрат за період у вигляді графіків (лінійний графік динаміки, кругові діаграми за категоріями/джерелами)
- Автоматичний перерахунок балансу гаманця при додаванні/видаленні транзакції

## Git Flow

Основні гілки:

- `main` — стабільна production-версія
- `develop` — основна гілка розробки
- `feature/*` — окремі задачі

## Запуск

Потрібен встановлений **Docker** і **Docker Compose**.

```bash
docker compose up --build
```

Після запуску:

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080/api
- Swagger (документація API): http://localhost:8080/swagger
- PostgreSQL: localhost:5432 (user: `finance`, password: `finance_pass`, db: `finance`)

Схема бази даних створюється автоматично при першому старті бекенда (включно з початковими валютами, категоріями витрат і джерелами доходу).

## Запуск без Docker (для розробки)

### Backend
```bash
cd backend
dotnet restore
dotnet run
```
За замовчуванням бекенд очікує PostgreSQL на `localhost:5432` — або підніміть лише базу через `docker compose up db`, або поправте `ConnectionStrings:Default` у `appsettings.json`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Deployment

CI налаштований через GitHub Actions (`.github/workflows/ci.yml`) — на кожен push/PR у `main`/`develop` збираються бекенд, фронтенд і Docker-образи. Продакшн/staging середовища додаються окремо (наприклад, деплой Docker-образів на сервер або хмарний хостинг).
