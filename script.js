let tasks = [];
let completedTasks = [];

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const dueDateTime = new Date(document.getElementById('dueDateTime').value);
    const taskText = taskInput.value.trim();
    if (taskText !== '' && !isNaN(dueDateTime.getTime())) {
        const task = {
            text: taskText,
            dueDate: dueDateTime,
            completed: false
        };
        tasks.push(task);
        tasks.sort((a, b) => a.dueDate - b.dueDate); // Sort tasks by due date
        updateTaskList();
        taskInput.value = '';
        document.getElementById('dueDateTime').value = '';
    }
}

function updateTaskList() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'task';
        if (task.completed) {
            listItem.className += ' completed-task';
            listItem.innerHTML = `
                <span><del>${task.text} - ${task.dueDate.toLocaleString()}</del></span>
                <button class="undo-button" onclick="undoTask(${index})">Undo</button>
            `;
        } else {
            listItem.innerHTML = `
                <span>${task.text} - ${task.dueDate.toLocaleString()}</span>
                <button class="delete-button" onclick="deleteTask(${index})">Delete</button>
                <button onclick="completeTask(${index})">Complete</button>
            `;
            if (task.dueDate < new Date()) {
                listItem.className += ' overdue-task';
            }
        }
        taskList.appendChild(listItem);
    });
    updateCompletedTaskList();
    updateCompletionPercentage();
    checkReminders();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    updateTaskList();
}

function completeTask(index) {
    const task = tasks[index];
    task.completed = true;
    completedTasks.push(task);
    tasks.splice(index, 1); // Remove task from active list
    updateTaskList();
}

function undoTask(index) {
    const task = completedTasks[index - tasks.length];
    task.completed = false;
    completedTasks.splice(index - tasks.length, 1); // Remove task from completed list
    tasks.push(task);
    tasks.sort((a, b) => a.dueDate - b.dueDate); // Sort tasks by due date
    updateTaskList();
}


function showCompletedTasks() {
    const completedTasksDiv = document.getElementById('completedTasks');
    const button = completedTasksDiv.previousElementSibling;
    completedTasksDiv.style.display = completedTasksDiv.style.display === 'none' ? 'block' : 'none';
    button.textContent = completedTasksDiv.style.display === 'none' ? 'Show Completed Tasks' : 'Hide Completed Tasks';
    updateCompletedTaskList();
}

function updateCompletedTaskList() {
    const completedTaskList = document.getElementById('completedTaskList');
    completedTaskList.innerHTML = '';
    completedTasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'task completed-task';
        listItem.innerHTML = `
            <span><del>${task.text} - ${task.dueDate.toLocaleString()}</del></span>
            <button class="undo-button" onclick="undoTask(${tasks.length + index})">Undo</button>
        `;
        completedTaskList.appendChild(listItem);
    });
}

function updateCompletionPercentage() {
    const totalTasks = tasks.length + completedTasks.length;
    const completedPercentage = Math.round((completedTasks.length / totalTasks) * 100);
    document.getElementById('completionPercentage').textContent = `Completion: ${completedPercentage}%`;
}

function checkReminders() {
    const now = new Date().getTime();
    tasks.forEach(task => {
        const dueDateTime = task.dueDate.getTime();
        const timeDifference = dueDateTime - now;
        if (timeDifference < 0 && !task.completed) {
            alert(`Reminder: Task "${task.text}" is overdue!`);
        } else if (timeDifference < 3600000) { // 1 hour in milliseconds
            const remainingMinutes = Math.floor(timeDifference / 60000);
            alert(`Reminder: Task "${task.text}" due in ${remainingMinutes} minutes!`);
        }
    });
}