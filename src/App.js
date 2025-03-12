import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoLists/TodoLists';
import Modal from './components/modal/Modal';
import { Settings, themes, layouts, fonts, fontSizes } from './components/Settings/Settings';
import { MdBrightness3, MdBrightness7, MdSettings } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [editTodo, setEditTodo] = useState(null);
  const [editText, setEditText] = useState("");
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("work");
  const [dueDate, setDueDate] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [newSubtask, setNewSubtask] = useState("");
  const [editingSubtaskId, setEditingSubtaskId] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('settings');
    return savedSettings ? JSON.parse(savedSettings) : {
      theme: 'default',
      layout: 'list',
      font: 'system',
      fontSize: 'md'
    };
  });

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
    // Update CSS variables
    document.documentElement.style.setProperty('--font-family', fonts[settings.font].family);
    document.documentElement.style.setProperty('--font-size', fontSizes[settings.fontSize].size);
    // Update theme classes
    document.documentElement.className = `theme-${settings.theme}`;
  }, [settings]);

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: newTodo,
          completed: false,
          createdAt: new Date().toLocaleString(),
          dueDate: dueDate || null,
          priority,
          category,
          subtasks: [],
        },
      ]);
      setNewTodo("");
      setDueDate("");
      setMessage("کار جدید با موفقیت اضافه شد!");
      setShowModal(true);
    } else {
      setMessage("لطفا یک کار وارد کنید!");
      setShowModal(true);
    }
  };

  const addSubtask = (todoId) => {
    if (newSubtask.trim()) {
      setTodos(todos.map(todo => {
        if (todo.id === todoId) {
          return {
            ...todo,
            subtasks: [
              ...todo.subtasks,
              {
                id: Date.now(),
                text: newSubtask,
                completed: false,
              }
            ]
          };
        }
        return todo;
      }));
      setNewSubtask("");
      setMessage("زیرکار با موفقیت اضافه شد!");
      setShowModal(true);
    }
  };

  const toggleTodo = id => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  const deleteTodo = id => {
    setTodos(todos.filter(todo => todo.id !== id));
    setMessage("کار حذف شد!");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const getTodoStats = () => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const active = total - completed;
    const byPriority = {
      high: todos.filter(todo => todo.priority === 'high').length,
      medium: todos.filter(todo => todo.priority === 'medium').length,
      low: todos.filter(todo => todo.priority === 'low').length,
    };
    return { total, completed, active, byPriority };
  };

  const sortTodos = (todosToSort) => {
    return [...todosToSort].sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'priority':
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  };

  const filteredAndSortedTodos = sortTodos(
    todos.filter(todo => {
      if (filter === "active" && todo.completed) return false;
      if (filter === "completed" && !todo.completed) return false;
      if (search && !todo.text.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
  );

  const stats = getTodoStats();

  const startEditing = (todo) => {
    setEditTodo(todo);
    setEditText(todo.text);
  };

  const saveEdit = () => {
    setTodos(todos.map(todo => todo.id === editTodo.id ? { ...todo, text: editText } : todo));
    setEditTodo(null);
    setEditText("");
    setMessage("کار با موفقیت ویرایش شد!");
    setShowModal(true);
  };

  const cancelEdit = () => {
    setEditTodo(null);
    setEditText("");
  };

  const clearAllTodos = () => {
    setTodos([]);
  };

  const handleSubtaskAction = (action, todoId, data) => {
    setTodos(todos.map(todo => {
      if (todo.id === todoId) {
        switch (action) {
          case 'add':
            return {
              ...todo,
              subtasks: [
                ...todo.subtasks,
                {
                  id: Date.now(),
                  text: data,
                  completed: false,
                }
              ]
            };
          case 'toggle':
            return {
              ...todo,
              subtasks: todo.subtasks.map(subtask =>
                subtask.id === data
                  ? { ...subtask, completed: !subtask.completed }
                  : subtask
              )
            };
          case 'delete':
            return {
              ...todo,
              subtasks: todo.subtasks.filter(subtask => subtask.id !== data)
            };
          case 'edit':
            const { subtaskId, newText } = data;
            return {
              ...todo,
              subtasks: todo.subtasks.map(subtask =>
                subtask.id === subtaskId
                  ? { ...subtask, text: newText }
                  : subtask
              )
            };
          default:
            return todo;
        }
      }
      return todo;
    }));
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''} bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300`}>
      <div className={`container mx-auto p-6 ${settings.layout === 'grid' ? 'layout-grid' : settings.layout === 'compact' ? 'layout-compact' : 'layout-list'}`}>
        {/* Header Section */}
        <div className="header-section">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleDarkMode}
            className="p-3 bg-gray-600 text-white rounded-xl hover:bg-gray-800 transition duration-300 focus:outline-none"
          >
            {darkMode ? <MdBrightness3 className="text-2xl" /> : <MdBrightness7 className="text-2xl" />}
          </motion.button>

          <motion.h1
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-4xl font-bold text-center"
            style={{
              fontFamily: fonts[settings.font].family,
              fontSize: `calc(${fontSizes[settings.fontSize].size} * 2)`,
              color: 'var(--color-primary)'
            }}
          >
            Todo App
          </motion.h1>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowSettings(true)}
            className="p-3 bg-gray-600 text-white rounded-xl hover:bg-gray-800 transition duration-300 focus:outline-none"
          >
            <MdSettings className="text-2xl" />
          </motion.button>
        </div>

        {/* Stats Section */}
        <div className="stats-section grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center min-h-[120px]"
          >
            <h3 className="text-base font-semibold mb-2 text-gray-600 dark:text-gray-400">کل کارها</h3>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>{stats.total}</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center min-h-[120px]"
          >
            <h3 className="text-base font-semibold mb-2 text-gray-600 dark:text-gray-400">در حال انجام</h3>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-accent)' }}>{stats.active}</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center min-h-[120px]"
          >
            <h3 className="text-base font-semibold mb-2 text-gray-600 dark:text-gray-400">تکمیل شده</h3>
            <p className="text-3xl font-bold text-green-500">{stats.completed}</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center min-h-[120px]"
          >
            <h3 className="text-base font-semibold mb-2 text-gray-600 dark:text-gray-400">اولویت بالا</h3>
            <p className="text-3xl font-bold text-red-500">{stats.byPriority.high}</p>
          </motion.div>
        </div>

        {/* Controls Section */}
        <div className="controls-section space-y-6">
          {/* Add Task Section */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="text" 
                value={newTodo} 
                onChange={(e) => setNewTodo(e.target.value)} 
                placeholder="افزودن کار جدید" 
                className="flex-grow p-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                style={{ borderColor: 'var(--color-primary)', '--tw-ring-color': 'var(--color-primary)' }}
              />

              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="p-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                style={{ borderColor: 'var(--color-primary)', '--tw-ring-color': 'var(--color-primary)' }}
              />

              <select 
                value={priority} 
                onChange={(e) => setPriority(e.target.value)} 
                className="p-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                style={{ borderColor: 'var(--color-primary)', '--tw-ring-color': 'var(--color-primary)' }}
              >
                <option value="low">کم</option>
                <option value="medium">متوسط</option>
                <option value="high">زیاد</option>
              </select>

              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className="p-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                style={{ borderColor: 'var(--color-primary)', '--tw-ring-color': 'var(--color-primary)' }}
              >
                <option value="work">کاری</option>
                <option value="home">خانه</option>
                <option value="personal">شخصی</option>
              </select>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addTodo} 
                className="p-3 text-white rounded-xl shadow-md transition duration-300 min-w-[100px]"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                اضافه کردن
              </motion.button>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="text" 
                placeholder="جستجوی کارها" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="flex-grow p-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                style={{ borderColor: 'var(--color-primary)', '--tw-ring-color': 'var(--color-primary)' }}
              />

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                style={{ borderColor: 'var(--color-primary)', '--tw-ring-color': 'var(--color-primary)' }}
              >
                <option value="createdAt">مرتب‌سازی بر اساس تاریخ ایجاد</option>
                <option value="dueDate">مرتب‌سازی بر اساس مهلت انجام</option>
                <option value="priority">مرتب‌سازی بر اساس اولویت</option>
              </select>

              <div className="flex gap-2">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter('all')} 
                  className={`py-2 px-6 rounded-xl transition duration-300`}
                  style={{
                    backgroundColor: filter === 'all' ? 'var(--color-primary)' : 'var(--color-accent)',
                    color: 'white',
                    opacity: filter === 'all' ? 1 : 0.7
                  }}
                >
                  همه
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter('active')} 
                  className={`py-2 px-6 rounded-xl transition duration-300`}
                  style={{
                    backgroundColor: filter === 'active' ? 'var(--color-primary)' : 'var(--color-accent)',
                    color: 'white',
                    opacity: filter === 'active' ? 1 : 0.7
                  }}
                >
                  فعال
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter('completed')} 
                  className={`py-2 px-6 rounded-xl transition duration-300`}
                  style={{
                    backgroundColor: filter === 'completed' ? 'var(--color-primary)' : 'var(--color-accent)',
                    color: 'white',
                    opacity: filter === 'completed' ? 1 : 0.7
                  }}
                >
                  تکمیل شده
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showModal && <Modal message={message} onClose={closeModal} />}
        </AnimatePresence>

        {editTodo ? (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex gap-2 mb-4"
          >
            <input 
              type="text" 
              value={editText} 
              onChange={(e) => setEditText(e.target.value)} 
              className="flex-grow p-2 border border-gray-300 rounded-xl dark:bg-gray-700 dark:text-white dark:border-gray-600"
              style={{ borderColor: 'var(--color-primary)' }}
            />
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={saveEdit} 
              className="p-2 text-white rounded-xl transition duration-300"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              Save
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={cancelEdit} 
              className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition duration-300"
            >
              Cancel
            </motion.button>
          </motion.div>
        ) : (
          <TodoList
            todos={filteredAndSortedTodos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onEdit={startEditing}
            onSubtaskAction={handleSubtaskAction}
          />
        )}

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={clearAllTodos} 
          className="bg-red-500 text-white p-2 rounded-xl my-3 hover:bg-red-600 transition duration-300"
        >
          Clear All Tasks
        </motion.button>

        <AnimatePresence>
          {showSettings && (
            <Settings
              isOpen={showSettings}
              onClose={() => setShowSettings(false)}
              settings={settings}
              onUpdateSettings={setSettings}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
