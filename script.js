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
                <span class="text">${task.text} - ${task.dueDate.toLocaleString()}</span>
                <button class="undo-button" onclick="undoTask(${index})">Undo</button>
            `;
        } else {
            listItem.innerHTML = `
                <span class="text">${task.text} - ${task.dueDate.toLocaleString()}</span>
                <button class="delete-button" onclick="deleteTask(${index})">Delete</button>
                <button class="complete-button" onclick="completeTask(${index})">Complete</button>
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
            <span class="text">${task.text} - ${task.dueDate.toLocaleString()}</span>
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


var images = [
    "https://img.freepik.com/free-photo/wide-angle-shot-single-tree-growing-clouded-sky-sunset-surrounded-by-grass_181624-22807.jpg?t=st=1715750457~exp=1715754057~hmac=6beb924548c0bcfda11a7de5cee6f8da547a1f58b8980b40e9607b51a6c1d2b1&w=996",
    "https://img.freepik.com/free-photo/beautiful-shot-small-lake-with-wooden-rowboat-focus-breathtaking-clouds-sky_181624-2490.jpg?t=st=1715750638~exp=1715754238~hmac=9253c9e0f9231ae0b71ac00ce620fb5d529a2c66af34c5bd330f6fd7b787ae9d&w=996",
    "https://img.freepik.com/free-photo/beautiful-scenery-summit-mount-everest-covered-with-snow-white-clouds_181624-21317.jpg?t=st=1715756885~exp=1715760485~hmac=85e7e15f86e8bb75dfb5a459714ec3a7e917e4e6da5fad55368880d3cfe09587&w=996",
    "https://img.freepik.com/free-photo/fog-dark-clouds-mountains_1204-503.jpg?t=st=1715750812~exp=1715754412~hmac=031d2ee33c86c2357641dc959c8dc79fe9dc207ee703a96848d58c5fcfc538e0&w=996",
    "https://img.freepik.com/free-photo/majestic-mountains-with-snow-water-scene-generative-ai_188544-12459.jpg?t=st=1715751105~exp=1715754705~hmac=f0c99d9bd816bc12d04a01b11044e4b4d51f0c3b60fac1283c2f2ff0aa0a233b&w=1060"    
];

// Function to set a random background image
function setRandomBackground() {
        // Get a random index from the images array
        var randomIndex = Math.floor(Math.random() * images.length);
        
        // Set the background image of the body
        document.body.style.backgroundImage = "url('" + images[randomIndex] + "')";
        
    }

    // Call the function initially to set the background
    setRandomBackground();

    // Change the background image every 15 minutes (in milliseconds)
    setInterval(setRandomBackground, 1 * 60 * 1000);