function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function makeTaskList(initialTasks) {
  var tasks = Array.isArray(initialTasks) ? initialTasks.slice() : [];

  function addTask(text) {
    var trimmed = (text || '').trim();
    if (!trimmed) return false;
    tasks = [{ id: Date.now(), text: trimmed, done: false }].concat(tasks);
    return true;
  }

  function toggleTask(id) {
    tasks = tasks.map(function (t) {
      return t.id === id ? { id: t.id, text: t.text, done: !t.done } : t;
    });
  }

  function deleteTask(id) {
    tasks = tasks.filter(function (t) { return t.id !== id; });
  }

  function getVisible(filter) {
    return tasks.filter(function (t) {
      return filter === 'all' ? true : filter === 'done' ? t.done : !t.done;
    });
  }

  function getAll() { return tasks; }

  function getDoneCount() {
    return tasks.filter(function (t) { return t.done; }).length;
  }

  return { addTask: addTask, toggleTask: toggleTask, deleteTask: deleteTask, getVisible: getVisible, getAll: getAll, getDoneCount: getDoneCount };
}

if (typeof module !== 'undefined') {
  module.exports = { escHtml: escHtml, makeTaskList: makeTaskList };
}
