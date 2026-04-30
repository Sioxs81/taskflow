/*
 * ui.js — Capa de presentación (DOM)
 *
 * Responsabilidad única: traducir el array de tareas en elementos
 * del DOM y gestionar animaciones con la Web Animations API.
 *
 * Principios aplicados:
 *  - querySelector / createElement / classList / textContent / dataset
 *  - append / prepend / remove  (API de Element moderna)
 *  - data-id en cada <li> → permite al event delegation identificar la tarea
 *  - Web Animations API para efectos de entrada y salida
 *  - DRY: createTaskElement es la única forma de crear un item
 */

// ── Referencias al DOM ────────────────────────────────────────────
const taskList     = document.querySelector('#taskList');
const emptyState   = document.querySelector('#emptyState');
const pendingCount = document.querySelector('#pendingCount');
const totalInfo    = document.querySelector('#totalInfo');

// ── Crear elemento de tarea ───────────────────────────────────────

/**
 * Construye y devuelve un <li> con la estructura visual de una tarea.
 * No registra eventos (los maneja el event delegation en main.js).
 * @param {{ id: string, text: string, completed: boolean }} task
 * @returns {HTMLLIElement}
 */
const createTaskElement = (task) => {
  const item = document.createElement('li');
  item.classList.add('task-item');
  if (task.completed) item.classList.add('completed');
  item.dataset.id = task.id; // clave para el event delegation

  const checkBtn = document.createElement('button');
  checkBtn.classList.add('task-item__check');
  checkBtn.setAttribute(
    'aria-label',
    task.completed ? 'Marcar como pendiente' : 'Marcar como completada'
  );

  const textEl = document.createElement('span');
  textEl.classList.add('task-item__text');
  textEl.textContent = task.text; // textContent: no interpreta HTML (seguro)

  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('task-item__btn-delete');
  deleteBtn.setAttribute('aria-label', 'Eliminar tarea');
  deleteBtn.textContent = '✕';

  item.append(checkBtn, textEl, deleteBtn);
  return item;
};

// ── Renderizado ───────────────────────────────────────────────────

/**
 * Re-renderiza toda la lista desde el array de tareas.
 * @param {Array} tasks
 */
export const renderAll = (tasks) => {
  taskList.querySelectorAll('.task-item').forEach(el => el.remove());
  tasks.forEach(task => taskList.append(createTaskElement(task)));
  syncEmptyState(tasks);
  updateCounter(tasks);
};

/**
 * Actualiza solo el estado visual de una tarea (toggle).
 * Más eficiente que un re-render completo para este caso.
 * @param {string}  id        - ID de la tarea
 * @param {boolean} completed - Nuevo estado
 */
export const renderToggle = (id, completed) => {
  const item = taskList.querySelector(`[data-id="${id}"]`);
  if (!item) return;

  item.classList.toggle('completed', completed);
  item.querySelector('.task-item__check')?.setAttribute(
    'aria-label',
    completed ? 'Marcar como pendiente' : 'Marcar como completada'
  );
};

// ── Animaciones (Web Animations API) ─────────────────────────────

/**
 * Anima la entrada del elemento recién agregado.
 * @param {string} id
 */
export const animateIn = (id) => {
  const item = taskList.querySelector(`[data-id="${id}"]`);
  if (!item) return;

  item.animate(
    [
      { opacity: 0, transform: 'translateY(-8px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
    { duration: 200, easing: 'ease-out' }
  );
};

/**
 * Anima la salida de una tarea y llama al callback al terminar.
 * @param {string}   id
 * @param {Function} onFinish
 */
export const animateOut = (id, onFinish) => {
  const item = taskList.querySelector(`[data-id="${id}"]`);
  if (!item) { onFinish(); return; }

  const anim = item.animate(
    [
      { opacity: 1, transform: 'translateX(0)' },
      { opacity: 0, transform: 'translateX(20px)' },
    ],
    { duration: 220, fill: 'forwards', easing: 'ease-in' }
  );

  anim.onfinish = onFinish;
};

/**
 * Anima la salida de varios elementos y llama al callback
 * cuando TODOS terminaron.
 * @param {string[]} ids
 * @param {Function} onFinish
 */
export const animateOutMany = (ids, onFinish) => {
  if (ids.length === 0) { onFinish(); return; }

  let remaining = ids.length;

  ids.forEach(id => {
    animateOut(id, () => {
      remaining--;
      if (remaining === 0) onFinish();
    });
  });
};

// ── Contador ──────────────────────────────────────────────────────

/**
 * Actualiza el contador de pendientes y el total en el header/footer.
 * @param {Array} tasks
 */
export const updateCounter = (tasks) => {
  pendingCount.textContent = tasks.filter(t => !t.completed).length;
  totalInfo.textContent    = `${tasks.length} tarea(s) en total`;
};

// ── Estado vacío (privado) ────────────────────────────────────────

const syncEmptyState = (tasks) => {
  if (tasks.length > 0) {
    emptyState.remove();
  } else if (!taskList.querySelector('.task-list__empty')) {
    taskList.prepend(emptyState);
  }
};
