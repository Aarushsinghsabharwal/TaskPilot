/**
 * @typedef {{ id: number, text: string, done: boolean }} Task
 */

/**
 * @param {string} str
 * @returns {string}
 */
function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * @param {Task[]} initialTasks
 */
function makeTaskList(initialTasks) {
  /** @type {Task[]} */
  var tasks = Array.isArray(initialTasks) ? initialTasks.slice() : [];

  /**
   * @param {string} text
   * @returns {boolean}
   */
  function addTask(text) {
    var trimmed = (text || '').trim();
    if (!trimmed) return false;
    tasks = [{ id: Date.now(), text: trimmed, done: false }].concat(tasks);
    return true;
  }

  /** @param {number} id */
  function toggleTask(id) {
    tasks = tasks.map(function (t) {
      return t.id === id ? { id: t.id, text: t.text, done: !t.done } : t;
    });
  }

  /** @param {number} id */
  function deleteTask(id) {
    tasks = tasks.filter(function (t) { return t.id !== id; });
  }

  /**
   * @param {string} filter
   * @returns {Task[]}
   */
  function getVisible(filter) {
    return tasks.filter(function (t) {
      return filter === 'all' ? true : filter === 'done' ? t.done : !t.done;
    });
  }

  /** @returns {Task[]} */
  function getAll() { return tasks; }

  /** @returns {number} */
  function getDoneCount() {
    return tasks.filter(function (t) { return t.done; }).length;
  }

  return { addTask: addTask, toggleTask: toggleTask, deleteTask: deleteTask, getVisible: getVisible, getAll: getAll, getDoneCount: getDoneCount };
}

if (typeof module !== 'undefined') {
  module.exports = { escHtml: escHtml, makeTaskList: makeTaskList };
}
