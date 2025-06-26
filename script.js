document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');

    // Progress bar setup
    const progressBar = document.createElement('progress');
    progressBar.max = 100;
    progressBar.value = 0;
    progressBar.style.width = '100%';
    progressBar.style.marginTop = '20px';
    taskList.parentElement.appendChild(progressBar);

    // Confetti CDN
    const loadConfettiScript = () => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.1/dist/confetti.browser.min.js';
        document.body.appendChild(script);
    };
    loadConfettiScript();

    const getTasks = () => {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    };

    const saveTasks = (tasks) => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const updateProgress = () => {
        const tasks = getTasks();
        const completed = tasks.filter(task => task.completed).length;
        const total = tasks.length;
        progressBar.value = total ? (completed / total) * 100 : 0;

        // Confetti on all completed
        if (total && completed === total) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    };

    const renderTasks = () => {
        taskList.innerHTML = '';
        const tasks = getTasks();

        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = 'task-item';
            li.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''} data-index="${index}" class="check-task">
                <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
                <button class="edit-btn" data-index="${index}"><i class="fa fa-edit"></i></button>
                <button class="delete-btn" data-index="${index}"><i class="fa fa-trash"></i></button>
            `;
            taskList.appendChild(li);
        });

        updateProgress();
    };

    const addTask = (event) => {
        event.preventDefault();
        const text = taskInput.value.trim();
        if (!text) return;

        const tasks = getTasks();
        tasks.push({ text, completed: false });
        saveTasks(tasks);
        taskInput.value = '';
        renderTasks();
    };

    const toggleComplete = (index) => {
        const tasks = getTasks();
        tasks[index].completed = !tasks[index].completed;
        saveTasks(tasks);
        renderTasks();
    };

    const deleteTask = (index) => {
        const tasks = getTasks();
        tasks.splice(index, 1);
        saveTasks(tasks);
        renderTasks();
    };

    const editTask = (index) => {
        const tasks = getTasks();
        const newText = prompt("Edit your task", tasks[index].text);
        if (newText !== null && newText.trim() !== '') {
            tasks[index].text = newText.trim();
            saveTasks(tasks);
            renderTasks();
        }
    };

    taskList.addEventListener('click', (e) => {
        const index = e.target.closest('button')?.dataset.index || e.target.dataset.index;
        if (e.target.closest('.delete-btn')) deleteTask(index);
        else if (e.target.closest('.edit-btn')) editTask(index);
        else if (e.target.classList.contains('check-task')) toggleComplete(index);
    });

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask(e);
    });

    renderTasks();
});
