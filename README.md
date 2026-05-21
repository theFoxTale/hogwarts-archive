# Class Components App

## Технологический стек

- **React** (классовые компоненты, без хуков)
- **TypeScript**
- **Vite** – сборка и разработка
- **Vitest** – тестирование (unit / интеграционное)
- **ESLint** – статический анализ кода
- **Prettier** – автоматическое форматирование
- **Husky** – pre-commit и pre-push хуки:
  - `pre-commit`: запуск `lint-staged` (форматирование и линтинг staged-файлов) и проверка типов (`type-check`)
  - `pre-push`: полная проверка линтинга (`npm run lint`), проверка типов и запуск всех тестов (`npm run test`)

## Команды

| Команда                 | Описание                                                        |
| ----------------------- | --------------------------------------------------------------- |
| `npm run dev`           | Запуск дев-сервера Vite                                         |
| `npm run build`         | Компиляция TypeScript и сборка проекта через Vite               |
| `npm run preview`       | Локальный предпросмотр собранного приложения                    |
| `npm run lint`          | Запуск ESLint для всех `.ts` / `.tsx` файлов                    |
| `npm run format:fix`    | Автоматическое форматирование всего кода через Prettier         |
| `npm run type-check`    | Проверка типов TypeScript без компиляции                        |
| `npm run test`          | Запуск тестов (Vitest) в режиме `watch`                         |
| `npm run test:coverage` | Запуск тестов с генерацией отчёта о покрытии                    |
| `npm run test:watch`    | Запуск тестов в интерактивном режиме `watch`                    |
| `npm run prepare`       | Установка Husky (выполняется автоматически после `npm install`) |

## Тестовое API

В проекте используется публичное API [PotterDB](https://docs.potterdb.com/) – открытая база данных по вселенной Гарри Поттера.

### Эндпоинты

- **Базовый URL**: `https://api.potterdb.com/v1/characters`
- **Поиск по имени (фильтр)**: `?filter[name_cont]=<строка>`  
  _Пример:_ `?filter[name_cont]=Harry` – ищет персонажей, содержащих «Harry» в имени.
- **Пагинация**: параметры `page[number]` и `page[size]`  
  _Пример:_ `?page[number]=2&page[size]=3` – вторая страница, 3 элемента на странице.

### Использование в приложении

- При загрузке отправляется запрос с сохранённым поисковым термином (или пустой строкой) и номером страницы (по умолчанию 1).
- Размер страницы фиксирован: `ITEMS_PER_PAGE = 3`.
- Ответ содержит массив `data` (персонажи) и мета-информацию о пагинации (`meta.pagination`).

### Пример запроса

```http
GET https://api.potterdb.com/v1/characters?filter[name_cont]=Harry&page[number]=1&page[size]=3
```

## Тестовые ссылки

- [Запрос всех персонажей (1-я страница)](https://api.potterdb.com/v1/characters)
- [Запрос конкретного персонажа по ID](https://api.potterdb.com/v1/characters/6ce92f2b-2bca-49e6-a696-ddde6f555066)

## Описание задания

### 01 - React project setup. Class components. Error boundary

- [English](./docs/01%20-%20Class%20Rendering/task-description.md)
- [Русский](./docs/01%20-%20Class%20Rendering/task-description-ru.md)
- [Результат выполнения](./docs/01%20-%20Class%20Rendering/results.md)

### 02 - React: Unit Testing

- [English](./docs/02%20-%20Unit%20Tests/tests.md)
- [Русский](./docs/02%20-%20Unit%20Tests/tests-ru.md)
- [Результат выполнения](./docs/02%20-%20Unit%20Tests/results.md)

### 03 - React: Routing and Hooks

- [English](./docs/03-%20Hooks%20and%20routing/functional-routing.md)
- [Русский](./docs/03-%20Hooks%20and%20routing/functional-routing-ru.md)
- [Результат выполнения](./docs/03-%20Hooks%20and%20routing/results.md)

## Тестирование

Для запуска тестов и проверки покрытия используйте команды:

```bash
npm run test          # интерактивный режим
npm run test:coverage # отчёт о покрытии (откроется в браузере)
```

## Пороги покрытия (заданы в `vitest.config.ts`)

- `statements`: **80%**
- `branches`: **50%**
- `functions`: **50%**
- `lines`: **50%**

### Текущие показатели (на момент сдачи)

- **Statements:** 100%
- **Branches:** 84.7%
- **Functions:** 100%
- **Lines:** 100%

![test_coverage](./docs/02%20-%20Unit%20Tests/test-coverage.png)
