# Hogwarts Archive

Каталог персонажей вселенной Гарри Поттера: поиск по имени, пагинация, карточка с деталями, множественный выбор и выгрузка CSV. Интерфейс на английском и русском, со светлой и тёмной темой.

Проект начинался как задания [RS School React](https://rs.school/react/) (модули 01–06) и дальше живёт как pet-проект на Next.js App Router.

## Стек

- **Next.js 16** (App Router, Server Components, Server Actions)
- **React 19** / **TypeScript**
- **next-intl** — локали `en` и `ru` в URL (`/en`, `/ru/about`)
- **Redux Toolkit** — только выбранные персонажи (чекбоксы / flyout)
- **Context API** — тема light/dark (`data-theme` на `<html>`)
- **Vitest** + Testing Library — unit / интеграционные тесты
- **ESLint**, **Prettier**, **Husky** + **lint-staged**

PotterDB читается одним слоем: `src/api/characters.ts` → тонкие Server Actions в `src/actions/characters.ts`. RTK Query в приложении нет.

## Запуск

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) — прокси next-intl перенаправит на `/en` (или `/ru` по языку браузера / cookie).

| Команда                 | Описание                              |
| ----------------------- | ------------------------------------- |
| `npm run dev`           | Dev-сервер Next.js                    |
| `npm run build`         | Production-сборка                     |
| `npm start`             | Запуск собранного приложения          |
| `npm run lint`          | ESLint                                |
| `npm run format:fix`    | Prettier по всему репозиторию         |
| `npm run type-check`    | `tsc --noEmit`                        |
| `npm test`              | Vitest (watch в TTY)                  |
| `npm run test:watch`    | Vitest в интерактивном watch          |
| `npm run test:coverage` | `vitest run` с отчётом покрытия       |
| `npm run prepare`       | Установка Husky (после `npm install`) |

Хуки:

- **pre-commit** — `lint-staged` (Prettier + ESLint на staged-файлах)
- **pre-push** — `npm run lint` и `npm run type-check`

## Маршруты

| URL                    | Что это                                 |
| ---------------------- | --------------------------------------- |
| `/`                    | редирект на `/en` или `/ru`             |
| `/en`, `/ru`           | архив: поиск, список, детали, пагинация |
| `/en/about`            | о приложении                            |
| `POST /api/export-csv` | CSV выбранных персонажей                |

Поиск и страница живут в query: `?q=Harry&page=2&characterId=<id>`. Первая отрисовка архива идёт на сервере через `searchCharactersAction`.

Переключение языка меняет префикс пути и сохраняет текущую страницу (`/en/about` → `/ru/about`).

## Структура `src/`

```
src/
  app/                 # App Router: тонкие route-файлы
    layout.tsx
    [locale]/          # страницы с локалью в URL
    api/export-csv/
  proxy.ts             # next-intl: locale prefix и редиректы
  actions/             # 'use server' — обёртки над API
  api/                 # fetch PotterDB, маппинг, опциональный mock
  providers/           # Redux + тема
  components/
    ui/                # кнопки, рамки, флаг, чекбокс
    layout/            # шапка, пагинация
    features/          # поиск, результаты, детали, flyout, флаги
    views/             # HomePage (клиентский составной экран)
  store/               # selectedItems
  contexts/theme/
  i18n/                # routing, navigation, request config
  test/
```

Переводы: `messages/en.json`, `messages/ru.json`. Статика: `public/`. История курса и макеты: `docs/`.

Алиасы: `@/*` → `src/*`, плюс баррели `@ui`, `@layout`, `@features`, `@views`, `@api`, `@store`, `@contexts`.

## API

Публичное [PotterDB](https://docs.potterdb.com/), базовый URL: `https://api.potterdb.com/v1/characters`.

- Поиск: `filter[name_cont]=<строка>`
- Пагинация: `page[number]`, `page[size]` (в приложении размер страницы — **3**)
- Карточка: `GET /v1/characters/:id`

Пример:

```http
GET https://api.potterdb.com/v1/characters?filter[name_cont]=Harry&page[number]=1&page[size]=3
```

- [Список (1-я страница)](https://api.potterdb.com/v1/characters)
- [Персонаж по ID](https://api.potterdb.com/v1/characters/6ce92f2b-2bca-49e6-a696-ddde6f555066)

Локальный mock без сети — в `.env` (см. `.env.example`):

```
NEXT_PUBLIC_USE_MOCK_API=true
NEXT_PUBLIC_MOCK_DELAY_MS=0
```

## Тесты

```bash
npm test
npm run test:coverage
```

Пороги в `vitest.config.ts`: statements **80%**, branches / functions / lines **50%**.
