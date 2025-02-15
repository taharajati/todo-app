import React from 'react';
import TodoItem from '../TodoItems/TodoItems';

function TodoList({ todos, onToggle, onDelete, onEdit }) {
    return (
      <div className="space-y-2">
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} 
          className="flex flex-col sm:flex-row items-center sm:items-start space-x-4"

          />
        ))}
      </div>
    );
  }

export default TodoList;
