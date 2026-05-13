const taskForm = document.querySelector('#taskForm');
const taskTitle = document.querySelector('#taskTitle');
const taskNote = document.querySelector('#taskNote');
const taskList = document.querySelector('#taskList');
const filterButtons = document.querySelectorAll('.filter');
const totalCount = document.querySelector('#totalCount');
const openCount = document.querySelector('#openCount');
const doneCount = document.querySelector('#doneCount');

let currentFilter = 'all';
let tasks = [
  {
    id: 1,
    title: 'Create authentication screens',
    note: 'Prepare login and registration workflow.',
    done: false
  },
  {
    id: 2,
    title: 'Build task CRUD layout',
    note: 'Add create, complete, filter, and delete actions.',
    done: true
  },
  {
    id: 3,
    title: 'Make the site responsive',
    note: 'Test the layout on mobile and desktop widths.',
    done: false
  }
];

function updateCounts() {
  const doneTasks = tasks.filter((task) => task.done).length;
  totalCount.textContent = tasks.length;
  doneCount.textContent = doneTasks;
  openCount.textContent = tasks.length - doneTasks;
}

function getVisibleTasks() {
  if (currentFilter === 'open') {
    return tasks.filter((task) => !task.done);
  }

  if (currentFilter === 'done') {
    return tasks.filter((task) => task.done);
  }

  return tasks;
}

function renderTasks() {
  taskList.innerHTML = '';

  getVisibleTasks().forEach((task) => {
    const article = document.createElement('article');
    article.className = task.done ? 'task done' : 'task';

    article.innerHTML = `
      <div>
        <h3>${task.title}</h3>
      </div>
      <div class="task-actions">
        <button class="complete-btn" type="button">${task.done ? 'Open' : 'Done'}</button>
        <button class="delete-btn" type="button">Delete</button>
      </div>
      <p>${task.note || 'No note added.'}</p>
    `;

    article.querySelector('.complete-btn').addEventListener('click', () => {
      tasks = tasks.map((item) =>
        item.id === task.id ? { ...item, done: !item.done } : item
      );
      updateCounts();
      renderTasks();
    });

    article.querySelector('.delete-btn').addEventListener('click', () => {
      tasks = tasks.filter((item) => item.id !== task.id);
      updateCounts();
      renderTasks();
    });

    taskList.appendChild(article);
  });

  if (taskList.innerHTML === '') {
    taskList.innerHTML = '<p class="empty-state">No tasks match this filter.</p>';
  }
}

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();

  tasks = [
    {
      id: Date.now(),
      title: taskTitle.value.trim(),
      note: taskNote.value.trim(),
      done: false
    },
    ...tasks
  ];

  taskForm.reset();
  currentFilter = 'all';
  filterButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.filter === 'all');
  });
  updateCounts();
  renderTasks();
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    renderTasks();
  });
});

updateCounts();
renderTasks();
