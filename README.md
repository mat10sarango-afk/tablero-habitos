# Tablero de Hábitos

App de una sola página para agregar, completar y eliminar hábitos diarios,
manipulando el DOM con JavaScript puro (sin frameworks).

## Estructura

```
tablero-habitos/
├── index.html
├── css/
│   └── estilos.css
├── js/
│   └── app.js
└── README.md
```

### Sesión 1 — Repositorio y estructura base

```bash
git init
git add index.html
git commit -m "Estructura base: formulario y lista vacía con Bootstrap"

# Conectar con GitHub 
git remote add origin https://github.com/mat10sarango-afk/tablero-habitos.git
git branch -M main
git push -u origin main
```

### Sesión 2 — Rama de estilos

```bash
git checkout -b feature/estilos
git add css/estilos.css index.html
git commit -m "Agregar estilos para hábitos completados y pendientes"
git push -u origin feature/estilos

# Fusionar a main
git checkout main
git merge feature/estilos
git push origin main
```

### Sesión 3 — Modelo de datos en JS

```bash
git checkout -b feature/logica
git add js/app.js
git commit -m "Definir modelo de datos habitos[] con arrow functions y destructuring"
git push -u origin feature/logica
```

### Sesión 4 — Renderizado dinámico + delegación de eventos

```bash
git add js/app.js
git commit -m "Implementar renderizarHabitos() para generar <li> dinámicamente"

git add js/app.js
git commit -m "Agregar delegacion de eventos en <ul> para completar y eliminar habitos"

# Fusión final a main
git checkout main
git merge feature/logica
git commit -m "Fusionar feature/logica: renderizado dinamico y delegacion de eventos"
git push origin main
```

## Extra: persistencia con localStorage

El arreglo `habitos` se guarda automáticamente en `localStorage` cada vez
que se renderiza, y se recupera al recargar la página, así que los hábitos
no se pierden al cerrar el navegador.

Commit sugerido:

```bash
git add js/app.js
git commit -m "Persistir habitos en localStorage entre recargas"
git push origin main
```

## Conceptos de JavaScript usados

- **Arrow functions**: `crearHabito`, `alternarCompletado`, `eliminarHabito`, etc.
- **Destructuring**: al leer propiedades de cada hábito (`{ id, nombre, completado }`).
- **Spread operator**: `{ ...habito, completado: !completado }` para no mutar el objeto original.
- **Delegación de eventos**: un solo `addEventListener("click", ...)` en el `<ul>` padre
  maneja tanto "marcar como completado" como "eliminar", usando `data-accion`
  y `evento.target.closest(...)`.
- **localStorage**: `JSON.stringify` / `JSON.parse` para persistir el estado.