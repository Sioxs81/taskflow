/*
 * task.js — Lógica de tareas (modelo)
 *
 * Responsabilidad única: gestionar el array de tareas y
 * exponer operaciones CRUD. Delega la persistencia a storage.js.
 *
 * Principios aplicados:
 *  - Funciones puras donde sea posible
 *  - DRY: save() siempre se llama tras cada mutación
 *  - Early return en toggleTask si el id no existe
 *  - getTasks() devuelve copia para evitar mutaciones externas
 */

import { load, save } from './storage.js';

// ── Fuente de verdad ──────────────────────────────────────────────
// Cada tarea: { id: string, text: string, completed: boolean }
let tasks = [];

// ── Inicialización ────────────────────────────────────────────────

/**
 * Carga las tareas desde localStorage al arrancar la app.
 * Debe llamarse una sola vez al inicio.
 */
export const loadTasks = () => {
  tasks = load();
};

// ── Getters ───────────────────────────────────────────────────────

/**
 * Devuelve una copia del array (inmutabilidad hacia afuera).
 * @returns {Array}
 */
export const getTasks = () => [...tasks];

// ── CRUD ──────────────────────────────────────────────────────────

/**
 * Crea y agrega una nueva tarea.
 * @param {string} text - Texto ya validado y trimmeado
 * @returns {object} La tarea creada
 */
export const addTask = (text) => {
  const task = {
    id: crypto.randomUUID(),
    text,
    completed: false,
  };
  tasks.push(task);
  save(tasks);
  return task;
};

/**
 * Alterna el estado completado/pendiente de una tarea.
 * @param {string} id
 */
export const toggleTask = (id) => {
  const task = tasks.find(t => t.id === id);
  if (!task) return; // cláusula de guarda

  task.completed = !task.completed;
  save(tasks);
};

/**
 * Elimina una tarea por su ID.
 * @param {string} id
 */
export const deleteTask = (id) => {
  tasks = tasks.filter(t => t.id !== id);
  save(tasks);
};

/**
 * Elimina todas las tareas completadas.
 */
export const clearCompleted = () => {
  tasks = tasks.filter(t => !t.completed);
  save(tasks);
};
