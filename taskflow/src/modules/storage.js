/*
 * storage.js — Capa de persistencia
 *
 * Responsabilidad única: leer y escribir en localStorage.
 * No sabe nada de tareas, del DOM ni de la lógica de negocio.
 * Cualquier módulo que necesite persistir datos lo usa.
 */

const STORAGE_KEY = 'taskflow-tasks';

/**
 * Lee y parsea las tareas guardadas en localStorage.
 * Si no hay datos o el JSON está corrupto, devuelve array vacío.
 * @returns {Array}
 */
export const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/**
 * Serializa el array de tareas y lo guarda en localStorage.
 * @param {Array} tasks
 */
export const save = (tasks) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};
