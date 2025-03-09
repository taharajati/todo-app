import React, { useState } from 'react';
import { MdDelete, MdEdit, MdCheckBox, MdCheckBoxOutlineBlank, MdAdd, MdExpandMore, MdExpandLess } from "react-icons/md";
import { motion, AnimatePresence } from 'framer-motion';

function TodoItem({ todo, onToggle, onDelete, onEdit, onSubtaskAction }) {
  const [newSubtask, setNewSubtask] = useState("");
  const [editingSubtaskId, setEditingSubtaskId] = useState(null);
  const [editingSubtaskText, setEditingSubtaskText] = useState("");
  const [isSubtasksExpanded, setIsSubtasksExpanded] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'work':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'home':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'personal':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;

  const getProgress = () => {
    if (!todo.subtasks || todo.subtasks.length === 0) return todo.completed ? 100 : 0;
    const completed = todo.subtasks.filter(subtask => subtask.completed).length;
    return Math.round((completed / todo.subtasks.length) * 100);
  };

  const progress = getProgress();

  const getProgressColor = (progress) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      onSubtaskAction('add', todo.id, newSubtask);
      setNewSubtask("");
    }
  };

  const handleToggleSubtask = (subtaskId) => {
    onSubtaskAction('toggle', todo.id, subtaskId);
  };

  const handleDeleteSubtask = (subtaskId) => {
    onSubtaskAction('delete', todo.id, subtaskId);
  };

  const handleEditSubtask = () => {
    if (editingSubtaskText.trim()) {
      onSubtaskAction('edit', todo.id, {
        subtaskId: editingSubtaskId,
        newText: editingSubtaskText
      });
      setEditingSubtaskId(null);
    }
  };

  return (
    <motion.div
      className="todo-item mb-4"
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300 }}
      style={{
        fontFamily: 'var(--font-family)',
        fontSize: 'var(--font-size)'
      }}
    >
      <div className="flex flex-col h-full border-2 rounded-xl overflow-hidden" style={{ borderColor: 'var(--color-primary)' }}>
        {/* Card Header */}
        <div className="todo-header p-4 border-b" style={{ borderColor: 'var(--color-primary)' }}>
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => onToggle(todo.id)}
              className="text-2xl transition-colors duration-200 hover:text-opacity-70"
            >
              {todo.completed ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
            </button>
            <span className={`text-lg flex-grow ${todo.completed ? 'line-through opacity-70' : ''}`}>
              {todo.text}
            </span>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onEdit(todo)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <MdEdit className="text-xl" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(todo.id)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <MdDelete className="text-xl" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="todo-content p-4">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${getPriorityColor(todo.priority)}`}>
              {todo.priority.toUpperCase()}
            </span>
            <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${getCategoryColor(todo.category)}`}>
              {todo.category.toUpperCase()}
            </span>
            {todo.dueDate && (
              <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                isOverdue
                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
              }`}>
                Due: {new Date(todo.dueDate).toLocaleDateString()}
                {isOverdue && ' (Overdue)'}
              </span>
            )}
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Created: {todo.createdAt}
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                backgroundColor: 'var(--color-accent)'
              }}
            />
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Progress: {progress}%
          </div>

          {/* Subtasks Section */}
          <div className="subtasks-section border-t pt-4" style={{ borderColor: 'var(--color-primary)' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold">Subtasks ({todo.subtasks?.length || 0})</h3>
              <button
                onClick={() => setIsSubtasksExpanded(!isSubtasksExpanded)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                {isSubtasksExpanded ? <MdExpandLess className="text-xl" /> : <MdExpandMore className="text-xl" />}
              </button>
            </div>

            <AnimatePresence>
              {isSubtasksExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSubtask}
                      onChange={(e) => setNewSubtask(e.target.value)}
                      placeholder="Add a subtask"
                      className="flex-grow p-2.5 text-sm border-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ borderColor: 'var(--color-primary)', '--tw-ring-color': 'var(--color-primary)' }}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddSubtask}
                      className="p-2.5 text-white rounded-lg transition-colors duration-200"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                      <MdAdd className="text-xl" />
                    </motion.button>
                  </div>

                  {todo.subtasks && todo.subtasks.map(subtask => (
                    <motion.div
                      key={subtask.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex items-center gap-3 group hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded-lg border"
                      style={{ borderColor: 'var(--color-primary)' }}
                    >
                      {editingSubtaskId === subtask.id ? (
                        <div className="flex gap-2 flex-grow">
                          <input
                            type="text"
                            value={editingSubtaskText}
                            onChange={(e) => setEditingSubtaskText(e.target.value)}
                            className="flex-grow p-2 text-sm border-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-opacity-50"
                            style={{ borderColor: 'var(--color-primary)', '--tw-ring-color': 'var(--color-primary)' }}
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleEditSubtask}
                            className="p-2 text-white rounded-lg transition-colors duration-200"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                          >
                            Save
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setEditingSubtaskId(null)}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            Cancel
                          </motion.button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleToggleSubtask(subtask.id)}
                            className="text-xl transition-colors duration-200"
                            style={{ color: 'var(--color-primary)' }}
                          >
                            {subtask.completed ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
                          </button>
                          <span className={`flex-grow text-sm ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                            {subtask.text}
                          </span>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                setEditingSubtaskId(subtask.id);
                                setEditingSubtaskText(subtask.text);
                              }}
                              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                              style={{ color: 'var(--color-primary)' }}
                            >
                              <MdEdit className="text-lg" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteSubtask(subtask.id)}
                              className="p-1.5 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                            >
                              <MdDelete className="text-lg" />
                            </motion.button>
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default TodoItem;
