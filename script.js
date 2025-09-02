document.addEventListener('DOMContentLoaded', () => {

    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
        window.location.href = 'login.html';
        return;
    }
    const username = localStorage.getItem('username') || userEmail.split('@')[0];
    const userPhone = localStorage.getItem('userPhone');

    // --- Global Functions and Elements ---
    const sidebarUsername = document.getElementById('sidebar-username');
    const sidebarUseremail = document.getElementById('sidebar-useremail');
    const currentDay = document.getElementById('current-day');
    const currentDate = document.getElementById('current-date');
    const searchInput = document.getElementById('search-input');
    const themeToggle = document.getElementById('theme-toggle');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Function to load the profile picture across all pages
    const loadProfilePic = () => {
        const userAvatarElements = document.querySelectorAll('.user-avatar img');
        const storedProfilePic = localStorage.getItem('profilePic');
        if (storedProfilePic) {
            userAvatarElements.forEach(img => {
                img.src = storedProfilePic;
            });
        }
    };
    loadProfilePic();

    // Set user info in sidebar
    if (sidebarUsername) {
        sidebarUsername.textContent = username;
        sidebarUseremail.textContent = userEmail;
    }

    // Set current date
    const today = new Date();
    const optionsDay = { weekday: 'long' };
    const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };
    if (currentDay && currentDate) {
        currentDay.textContent = today.toLocaleDateString('en-US', optionsDay);
        currentDate.textContent = today.toLocaleDateString('en-GB', optionsDate);
    }

    // Theme Toggle Functionality
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.add(currentTheme + '-theme');
    if (themeToggle) {
        themeToggle.querySelector('i').className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            document.body.classList.toggle('dark-theme');
            const newTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            themeToggle.querySelector('i').className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        });
    }

    // Search functionality (common to all pages)
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const allTasks = document.querySelectorAll('.task-list-items .task-item');
            allTasks.forEach(item => {
                const taskText = item.textContent.toLowerCase();
                if (taskText.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // Handle logout button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = 'login.html';
        });
    }


    // --- Page-Specific Logic ---
    const initDashboardPage = () => {
        const welcomeMessageDashboard = document.getElementById('welcome-message-dashboard');
        const dashboardTaskList = document.getElementById('dashboard-task-list');
        const completedTasksList = document.getElementById('dashboard-completed-list');
        const taskStatusWidget = document.querySelector('.task-status-widget .status-chart');
        const countdownTaskName = document.getElementById('countdown-task-name');
        const countdownTimerDisplay = document.getElementById('countdown-timer');
        
        const dashboardTaskForm = document.getElementById('dashboard-task-form');
        const dashboardTaskInput = document.getElementById('dashboard-task-input');
        const dashboardDueDateInput = document.getElementById('dashboard-due-date-input');

        if (welcomeMessageDashboard) {
            welcomeMessageDashboard.textContent = `Welcome back, ${username} 👋`;
        }
        
        // Add a new task (from the dashboard widget)
        if (dashboardTaskForm) {
            dashboardTaskForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const newTaskText = dashboardTaskInput.value.trim();
                const newDueDate = dashboardDueDateInput.value;
                
                if (newTaskText) {
                    tasks.push({ text: newTaskText, completed: false, dueDate: newDueDate });
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                    renderDashboardTasks();
                    dashboardTaskInput.value = '';
                    dashboardDueDateInput.value = '';
                }
            });
        }

        const renderDashboardTasks = () => {
            dashboardTaskList.innerHTML = '';
            completedTasksList.innerHTML = '';
            
            tasks.forEach((task, index) => {
                const li = document.createElement('li');
                li.className = `task-item ${task.completed ? 'completed' : ''}`;
                li.setAttribute('data-index', index);

                const dueDateObj = task.dueDate ? new Date(task.dueDate) : null;
                const dueDateText = dueDateObj ? dueDateObj.toLocaleString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'No Due Date';
                
                li.innerHTML = `
                    <div>
                        <span>${task.text}</span>
                        <small class="due-date">Due: ${dueDateText}</small>
                    </div>
                    <div class="actions">
                        <button class="complete-btn"><i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i></button>
                        <button class="delete-btn"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                
                if (task.completed) {
                    completedTasksList.appendChild(li);
                } else {
                    dashboardTaskList.appendChild(li);
                }
            });
            updateTaskStatusCharts();
        };

        const updateTaskStatusCharts = () => {
            const totalTasks = tasks.length;
            const completedCount = tasks.filter(task => task.completed).length;
            const inProgressCount = tasks.filter(task => !task.completed).length;
            
            const completedPercentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
            const inProgressPercentage = totalTasks > 0 ? Math.round((inProgressCount / totalTasks) * 100) : 0;
            
            taskStatusWidget.innerHTML = `
                <div class="chart-item">
                    <div class="chart-circle" style="--percentage: ${completedPercentage}%; --color: var(--completed-color);"><span>${completedPercentage}%</span></div>
                    <span class="chart-label"><i class="fas fa-circle green"></i> Completed</span>
                </div>
                <div class="chart-item">
                    <div class="chart-circle" style="--percentage: ${inProgressPercentage}%; --color: var(--in-progress-color);"><span>${inProgressPercentage}%</span></div>
                    <span class="chart-label"><i class="fas fa-circle blue"></i> In Progress</span>
                </div>
                <div class="chart-item">
                    <div class="chart-circle" style="--percentage: 0%; --color: var(--not-started-color);"><span>0%</span></div>
                    <span class="chart-label"><i class="fas fa-circle red"></i> Not Started</span>
                </div>
            `;
        };
        
        const updateCountdown = () => {
            const now = new Date().getTime();
            const soonestTask = tasks
                .filter(task => !task.completed && task.dueDate && new Date(task.dueDate).getTime() > now)
                .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0];

            if (soonestTask) {
                const dueTime = new Date(soonestTask.dueDate).getTime();
                const timeLeft = dueTime - now;
                
                const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                
                const formatTime = num => String(num).padStart(2, '0');
                
                countdownTaskName.textContent = `"${soonestTask.text}" due in:`;
                countdownTimerDisplay.textContent = `${days}d ${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
                countdownTimerDisplay.style.color = 'var(--accent-color)';
            } else {
                countdownTaskName.textContent = "No upcoming deadlines!";
                countdownTimerDisplay.textContent = "Enjoy your day!";
                countdownTimerDisplay.style.color = 'var(--placeholder-color)';
            }
        };

        document.querySelector('.dashboard-widgets-grid').addEventListener('click', (e) => {
            const target = e.target;
            const actionButton = target.closest('.actions button');
            if (!actionButton) return;
            const li = actionButton.closest('.task-item');
            if (!li) return;
            const index = parseInt(li.getAttribute('data-index'));
            
            if (actionButton.classList.contains('complete-btn')) {
                tasks[index].completed = !tasks[index].completed;
                localStorage.setItem('tasks', JSON.stringify(tasks));
                renderDashboardTasks();
            } else if (actionButton.classList.contains('delete-btn')) {
                tasks.splice(index, 1);
                localStorage.setItem('tasks', JSON.stringify(tasks));
                renderDashboardTasks();
            }
        });

        renderDashboardTasks();
        setInterval(updateCountdown, 1000);
    };

    const initHistoryPage = () => {
        const historyTaskList = document.getElementById('history-task-list');
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <div>
                    <span>${task.text}</span>
                    <small class="due-date">Due: ${task.dueDate ? new Date(task.dueDate).toLocaleString() : 'No Due Date'}</small>
                </div>
            `;
            historyTaskList.appendChild(li);
        });
    };

    const initSettingsPage = () => {
        const settingsForm = document.getElementById('settings-form');
        const settingsUsernameInput = document.getElementById('settings-username-input');
        const settingsEmailInput = document.getElementById('settings-email-input');
        const settingsPhoneInput = document.getElementById('settings-phone-input');
        const profilePicInput = document.getElementById('profile-pic-input');
        const profilePicPreview = document.getElementById('profile-pic-preview');

        // Set initial values from local storage
        settingsUsernameInput.value = localStorage.getItem('username') || '';
        settingsEmailInput.value = localStorage.getItem('userEmail') || '';
        settingsPhoneInput.value = localStorage.getItem('userPhone') || '';
        
        // Update profile picture preview if one exists
        const storedProfilePic = localStorage.getItem('profilePic');
        if (storedProfilePic) {
            profilePicPreview.src = storedProfilePic;
        }

        // Handle profile picture upload
        profilePicInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const dataUrl = event.target.result;
                    profilePicPreview.src = dataUrl;
                    localStorage.setItem('profilePic', dataUrl);
                    loadProfilePic();
                };
                reader.readAsDataURL(file);
            }
        });

        // Handle form submission
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            localStorage.setItem('username', settingsUsernameInput.value);
            localStorage.setItem('userEmail', settingsEmailInput.value);
            localStorage.setItem('userPhone', settingsPhoneInput.value);
            alert('Settings saved successfully!');
            window.location.reload();
        });
    };

    // Initialize the correct page based on the URL
    if (window.location.pathname.includes('history.html')) {
        initHistoryPage();
    } else if (window.location.pathname.includes('settings.html')) {
        initSettingsPage();
    } else {
        initDashboardPage();
    }
});