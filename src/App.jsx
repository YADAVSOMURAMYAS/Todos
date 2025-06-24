// src/App.jsx
import { useState, useEffect, useRef } from 'react'; // <-- Import useRef
import { TodoProvider } from './contexts/TodoContext';
import useDarkMode from './hooks/useDarkMode';
import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';
import { AnimatePresence, motion } from 'framer-motion';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

function App() {
  const [todos, setTodos] = useState([]);
  const [theme, setTheme] = useDarkMode();
  const appContainerRef = useRef(null); // Ref for the main container

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  // --- This effect handles the interactive mouse-following spotlight ---
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!appContainerRef.current) return;
      // Set CSS custom properties on the main div for the mouse position
      appContainerRef.current.style.setProperty('--mouse-x', `${e.clientX}px`);
      appContainerRef.current.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    // Cleanup function to remove the event listener
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // --- React logic for todos (unchanged) ---
  const addTodo = (todo) => setTodos((prev) => [{ id: Date.now(), ...todo }, ...prev]);
  const updateTodo = (id, todo) => setTodos((prev) => prev.map((prevTodo) => (prevTodo.id === id ? todo : prevTodo)));
  const deleteTodo = (id) => setTodos((prev) => prev.filter((todo) => todo.id !== id));
  const toggleComplete = (id) => setTodos((prev) => prev.map((prevTodo) => (prevTodo.id === id ? { ...prevTodo, completed: !prevTodo.completed } : prevTodo)));
  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem("todos"));
    if (todos && todos.length > 0) setTodos(todos);
  }, []);
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);
  // --- End of logic ---

  return (
    <TodoProvider value={{ todos, addTodo, updateTodo, deleteTodo, toggleComplete }}>
      {/* 
        This is the main container. It has the ref for interactivity and the
        style attribute for the radial gradient that follows the mouse.
      */}
      <div
        ref={appContainerRef}
        className="min-h-screen w-full bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-50 transition-colors duration-500"
        style={{
          backgroundImage: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), ${
            theme === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(147, 51, 234, 0.15)'
          }, transparent 80%)`,
        }}
      >
        {/* === THE ENTIRE SELF-CONTAINED BACKGROUND IS HERE === */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-50"></div>
          
          {/* Animated color blobs using animate-spin */}
          <div className="absolute top-0 -left-1/4 w-96 h-96 bg-violet-500/50 rounded-full filter blur-3xl opacity-50 animate-spin [animation-duration:20s]"></div>
          <div className="absolute bottom-0 -right-1/4 w-96 h-96 bg-sky-500/50 rounded-full filter blur-3xl opacity-50 animate-spin [animation-duration:25s]"></div>
        </div>

        {/* This div centers the main content and adds padding */}
        <div className="relative z-10 flex flex-col items-center pt-8 sm:pt-12 pb-8">
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/50 dark:border-slate-800"
          >
            {/* --- Card Header with Gradient Text --- */}
            <div className="flex justify-between items-center p-6 border-b border-slate-200/80 dark:border-slate-800/80">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
                My Tasks
              </h1>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
              </button>
            </div>

            {/* --- Card Body --- */}
            <div className="p-6">
              <div className="mb-6">
                <TodoForm />
              </div>

              <div className="flex flex-col gap-y-3">
                <AnimatePresence>
                  {todos.map((todo) => (
                    <TodoItem key={todo.id} todo={todo} />
                  ))}
                </AnimatePresence>
                {todos.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-10 text-slate-500 dark:text-slate-400"
                  >
                    You're all caught up!
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </TodoProvider>
  );
}

export default App;