import React, { useState } from 'react';
import TodoList from './components/TodoLists/TodoLists';
import Modal from './components/modal/Modal';
import { MdBrightness3, MdBrightness7 } from 'react-icons/md';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [editTodo, setEditTodo] = useState(null);
  const [editText, setEditText] = useState("");
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("work");

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: newTodo,
          completed: false,
          createdAt: new Date().toLocaleString(),
          priority, // ذخیره اولویت
          category, // ذخیره دسته‌بندی
        },
      ]);
      setNewTodo("");
      setMessage("کار جدید با موفقیت اضافه شد!");
      setShowModal(true);
    } else {
      setMessage("لطفا یک کار وارد کنید!");
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
    document.documentElement.classList.toggle('dark', !darkMode);
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === "active" && todo.completed) return false;
    if (filter === "completed" && !todo.completed) return false;
    if (search && !todo.text.toLowerCase().includes(search.toLowerCase())) return false;

    return true;
  });

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

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''} bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white`}>
      <div className="max-w-xl mx-auto p-6">
        <button onClick={toggleDarkMode} className="mb-4 p-3 bg-gray-600 text-white rounded-xl hover:bg-gray-800 transition duration-300 focus:outline-none">
          {darkMode ? <MdBrightness3 className="text-2xl" /> : <MdBrightness7 className="text-2xl" />}
        </button>

        <h1 className="text-4xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">Todo App</h1>

        <div className="flex flex-col sm:flex-row sm:space-x-4 mb-6">
  <input 
    type="text" 
    value={newTodo} 
    onChange={(e) => setNewTodo(e.target.value)} 
    placeholder="Add a new task" 
    className="flex-grow p-3 mb-4 sm:mb-0 sm:flex-1 border border-gray-300 rounded-xl shadow-md focus:outline-none dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:focus:ring-2 dark:focus:ring-blue-500"
  />

  <select 
    value={priority} 
    onChange={(e) => setPriority(e.target.value)} 
    className="p-3 mb-4 sm:mb-0 sm:flex-1 border border-gray-300 rounded-xl dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:focus:ring-2 dark:focus:ring-blue-500"
  >
    <option value="low">Low</option>
    <option value="medium">Medium</option>
    <option value="high">High</option>
  </select>

  <select 
    value={category} 
    onChange={(e) => setCategory(e.target.value)} 
    className="p-3 mb-4 sm:mb-0 sm:flex-1 border border-gray-300 rounded-xl dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:focus:ring-2 dark:focus:ring-blue-500"
  >
    <option value="work">Work</option>
    <option value="home">Home</option>
    <option value="personal">Personal</option>
  </select>

  <button 
    onClick={addTodo} 
    className="bg-blue-600 text-white p-3 rounded-xl shadow-md hover:bg-blue-700 transition duration-300 dark:bg-blue-800 dark:hover:bg-blue-900 sm:w-auto w-full"
  >
    Add
  </button>
</div>


        <input type="text" placeholder="Search tasks" value={search} onChange={(e) => setSearch(e.target.value)} className="flex-grow my-3 p-3 border border-gray-300 rounded-xl shadow-md focus:outline-none dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:focus:ring-2 dark:focus:ring-blue-500" />

        <div className="flex flex-wrap justify-center space-x-4 mb-6">
  <button 
    onClick={() => setFilter('all')} 
    className={`py-2 px-6 rounded-xl ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-600 dark:text-white'} hover:bg-blue-400 dark:hover:bg-blue-700 transition duration-300`}
  >
    All
  </button>
  <button 
    onClick={() => setFilter('active')} 
    className={`py-2 px-6 rounded-xl ${filter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-600 dark:text-white'} hover:bg-blue-400 dark:hover:bg-blue-700 transition duration-300`}
  >
    Active
  </button>
  <button 
    onClick={() => setFilter('completed')} 
    className={`py-2 px-6 rounded-xl ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-600 dark:text-white'} hover:bg-blue-400 dark:hover:bg-blue-700 transition duration-300`}
  >
    Completed
  </button>
</div>

        {showModal && <Modal message={message} onClose={closeModal} />}

        {editTodo ? (
          <div className="flex space-x-2 mb-4">
            <input type="text" value={editText} onChange={(e) => setEditText(e.target.value)} className="flex-grow p-2 border border-gray-300 rounded-xl dark:bg-gray-700 dark:text-white dark:border-gray-600" />
            <button onClick={saveEdit} className="bg-green-500 text-white p-2 rounded-xl hover:bg-green-700 transition duration-300 dark:bg-green-700 dark:hover:bg-green-900">Save</button>
            <button onClick={cancelEdit} className="bg-red-500 text-white p-2 rounded-xl hover:bg-red-700 transition duration-300 dark:bg-red-700 dark:hover:bg-red-900">Cancel</button>
          </div>
        ) : (
          <TodoList todos={filteredTodos} onToggle={toggleTodo} onDelete={deleteTodo} onEdit={startEditing} />
        )}

        <button onClick={clearAllTodos} className="bg-red-500 text-white p-2 rounded-xl my-3 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-900 transition duration-300">Clear All Tasks</button>
      </div>
    </div>
  );
}

export default App;
