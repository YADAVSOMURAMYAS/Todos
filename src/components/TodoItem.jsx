// src/components/TodoItem.jsx
import React, { useState } from 'react';
import { useTodo } from '../contexts/TodoContext';
import { motion } from 'framer-motion';

function TodoItem({ todo }) {
  const [isTodoEditable, setIsTodoEditable] = useState(false);
  const [todoMsg, setTodoMsg] = useState(todo.todo);
  const { updateTodo, deleteTodo, toggleComplete } = useTodo();

  const editTodo = () => {
    updateTodo(todo.id, { ...todo, todo: todoMsg.trim() });
    setIsTodoEditable(false);
  };
  const toggleCompleted = () => toggleComplete(todo.id);

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      variants={itemVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
      className={`group flex items-center rounded-xl p-3 gap-x-4 transition-all duration-300 border ${
        todo.completed
          ? 'bg-zinc-100/50 dark:bg-zinc-800/50 border-transparent border-l-4 border-l-green-500 opacity-70'
          : 'bg-white/50 dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-700/80 hover:border-indigo-400 dark:hover:border-indigo-500'
      }`}
    >
      {/* Custom Checkbox */}
      <input
        id={`checkbox-${todo.id}`}
        type="checkbox"
        className="hidden"
        checked={todo.completed}
        onChange={toggleCompleted}
      />
      <label
        htmlFor={`checkbox-${todo.id}`}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all duration-300 ${
          todo.completed
            ? 'bg-indigo-500 border-indigo-500'
            : 'border-zinc-300 dark:border-zinc-600 group-hover:border-indigo-400'
        }`}
      >
        {todo.completed && (
          <motion.svg
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </motion.svg>
        )}
      </label>

      <input
        type="text"
        className={`w-full bg-transparent text-lg text-zinc-800 dark:text-zinc-200 outline-none transition-all duration-200 ${
          isTodoEditable ? 'text-indigo-600 dark:text-indigo-400' : ''
        } ${todo.completed ? 'line-through text-zinc-500 dark:text-zinc-400' : ''}`}
        value={todoMsg}
        onChange={(e) => setTodoMsg(e.target.value)}
        readOnly={!isTodoEditable}
        onBlur={isTodoEditable ? editTodo : null}
      />

      {/* Action Buttons - Appear on Hover */}
      <div className="flex items-center gap-x-2 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          className="w-8 h-8 rounded-full flex justify-center items-center bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={() => {
            if (todo.completed) return;
            if (isTodoEditable) editTodo();
            else setIsTodoEditable(true);
          }}
          disabled={todo.completed}
        >
          {isTodoEditable ? '📁' : '✏️'}
        </button>
        <button
          className="w-8 h-8 rounded-full flex justify-center items-center bg-red-100 dark:bg-red-900/40 text-red-500 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/60"
          onClick={() => deleteTodo(todo.id)}
        >
          ❌
        </button>
      </div>
    </motion.div>
  );
}

export default TodoItem;