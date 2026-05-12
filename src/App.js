import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

import { createTask, deleteTask, getTasks, login, register, updateTask } from './api';

const demoTasks = [
  {
    _id: 'demo-1',
    title: 'Design mobile task cards',
    description: 'Make the dashboard readable on small screens.',
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'demo-2',
    title: 'Connect auth API',
    description: 'Use JWT tokens for private task routes.',
    completed: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'demo-3',
    title: 'Prepare GitHub README',
    description: 'Add setup steps, environment notes, and project overview.',
    completed: false,
    createdAt: new Date().toISOString()
  }
];

const getStoredUser = () => {
  const user = localStorage.getItem('managerUser');
  return user ? JSON.parse(user) : null;
};

function Home() {
  return (
    <main className="home">
      <nav className="nav">
        <Link className="brand" to="/">
          TaskForge
        </Link>
        <div>
          <Link to="/login">Log in</Link>
          <Link className="nav-button" to="/register">
            Start
          </Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Full-stack task management application</p>
          <h1>Build, assign, track, and finish work in one focused place.</h1>
          <p>
            TaskForge combines authentication, CRUD task workflows, progress tracking,
            smart filters, responsive design, and API-ready structure in a clean project
            you can run, study, and extend.
          </p>
          <div className="hero-actions">
            <Link className="primary-link" to="/register">
              Create workspace
            </Link>
            <Link className="secondary-link" to="/login">
              Open dashboard
            </Link>
          </div>
        </div>

        <div className="workspace-preview" aria-label="TaskForge dashboard preview">
          <div className="preview-top">
            <span>Today</span>
            <strong>8 active tasks</strong>
          </div>
          <div className="preview-grid">
            <div>
              <span className="status-dot blue" />
              Auth routes
              <strong>Protected</strong>
            </div>
            <div>
              <span className="status-dot green" />
              Task CRUD
              <strong>Live</strong>
            </div>
            <div>
              <span className="status-dot amber" />
              Mobile UI
              <strong>Ready</strong>
            </div>
            <div>
              <span className="status-dot red" />
              Task filters
              <strong>Focused</strong>
            </div>
            <div>
              <span className="status-dot dark" />
              API structure
              <strong>Clean</strong>
            </div>
          </div>
          <div className="timeline">
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </section>

      <section className="feature-band">
        <article>
          <span>01</span>
          <h2>Secure access</h2>
          <p>Register and log in with JWT-backed protected routes.</p>
        </article>
        <article>
          <span>02</span>
          <h2>Task operations</h2>
          <p>Create, update, complete, and delete work from the dashboard.</p>
        </article>
        <article>
          <span>03</span>
          <h2>Progress tracking</h2>
          <p>Dashboard counters show total, open, and completed tasks at a glance.</p>
        </article>
        <article>
          <span>04</span>
          <h2>Focused filters</h2>
          <p>Switch between all, open, and done tasks to reduce clutter while working.</p>
        </article>
        <article>
          <span>05</span>
          <h2>Responsive workflow</h2>
          <p>The interface adapts from desktop planning to mobile check-ins.</p>
        </article>
      </section>
    </main>
  );
}

function AuthPage({ mode }) {
  const navigate = useNavigate();
  const isRegister = mode === 'register';
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = isRegister ? await register(form) : await login(form);
      localStorage.setItem('managerToken', response.token);
      localStorage.setItem('managerUser', JSON.stringify(response.user));
      navigate('/dashboard');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Check the server and MongoDB connection');
    }
  };

  return (
    <main className="auth-page">
      <Link className="brand auth-brand" to="/">
        TaskForge
      </Link>

      <section className="auth-shell">
        <div className="auth-story">
          <p className="eyebrow">Plan with momentum</p>
          <h1>{isRegister ? 'Create your command center.' : 'Welcome back to your workflow.'}</h1>
          <p>
            Keep every task tied to the right account, then move work from idea to done
            without losing context.
          </p>
        </div>

        <form className="panel auth-panel" onSubmit={handleSubmit}>
          <h2>{isRegister ? 'Create account' : 'Log in'}</h2>

          {isRegister && (
            <label>
              Name
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Your name"
              />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="you@example.com"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="Password"
            />
          </label>

          {error && <p className="error">{error}</p>}

          <button type="submit">{isRegister ? 'Register' : 'Log in'}</button>

          <p className="muted">
            {isRegister ? 'Already have an account?' : 'Need an account?'}{' '}
            <Link to={isRegister ? '/login' : '/register'}>
              {isRegister ? 'Log in' : 'Register'}
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [user] = useState(getStoredUser);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    getTasks()
      .then(setTasks)
      .catch(() => {
        setTasks(demoTasks);
        setError('Demo tasks are showing because the backend is not connected yet.');
      });
  }, []);

  const stats = useMemo(() => {
    const completed = tasks.filter((task) => task.completed).length;
    const open = tasks.length - completed;
    return { total: tasks.length, completed, open };
  }, [tasks]);

  const visibleTasks = tasks.filter((task) => {
    if (filter === 'open') return !task.completed;
    if (filter === 'done') return task.completed;
    return true;
  });

  const handleCreate = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const task = await createTask(newTask);
      setTasks([task, ...tasks]);
      setNewTask({ title: '', description: '' });
    } catch (apiError) {
      const task = {
        _id: `local-${Date.now()}`,
        ...newTask,
        completed: false,
        createdAt: new Date().toISOString()
      };
      setTasks([task, ...tasks]);
      setNewTask({ title: '', description: '' });
      setError('Saved as a local preview task because the backend is offline.');
    }
  };

  const handleToggle = async (task) => {
    const optimisticTask = { ...task, completed: !task.completed };
    setTasks(tasks.map((item) => (item._id === task._id ? optimisticTask : item)));

    if (task._id.startsWith('demo-') || task._id.startsWith('local-')) return;

    try {
      const updated = await updateTask(task._id, { completed: !task.completed });
      setTasks((current) => current.map((item) => (item._id === updated._id ? updated : item)));
    } catch (apiError) {
      setError('Could not sync the task update.');
    }
  };

  const handleDelete = async (taskId) => {
    setTasks(tasks.filter((task) => task._id !== taskId));

    if (taskId.startsWith('demo-') || taskId.startsWith('local-')) return;

    try {
      await deleteTask(taskId);
    } catch (apiError) {
      setError('Could not sync the task deletion.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('managerToken');
    localStorage.removeItem('managerUser');
    navigate('/login');
  };

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Workspace</p>
          <h1>{user?.name || 'Manager'}'s task board</h1>
        </div>
        <button className="secondary" onClick={handleLogout}>
          Log out
        </button>
      </header>

      <section className="stats-row">
        <article>
          <span>Total</span>
          <strong>{stats.total}</strong>
        </article>
        <article>
          <span>Open</span>
          <strong>{stats.open}</strong>
        </article>
        <article>
          <span>Done</span>
          <strong>{stats.completed}</strong>
        </article>
      </section>

      <form className="panel task-form" onSubmit={handleCreate}>
        <input
          value={newTask.title}
          onChange={(event) => setNewTask({ ...newTask, title: event.target.value })}
          placeholder="Task title"
        />
        <input
          value={newTask.description}
          onChange={(event) => setNewTask({ ...newTask, description: event.target.value })}
          placeholder="Description"
        />
        <button type="submit">Add task</button>
      </form>

      <div className="toolbar">
        {['all', 'open', 'done'].map((item) => (
          <button
            className={filter === item ? 'filter active' : 'filter'}
            key={item}
            onClick={() => setFilter(item)}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>

      {error && <p className="notice">{error}</p>}

      <section className="task-list">
        {visibleTasks.map((task) => (
          <article className={task.completed ? 'task complete' : 'task'} key={task._id}>
            <label>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggle(task)}
              />
              <span>{task.title}</span>
            </label>
            <p>{task.description || 'No description yet.'}</p>
            <button className="danger" onClick={() => handleDelete(task._id)}>
              Delete
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}

function RequireAuth({ children }) {
  return localStorage.getItem('managerToken') ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
    </Routes>
  );
}

export default App;
