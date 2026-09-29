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
C# / ASP.NET Core

### Frontend
React

### Database
PostgreSQL

### DevOps
Git
GitHub
GitHub Actions
Docker
Docker Compose

## Git Flow

Основні гілки:

- `main` — стабільна production-версія
- `develop` — основна гілка розробки
- `feature/*` — окремі задачі

# Finance Monitoring

Командний вебзастосунок для управління особистими фінансами.

## Опис проєкту

**Finance Monitoring** — вебзастосунок для роботи з особистими фінансами.

Проєкт передбачає роботу з:

* користувачами;
* гаманцями;
* категоріями;
* джерелами доходу;
* фінансовими транзакціями;
* різними валютами;
* аналітикою фінансових даних.

## Команда

* **Женя** — Backend + Database
* **Льоша** — Frontend
* **Віка** — Wallet Logic + Testing
* **Рита** — Git Flow + CI/CD + Deployment

## Технології

### Backend

* C#
* ASP.NET Core
* .NET 9
* Entity Framework Core
* PostgreSQL
* Swagger

### Frontend

* React
* TypeScript
* Vite
* React Router
* pnpm
* Vitest

### DevOps

* Git
* GitHub
* GitHub Actions
* Docker
* Docker Compose

## Структура проєкту

```text
Finance_Monitoring_Team_Proj/
│
├── backend/
│   ├── ServerBTC.sln
│   ├── Dockerfile
│   └── ServerBTC/
│       ├── Controllers/
│       ├── DTOs/
│       ├── Migrations/
│       ├── Models.cs
│       ├── Program.cs
│       └── ServerBTC.csproj
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── vite.config.ts
│   └── Dockerfile
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

## Git Flow

У проєкті використовується спрощений Git Flow.

Основні гілки:

* `main` — стабільна production-версія;
* `develop` — основна гілка розробки;
* `feature/*` — окремі функціональні задачі.

Зміни розробляються у feature-гілках та додаються до `develop` через Pull Request.

Перед об'єднанням Pull Request GitHub Actions автоматично перевіряє проєкт.

## Вимоги

Для локального запуску необхідно встановити:

* Git;
* Docker Desktop;
* Docker Compose (входить до сучасних версій Docker Desktop).

Перевірити встановлення Docker:

```powershell
docker --version
docker compose version
```

## Запуск через Docker Compose

### 1. Клонування репозиторію

```powershell
git clone https://github.com/dizmr/Finance_Monitoring_Team_Proj.git
```

Перейти до проєкту:

```powershell
cd Finance_Monitoring_Team
```
