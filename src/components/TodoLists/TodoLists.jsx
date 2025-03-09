import React from 'react';
import TodoItem from '../TodoItems/TodoItems';
import { motion, AnimatePresence } from 'framer-motion';

function TodoList({ todos, onToggle, onDelete, onEdit, onSubtaskAction }) {
  return (
    <div className="space-y-4">
      <AnimatePresence>
        {todos.map(todo => (
          <motion.div
            key={todo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.2 }}
            className="todo-item"
          >
            <TodoItem
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
              onSubtaskAction={onSubtaskAction}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default TodoList;
