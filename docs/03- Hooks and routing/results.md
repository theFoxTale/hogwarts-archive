## Функциональные требования (100/100)

| Требование                                                                                                                                                               | Баллы | Статус |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----- | ------ |
| **Pagination с синхронизацией URL** – номер страницы отображается в URL, пагинация работает без потери состояния, при поиске сбрасывается на 1.                          | 30    | ✅     |
| **Master‑Detail View** – клик по персонажу открывает панель деталей (через `<Outlet>`), URL содержит параметр `details`, кнопка закрытия возвращает на текущую страницу. | 45    | ✅     |
| **About Page** – информация об авторе и ссылка на RS School, доступна по ссылке из главного меню.                                                                        | 15    | ✅     |
| **404 Page** – для несуществующих маршрутов отображается страница с сообщением и ссылкой на главную.                                                                     | 10    | ✅     |

---

### Feature 1: Pagination (**30 points**)

- [x] **(+10)** Pagination controls are visible after items are loaded.
- [x] **(+10)** Changing the page updates the URL with the correct `page` parameter (e.g., `?page=2`).
- [x] **(+10)** The visible page matches the page in the URL at all times.

### Feature 2: Master-Detail View (**45 points**)

- [x] **(+20)** Clicking an item opens a details panel on the right, using `<Outlet>`.
- [x] **(+5)** The left side always shows the list of results.
- [x] **(+5)** A loading indicator is visible while details are being fetched.
- [x] **(+5)** The details panel can be closed via a close button or by clicking the main panel (close button implemented).
- [x] **(+5)** The URL always reflects the current page and selected item (e.g., `/details/:characterId?page=2`).
- [x] **(+5)** On initial load, no item is selected and the details panel is closed.

### Feature 3: About Page (**15 points**)

- [x] **(+8)** The About page displays author information and a link to the RS School React course.
- [x] **(+7)** The About page is accessible via a navigation link from the main application.

### Feature 4: 404 Page (**10 points**)

- [x] **(+3)** A 404 page is displayed for all unknown or non-existing routes.
- [x] **(+3)** The 404 page contains a clear message that the page was not found.
- [x] **(+4)** The 404 page provides a navigation option (e.g., button or link) to return to the main app.

---

## Технические требования (штрафы)

- [ ] Проект инициализирован с помощью Vite и шаблона `react-ts`.
- [ ] TypeScript используется.
- [ ] Использование `any`.
- [ ] Использование `ts-ignore`.
- [ ] Code-smells (божественный объект, дублирование, закомментированный код).
- [ ] Прямые манипуляции с DOM.
- [ ] Использование React-хуков (требование задания).
- [ ] Использование Redux или других библиотек управления состоянием.
- [ ] Использование сторонних библиотек компонентов (Material UI, Ant Design).
- [ ] Pull Request соответствует гайдлайну.
- [ ] Ветка `hooks-and-routing` создана от `unit-testing`, файлы настройки React не в `main`.
- [ ] Декомпозиция компонентов выполнена.
