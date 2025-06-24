// src/components/TodoForm.jsx
import React, { useState } from 'react';
import { useTodo } from '../contexts/TodoContext';

function TodoForm() {
  const [todo, setTodo] = useState("");
  const { addTodo } = useTodo();

  const add = (e) => {
    e.preventDefault();
    if (!todo.trim()) return;
    addTodo({ todo, completed: false });
    setTodo("");
  };

  return (
    <form onSubmit={add} className="flex gap-3 items-center">
      <div className="relative flex-grow">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Add a new task..."
          className="w-full rounded-full pl-11 pr-4 py-3 outline-none duration-300 bg-zinc-100 dark:bg-zinc-900/80 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 shadow-inner"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="rounded-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold shrink-0 transition-all duration-300 ease-out hover:shadow-lg hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0"
      >
        Add
      </button>
    </form>
  );
}

export default TodoForm;