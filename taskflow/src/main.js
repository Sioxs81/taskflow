/*
 * main.js — Punto de entrada de TaskFlow
 *
 * Responsabilidades:
 *  1. Inicializar la app (cargar tareas y renderizar)
 *  2. Registrar UN SOLO event listener de click en la raíz (.app)
 *     → Event delegation: el evento burbujea desde el elemento
 *       clickeado hasta .app; e.target.closest() identifica la acción
 *  3. Escuchar el teclado en el input (Enter para agregar)
 *
 * Importa de tres módulos con responsabilidades separadas:
 *  - task.js    → lógica de negocio (CRUD del array)
 *  - ui.js      → presentación (DOM + animaciones)
 *  - storage.js → solo se usa indirectamente vía task.js
 */

import { loadTasks, getTasks, addTask, toggleTask, deleteTask, clearCompleted } from './modules/task.js';
import { renderAll, renderToggle, animateIn, animateOut, animateOutMany, updateCounter } from './modules/ui.js';

// ── Referencias al DOM ────────────────────────────────────────────
const appRoot   = document.querySelector('.app');
const taskInput = document.querySelector('#taskInput');
const errorMsg  = document.querySelector('#errorMsg');

// ── Helper: re-renderiza desde el store ──────────────────────────
const refresh = () => renderAll(getTasks());

// ─────────────────────────────────────────────────────────────────
//  EVENT DELEGATION — UN SOLO LISTENER EN LA RAÍZ
//
//  Los clicks en botones hijos burbujean hasta .app.
//  e.target.closest() encuentra el ancestro que nos interesa
//  sin importar en qué parte exacta del botón se hizo click.
// ─────────────────────────────────────────────────────────────────
appRoot.addEventListener('click', (e) => {

  // Botón "+" — agregar tarea
  if (e.target.closest('#addBtn')) {
    handleAdd();
    return;
  }

  // Círculo — marcar / desmarcar completada
  const checkBtn = e.target.closest('.task-item__check');
  if (checkBtn) {
    const id = checkBtn.closest('.task-item').dataset.id;
    toggleTask(id);
    const updated = getTasks().find(t => t.id === id);
    renderToggle(id, updated.completed); // actualiza solo ese nodo
    updateCounter(getTasks());
    return;
  }

  // "✕" — eliminar tarea
  const deleteBtn = e.target.closest('.task-item__btn-delete');
  if (deleteBtn) {
    const id = deleteBtn.closest('.task-item').dataset.id;
    animateOut(id, () => {
      deleteTask(id);
      refresh();
    });
    return;
  }

  // "Limpiar completadas"
  if (e.target.closest('#clearBtn')) {
    handleClearCompleted();
  }

});

// ── Teclado en el input ───────────────────────────────────────────
taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleAdd();
});

taskInput.addEventListener('input', () => {
  if (taskInput.value.trim() !== '') errorMsg.classList.remove('visible');
});

// ── Acciones ──────────────────────────────────────────────────────

/**
 * Valida el input, agrega la tarea y actualiza el DOM.
 */
const handleAdd = () => {
  const text = taskInput.value.trim();

  // Cláusula de guarda: vacío o solo espacios
  if (!text) {
    taskInput.classList.add('error');
    errorMsg.classList.add('visible');
    taskInput.focus();
    setTimeout(() => taskInput.classList.remove('error'), 400);
    return;
  }

  errorMsg.classList.remove('visible');

  const task = addTask(text);
  refresh();
  animateIn(task.id);

  taskInput.value = '';
  taskInput.focus();
};

/**
 * Anima la salida de las completadas y luego las elimina del store.
 */
const handleClearCompleted = () => {
  const completedIds = getTasks()
    .filter(t => t.completed)
    .map(t => t.id);

  if (completedIds.length === 0) return; // nada que limpiar

  animateOutMany(completedIds, () => {
    clearCompleted();
    refresh();
  });
};

// ── Arranque ──────────────────────────────────────────────────────
loadTasks(); // lee desde localStorage (via storage.js)
refresh();   // pinta el estado inicial
