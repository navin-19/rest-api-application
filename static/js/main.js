document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');

    // Load tasks when page loads
    loadTasks();

    // Form submission for new task
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const title = taskInput.value.trim();
        if (title) {
            addTask(title);
            taskInput.value = '';
        }
    });

    // Load all tasks from API
    function loadTasks() {
        fetch('/api/tasks')
            .then(response => response.json()) 
            .then(tasks => {
                taskList.innerHTML = '';
                tasks.forEach(task => {
                    addTaskToDOM(task);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    // Add a new task via API
    function addTask(title) {
        fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: title })
        })
        .then(response => response.json())
        .then(task => {
            addTaskToDOM(task);
        })
        .catch(error => console.error('Error:', error));
    }

    // Update task status via API
    function toggleTaskStatus(taskId, currentStatus) {
        fetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ done: !currentStatus })
        })
        .then(response => response.json())
        .then(updatedTask => {
            const taskElement = document.querySelector(`.task[data-id="${taskId}"]`);
            if (updatedTask.done) {
                taskElement.classList.add('done');
            } else {
                taskElement.classList.remove('done');
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Delete task via API
    function deleteTask(taskId) {
        fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(() => {
            document.querySelector(`.task[data-id="${taskId}"]`).remove();
        })
        .catch(error => console.error('Error:', error));
    }

    // Add task to DOM
    function addTaskToDOM(task) {
        const taskElement = document.createElement('div');
        taskElement.className = `task ${task.done ? 'done' : ''}`;
        taskElement.dataset.id = task.id;
        
        const titleSpan = document.createElement('span');
        titleSpan.textContent = task.title;
        
        const buttonsDiv = document.createElement('div');
        
        const toggleButton = document.createElement('button');
        toggleButton.textContent = task.done ? 'Undo' : 'Done';
        toggleButton.onclick = () => toggleTaskStatus(task.id, task.done);
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteTask(task.id);
        
        buttonsDiv.appendChild(toggleButton);
        buttonsDiv.appendChild(deleteButton);
        
        taskElement.appendChild(titleSpan);
        taskElement.appendChild(buttonsDiv);
        
        taskList.appendChild(taskElement);
    }
});