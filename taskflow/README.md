# ✅ TaskFlow

Aplicación web de gestión de tareas construida con **HTML, CSS y Vanilla JS**, aplicando módulos ESM, event delegation y persistencia con LocalStorage.

> Laboratorio · DOM Moderno → JS Avanzado + Módulos ESM

---

## 🚀 Cómo correr el proyecto

> ⚠️ Los módulos ESM (`type="module"`) no funcionan desde `file://`.  
> Necesitás un servidor local. Opciones:

```bash
# Opción 1 — VS Code: instala "Live Server" → clic en "Go Live"

# Opción 2 — Node.js
npx serve .

# Opción 3 — Python
python -m http.server 8080
```

---

## 📋 Funcionalidades

| # | Función | Descripción |
|---|---|---|
| 1 | ➕ Agregar tarea | Con botón `+` o tecla `Enter` |
| 2 | ✔ Marcar completada | Toggle visual con animación |
| 3 | 🗑 Eliminar tarea | Animación de salida antes de quitar del DOM |
| 4 | 🧹 Limpiar completadas | Elimina todas las marcadas a la vez |
| 5 | 🔢 Contador | Pendientes y total actualizados en tiempo real |
| 6 | ⚠ Validación | No permite tareas vacías ni con solo espacios |
| 7 | 💾 Persistencia | Se mantiene al recargar (LocalStorage) |

---

## 📁 Estructura del proyecto

```
taskflow/
├── index.html              → HTML semántico + <script type="module">
├── style.css               → Estilos globales
├── .gitignore
├── README.md
└── src/
     ├── main.js            → Punto de entrada + event delegation en .app
     └── modules/
          ├── storage.js    → Leer/escribir en localStorage
          ├── task.js       → Array de tareas + CRUD (usa storage.js)
          └── ui.js         → DOM: crear elementos, renderizar, animaciones
```

---

## 🧠 Conceptos aplicados

### 1. Módulos ESM — separación de responsabilidades

```
storage.js ← task.js ← main.js → ui.js
```

Cada módulo tiene **una sola responsabilidad** y se comunica mediante `export`/`import`:

```js
// storage.js — solo sabe de localStorage
export const load = () => { ... };
export const save = (tasks) => { ... };

// task.js — solo sabe de la lógica de tareas
import { load, save } from './storage.js';
export const addTask = (text) => { ...; save(tasks); };

// ui.js — solo sabe del DOM
export const renderAll = (tasks) => { ... };
export const animateIn = (id) => { ... };

// main.js — orquesta todo
import { loadTasks, getTasks, addTask } from './modules/task.js';
import { renderAll, animateIn }        from './modules/ui.js';
```

### 2. Event Delegation — un solo listener en la raíz

En lugar de agregar un listener por cada botón de cada tarea:

```js
// ❌ Malo: N listeners creados y destruidos con cada tarea
deleteBtn.addEventListener('click', () => { ... });
checkBtn.addEventListener('click',  () => { ... });

// ✅ Bueno: un solo listener, aprovecha el bubbling del DOM
appRoot.addEventListener('click', (e) => {
  if (e.target.closest('#addBtn'))               { handleAdd(); return; }
  if (e.target.closest('.task-item__check'))     { /* toggle */ return; }
  if (e.target.closest('.task-item__btn-delete')){ /* delete */ return; }
  if (e.target.closest('#clearBtn'))             { handleClearCompleted(); }
});
```

### 3. LocalStorage — persistencia entre recargas

```js
// storage.js
const STORAGE_KEY = 'taskflow-tasks';

export const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }       // JSON corrupto → array vacío
};

export const save = (tasks) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};
```

### 4. Array como fuente de verdad

```js
// task.js
let tasks = []; // { id, text, completed }[]

export const getTasks = () => [...tasks]; // copia, no referencia

export const toggleTask = (id) => {
  const task = tasks.find(t => t.id === id);
  if (!task) return;              // cláusula de guarda
  task.completed = !task.completed;
  save(tasks);
};
```

---

## 🛠 Tecnologías

- HTML5 semántico
- CSS3 (transiciones, animaciones)
- JavaScript ES2022+ — sin frameworks
- ESM (`import`/`export`, `type="module"`)
- Web Animations API
- LocalStorage API
- `crypto.randomUUID()` para IDs únicos

---

## 📚 Referencias del curso

- [JS Avanzado — Slides](https://multimediossg.github.io/slides/js-avanzado/)
- [Módulos ESM — Slides](https://multimediossg.github.io/slides/modulos-esm/)
- [DOM Moderno — Slides](https://multimediossg.github.io/slides/dom/#1)
