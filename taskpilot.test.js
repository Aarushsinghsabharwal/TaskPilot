const { escHtml, makeTaskList } = require('./taskpilot-core');

describe('escHtml', () => {
  test('leaves plain text unchanged', () => {
    expect(escHtml('hello world')).toBe('hello world');
  });

  test('escapes ampersands', () => {
    expect(escHtml('a & b')).toBe('a &amp; b');
  });

  test('escapes less-than and greater-than', () => {
    expect(escHtml('<script>')).toBe('&lt;script&gt;');
  });

  test('escapes double quotes', () => {
    expect(escHtml('"quoted"')).toBe('&quot;quoted&quot;');
  });

  test('escapes multiple special characters together', () => {
    expect(escHtml('<a href="x">foo & bar</a>')).toBe(
      '&lt;a href=&quot;x&quot;&gt;foo &amp; bar&lt;/a&gt;'
    );
  });

  test('returns empty string unchanged', () => {
    expect(escHtml('')).toBe('');
  });
});

describe('makeTaskList – addTask', () => {
  test('adds a task and returns true', () => {
    const store = makeTaskList([]);
    const result = store.addTask('Buy milk');
    expect(result).toBe(true);
    expect(store.getAll()).toHaveLength(1);
    expect(store.getAll()[0].text).toBe('Buy milk');
    expect(store.getAll()[0].done).toBe(false);
  });

  test('rejects an empty string and returns false', () => {
    const store = makeTaskList([]);
    expect(store.addTask('')).toBe(false);
    expect(store.getAll()).toHaveLength(0);
  });

  test('rejects whitespace-only input and returns false', () => {
    const store = makeTaskList([]);
    expect(store.addTask('   ')).toBe(false);
    expect(store.getAll()).toHaveLength(0);
  });

  test('trims leading and trailing whitespace from task text', () => {
    const store = makeTaskList([]);
    store.addTask('  Walk the dog  ');
    expect(store.getAll()[0].text).toBe('Walk the dog');
  });

  test('prepends new tasks to the top of the list', () => {
    const store = makeTaskList([{ id: 1, text: 'First', done: false }]);
    store.addTask('Second');
    expect(store.getAll()[0].text).toBe('Second');
    expect(store.getAll()[1].text).toBe('First');
  });

  test('assigns a numeric id to each new task', () => {
    const store = makeTaskList([]);
    store.addTask('Task A');
    expect(typeof store.getAll()[0].id).toBe('number');
  });
});

describe('makeTaskList – toggleTask', () => {
  test('marks an active task as done', () => {
    const store = makeTaskList([{ id: 1, text: 'Task', done: false }]);
    store.toggleTask(1);
    expect(store.getAll()[0].done).toBe(true);
  });

  test('marks a done task as active', () => {
    const store = makeTaskList([{ id: 1, text: 'Task', done: true }]);
    store.toggleTask(1);
    expect(store.getAll()[0].done).toBe(false);
  });

  test('only toggles the targeted task', () => {
    const store = makeTaskList([
      { id: 1, text: 'A', done: false },
      { id: 2, text: 'B', done: false },
    ]);
    store.toggleTask(1);
    expect(store.getAll()[0].done).toBe(true);
    expect(store.getAll()[1].done).toBe(false);
  });

  test('does nothing when id is not found', () => {
    const store = makeTaskList([{ id: 1, text: 'Task', done: false }]);
    store.toggleTask(999);
    expect(store.getAll()[0].done).toBe(false);
  });
});

describe('makeTaskList – deleteTask', () => {
  test('removes the task with the given id', () => {
    const store = makeTaskList([
      { id: 1, text: 'A', done: false },
      { id: 2, text: 'B', done: false },
    ]);
    store.deleteTask(1);
    expect(store.getAll()).toHaveLength(1);
    expect(store.getAll()[0].id).toBe(2);
  });

  test('does nothing when id is not found', () => {
    const store = makeTaskList([{ id: 1, text: 'A', done: false }]);
    store.deleteTask(999);
    expect(store.getAll()).toHaveLength(1);
  });

  test('can delete every task one by one', () => {
    const store = makeTaskList([
      { id: 1, text: 'A', done: false },
      { id: 2, text: 'B', done: true },
    ]);
    store.deleteTask(1);
    store.deleteTask(2);
    expect(store.getAll()).toHaveLength(0);
  });
});

describe('makeTaskList – getVisible (filter)', () => {
  /** @type {ReturnType<typeof makeTaskList>} */
  let store;
  beforeEach(() => {
    store = makeTaskList([
      { id: 1, text: 'Active task', done: false },
      { id: 2, text: 'Done task', done: true },
      { id: 3, text: 'Another active', done: false },
    ]);
  });

  test('filter "all" returns every task', () => {
    expect(store.getVisible('all')).toHaveLength(3);
  });

  test('filter "done" returns only completed tasks', () => {
    const visible = store.getVisible('done');
    expect(visible).toHaveLength(1);
    expect(visible[0].id).toBe(2);
  });

  test('filter "active" returns only incomplete tasks', () => {
    const visible = store.getVisible('active');
    expect(visible).toHaveLength(2);
    visible.forEach(t => expect(t.done).toBe(false));
  });

  test('filter "done" returns empty when no tasks are completed', () => {
    const s = makeTaskList([{ id: 1, text: 'A', done: false }]);
    expect(s.getVisible('done')).toHaveLength(0);
  });

  test('filter "active" returns empty when all tasks are done', () => {
    const s = makeTaskList([{ id: 1, text: 'A', done: true }]);
    expect(s.getVisible('active')).toHaveLength(0);
  });
});

describe('makeTaskList – getDoneCount', () => {
  test('returns 0 when no tasks are done', () => {
    const store = makeTaskList([{ id: 1, text: 'A', done: false }]);
    expect(store.getDoneCount()).toBe(0);
  });

  test('returns the correct count of completed tasks', () => {
    const store = makeTaskList([
      { id: 1, text: 'A', done: true },
      { id: 2, text: 'B', done: false },
      { id: 3, text: 'C', done: true },
    ]);
    expect(store.getDoneCount()).toBe(2);
  });

  test('returns 0 for an empty list', () => {
    expect(makeTaskList([]).getDoneCount()).toBe(0);
  });

  test('updates after toggling a task', () => {
    const store = makeTaskList([{ id: 1, text: 'A', done: false }]);
    expect(store.getDoneCount()).toBe(0);
    store.toggleTask(1);
    expect(store.getDoneCount()).toBe(1);
  });
});
