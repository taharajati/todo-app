import React from 'react';
import { MdDelete } from "react-icons/md";
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';

function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  return (
    <div className="flex justify-between p-3 border-b border-gray-300">
      <span className={`cursor-pointer ${todo.completed ? 'line-through text-gray-500' : ''}`} onClick={() => onToggle(todo.id)}>
        {todo.completed ? <MdCheckBox className="mr-2" /> : <MdCheckBoxOutlineBlank className="mr-2" />}
        {todo.text}
      </span>

      <div className="text-sm text-gray-500">
        {todo.createdAt}
        <br />
        <span className={`text-xs font-bold ${todo.priority === 'high' ? 'text-red-500' : todo.priority === 'medium' ? 'text-yellow-500' : 'text-green-500'}`}>
          {todo.priority.toUpperCase()} Priority
        </span>
        <br />
        <span className="text-xs text-blue-500">{todo.category}</span>
      </div>

      <div className='space-x-3'>
        <button className="text-yellow-500 hover:text-yellow-700" onClick={() => onEdit(todo)}>✏️</button>
        <button className="text-red-500 hover:text-red-700" onClick={() => onDelete(todo.id)}>
          <MdDelete />
        </button>
      </div>
    </div>
  );
}

export default TodoItem;
