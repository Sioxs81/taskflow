# TaskFlow ✅
 
Aplicación web de gestión de tareas desarrollada con **HTML, CSS y JavaScript puro (Vanilla JS)**, sin frameworks ni dependencias externas.
 
Proyecto de laboratorio aplicando DOM Moderno, JS Avanzado y Módulos ESM.
 
---
 
## Demo
 
> Abrí el proyecto con un servidor local (ver instrucciones abajo).  
> También no podés desplegarlo en [GitHub Pages] porque hubo un error, pero se puede correr con los pasos de abajo!!
 
---
 
## Funcionalidades
 
- ➕ **Agregar tarea** — con el botón `+` o presionando `Enter`
- ✔ **Marcar como completada** — toggle visual con animación
- 🗑 **Eliminar tarea** — con animación de salida
- 🧹 **Limpiar completadas** — elimina todas las marcadas a la vez
- 🔢 **Contador en tiempo real** — tareas pendientes y total
- ⚠ **Validación** — no permite tareas vacías ni con solo espacios
- 💾 **Persistencia** — las tareas se mantienen al recargar la página (LocalStorage)
---
 
## Cómo correr el proyecto
 
Los módulos ESM (`type="module"`) requieren un servidor HTTP. No funcionan abriendo el archivo directamente desde el explorador de archivos.
 
**Paso 1 — Entrá a la carpeta del proyecto:**
 
```bash
cd taskflow
```
 
**Paso 2 — Levantá un servidor local (elegí una opción):**
 
```bash
# Con Node.js
npx serve .
 
# Con Python
python -m http.server 8080
 
# Con VS Code: instala la extensión "Live Server" → clic en "Go Live"
```
 
**Paso 3 — Abrí el navegador en:**
 
```
http://localhost:3000
```
 
> ⚠️ Si corrés `npx serve .` **fuera** de la carpeta, vas a ver un listado de carpetas en vez de la app. Asegurate de estar dentro de `taskflow/` antes de correr el comando.
 
---
 
## Estructura del proyecto
 
```
taskflow/
├── index.html              → Estructura HTML + <script type="module">
├── style.css               → Estilos globales
├── README.md
├── .gitignore
└── src/
     ├── main.js            → Punto de entrada + event delegation
     └── modules/
          ├── storage.js    → Leer y escribir en LocalStorage
          ├── task.js       → Array de tareas + operaciones CRUD
          └── ui.js         → DOM, animaciones y contador
```
 
---
 
## Conceptos aplicados
 
### Módulos ESM
 
Cada archivo tiene una única responsabilidad y se comunica mediante `import`/`export`. El HTML activa ESM con `type="module"`:
 
```
storage.js  ←  task.js  ←  main.js  →  ui.js
```
 
```js
// storage.js — solo sabe de localStorage
export const load = () => { ... };
export const save = (tasks) => { ... };
 
// task.js — solo sabe de lógica de tareas, delega persistencia
import { load, save } from './storage.js';
export const addTask = (text) => { ... };
 
// ui.js — solo sabe del DOM
export const renderAll = (tasks) => { ... };
 
// main.js — orquesta los tres módulos
import { addTask, getTasks } from './modules/task.js';
import { renderAll, animateIn } from './modules/ui.js';
```
 
### Event Delegation
 
Un único listener de click en la raíz (`.app`) maneja todos los botones de la app. Los eventos burbujean desde el elemento clickeado hacia arriba y `e.target.closest()` identifica la acción:
 
```js
// ❌ Sin delegation: un listener por cada botón de cada tarea
deleteBtn.addEventListener('click', () => { ... }); // × N tareas
 
// ✅ Con delegation: un solo listener para toda la app
appRoot.addEventListener('click', (e) => {
  if (e.target.closest('#addBtn'))                { handleAdd();           }
  if (e.target.closest('.task-item__check'))      { /* marcar completada */}
  if (e.target.closest('.task-item__btn-delete')) { /* eliminar */         }
  if (e.target.closest('#clearBtn'))              { handleClearCompleted();}
});
```
 
### LocalStorage
 
Las tareas se guardan automáticamente en cada operación y se restauran al recargar:
 
```js
// storage.js
const STORAGE_KEY = 'taskflow-tasks';
 
export const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return []; // JSON corrupto → arranca limpio
  }
};
 
export const save = (tasks) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};
```
 
### Array como fuente de verdad
 
El DOM siempre se construye a partir del array `tasks[]`, nunca al revés:
 
```js
// task.js
let tasks = []; // [{ id, text, completed }, ...]
 
export const getTasks   = () => [...tasks]; // devuelve copia, no referencia
export const toggleTask = (id) => {
  const task = tasks.find(t => t.id === id);
  if (!task) return;                        // cláusula de guarda
  task.completed = !task.completed;
  save(tasks);
};
```
 
### Web Animations API
 
Las animaciones de entrada y salida se manejan directamente desde JavaScript:
 
```js
// Entrada
item.animate(
  [{ opacity: 0, transform: 'translateY(-8px)' },
   { opacity: 1, transform: 'translateY(0)' }],
  { duration: 200, easing: 'ease-out' }
);
 
// Salida (ejecuta callback al terminar)
const anim = item.animate(
  [{ opacity: 1 }, { opacity: 0, transform: 'translateX(20px)' }],
  { duration: 220, fill: 'forwards', easing: 'ease-in' }
);
anim.onfinish = () => { deleteTask(id); refresh(); };
```
 
---
 
## Despliegue en GitHub Pages
 
1. Subí el proyecto a un repositorio de GitHub
2. Ir a **Settings → Pages**
3. En *Branch*: seleccioná `main` → carpeta `/root` → **Save**
4. En un par de minutos la app estará disponible en:
```
https://TU_USUARIO.github.io/taskflow/
```
 
> GitHub Pages actúa como servidor HTTP, por lo que los módulos ESM funcionan sin configuración adicional.
 
---
 
## Tecnologías
 
| Tecnología | Uso |
|---|---|
| HTML5 semántico | Estructura de la app |
| CSS3 | Estilos, transiciones y `@keyframes` |
| JavaScript ES2022+ | Lógica, sin frameworks |
| ESM (`import`/`export`) | Separación en módulos |
| Web Animations API | Animaciones desde JS |
| LocalStorage API | Persistencia de datos |
| `crypto.randomUUID()` | IDs únicos por tarea |
 
---
 
## Referencias
 
- [DOM Moderno — Slides del curso](https://multimediossg.github.io/slides/dom/#1)
- [JS Avanzado — Slides del curso](https://multimediossg.github.io/slides/js-avanzado/)
- [Módulos ESM — Slides del curso](https://multimediossg.github.io/slides/modulos-esm/)
 
