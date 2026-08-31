# Брендлист

Экран по Figma-узлу `6966:94811`. Реализован на React/Vite с интерактивным WebGL-фоном из `@paper-design/shaders-react`.

## Запуск

Установите зависимости и запустите dev-сервер:

```bash
pnpm install
pnpm dev
```

Для production-сборки используйте `pnpm build`.

## Задел под анимацию фона

Фон изолирован в блоке `.ambient-background`. Его положение и масштаб управляются CSS-переменными `--background-pan-x`, `--background-pan-y` и `--background-scale`. Для будущей анимации доступен метод `window.brandPortalBackground.setTransform({ x, y, scale })`.
