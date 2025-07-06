// Task Manager Application
class TaskManager {
    constructor() {
        this.tasks = [];
        this.taskIdCounter = 1;
        this.currentFilter = {
            status: 'all',
            category: 'all'
        };
        this.currentSort = 'created';
        this.searchQuery = '';
        this.notificationSettings = {
            enableSounds: true,
            enableBrowserNotifications: true,
            reminderTime: 1,
            workStartTime: '09:00',
            workEndTime: '17:00',
            weekendNotifications: false
        };
        this.activeTab = 'urgent';
        this.notificationHistory = [];
        this.snoozedNotifications = [];
        this.lastNotificationCheck = new Date();
        
        this.initializeElements();
        this.bindEvents();
        this.loadTasks();
        this.loadNotificationSettings();
        this.requestNotificationPermission();
        this.updateDisplay();
        this.startNotificationScheduler();
    }

    initializeElements() {
        // Form elements
        this.taskForm = document.getElementById('taskForm');
        this.taskTitle = document.getElementById('taskTitle');
        this.taskPriority = document.getElementById('taskPriority');
        this.taskCategory = document.getElementById('taskCategory');
        this.taskDueDate = document.getElementById('taskDueDate');
        this.taskDescription = document.getElementById('taskDescription');

        // Display elements
        this.taskList = document.getElementById('taskList');
        this.emptyState = document.getElementById('emptyState');

        // Stats elements
        this.totalTasksEl = document.getElementById('totalTasks');
        this.completedTasksEl = document.getElementById('completedTasks');
        this.pendingTasksEl = document.getElementById('pendingTasks');
        this.completionRateEl = document.getElementById('completionRate');

        // Filter elements
        this.filterStatus = document.getElementById('filterStatus');
        this.filterCategory = document.getElementById('filterCategory');
        this.sortBy = document.getElementById('sortBy');

        // Search elements
        this.taskSearch = document.getElementById('taskSearch');
        this.clearSearchBtn = document.getElementById('clearSearch');
        this.searchResults = document.getElementById('searchResults');

        // Notification elements
        this.notificationBadge = document.getElementById('notificationBadge');
        this.notificationCount = document.getElementById('notificationCount');
        this.notificationPanel = document.getElementById('notificationPanel');
        this.closeNotificationsBtn = document.getElementById('closeNotifications');
        this.notificationSettingsBtn = document.getElementById('notificationSettings');
        this.productivityInsightsBtn = document.getElementById('productivityInsights');

        // Tab elements
        this.urgentList = document.getElementById('urgentList');
        this.upcomingList = document.getElementById('upcomingList');
        this.productivityInsightsList = document.getElementById('productivityInsightsList');

        // Modal elements
        this.settingsModal = document.getElementById('settingsModal');
        this.closeSettingsBtn = document.getElementById('closeSettings');
        this.saveSettingsBtn = document.getElementById('saveSettings');
        this.resetSettingsBtn = document.getElementById('resetSettings');

        // Toast elements
        this.notificationToast = document.getElementById('notificationToast');
    }

    bindEvents() {
        this.taskForm.addEventListener('submit', (e) => this.handleAddTask(e));
        this.filterStatus.addEventListener('change', () => this.updateFilters());
        this.filterCategory.addEventListener('change', () => this.updateFilters());
        this.sortBy.addEventListener('change', () => this.updateSort());

        // Search events
        this.taskSearch.addEventListener('input', (e) => this.handleSearch(e));
        this.clearSearchBtn.addEventListener('click', () => this.clearSearch());

        // Notification events
        this.notificationBadge.addEventListener('click', () => this.toggleNotificationPanel());
        this.closeNotificationsBtn.addEventListener('click', () => this.closeNotificationPanel());
        this.notificationSettingsBtn.addEventListener('click', () => this.openSettingsModal());
        this.productivityInsightsBtn.addEventListener('click', () => this.switchTab('insights'));

        // Modal events
        this.closeSettingsBtn.addEventListener('click', () => this.closeSettingsModal());
        this.saveSettingsBtn.addEventListener('click', () => this.saveNotificationSettings());
        this.resetSettingsBtn.addEventListener('click', () => this.resetNotificationSettings());

        // Tab events
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.notificationBadge.contains(e.target) && !this.notificationPanel.contains(e.target)) {
                this.closeNotificationPanel();
            }
            if (e.target === this.settingsModal) {
                this.closeSettingsModal();
            }
        });
    }

    handleAddTask(e) {
        e.preventDefault();
        
        const task = {
            id: this.taskIdCounter++,
            title: this.taskTitle.value.trim(),
            priority: this.taskPriority.value,
            category: this.taskCategory.value,
            dueDate: this.taskDueDate.value,
            description: this.taskDescription.value.trim(),
            completed: false,
            createdAt: new Date().toISOString()
        };

        if (task.title) {
            this.tasks.push(task);
            this.saveTasks();
            this.updateDisplay();
            this.taskForm.reset();
        }
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
            this.saveTasks();
            this.updateDisplay();
        }
    }

    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            // Fill form with task data
            this.taskTitle.value = task.title;
            this.taskPriority.value = task.priority;
            this.taskCategory.value = task.category;
            this.taskDueDate.value = task.dueDate;
            this.taskDescription.value = task.description;

            // Remove task and let user re-add it
            this.deleteTask(taskId);
            
            // Scroll to form
            this.taskForm.scrollIntoView({ behavior: 'smooth' });
        }
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.saveTasks();
        this.updateDisplay();
    }

    updateDisplay() {
        this.renderTasks();
        this.updateStats();
        this.updateEmptyState();
        this.updateSearchResults();
        this.updateNotifications();
    }

    renderTasks() {
        const filteredTasks = this.getFilteredTasks();
        const sortedTasks = this.getSortedTasks(filteredTasks);

        this.taskList.innerHTML = '';

        sortedTasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            this.taskList.appendChild(taskElement);
        });
    }

    createTaskElement(task) {
        const taskItem = document.createElement('div');
        let taskClasses = 'task-item';
        if (task.completed) taskClasses += ' completed';
        if (isOverdue) taskClasses += ' overdue';
        if (isDueSoon) taskClasses += ' due-soon';
        taskItem.className = taskClasses;

        const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date';
        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
        const isDueSoon = task.dueDate && this.isDueSoon(task.dueDate) && !task.completed && !isOverdue;

        taskItem.innerHTML = `
            <div class="task-cell">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            </div>
            <div class="task-cell task-title ${task.completed ? 'completed' : ''}" title="${task.description || 'No description'}">
                ${this.escapeHtml(task.title)}
            </div>
            <div class="task-cell">
                <span class="priority-badge priority-${task.priority}">${task.priority}</span>
            </div>
            <div class="task-cell">
                <span class="category-badge">${task.category}</span>
            </div>
            <div class="task-cell ${isOverdue ? 'overdue' : ''}">
                ${dueDate}
            </div>
            <div class="task-cell">
                <div class="task-actions">
                    <button class="btn-small btn-edit" onclick="taskManager.editTask(${task.id})">Edit</button>
                    <button class="btn-small btn-delete" onclick="taskManager.deleteTask(${task.id})">Delete</button>
                </div>
            </div>
        `;

        const checkbox = taskItem.querySelector('.task-checkbox');
        checkbox.addEventListener('change', () => this.toggleTask(task.id));

        return taskItem;
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        this.totalTasksEl.textContent = total;
        this.completedTasksEl.textContent = completed;
        this.pendingTasksEl.textContent = pending;
        this.completionRateEl.textContent = `${completionRate}%`;
    }

    updateEmptyState() {
        const filteredTasks = this.getFilteredTasks();
        if (filteredTasks.length === 0) {
            this.emptyState.style.display = 'block';
        } else {
            this.emptyState.style.display = 'none';
        }
    }

    getFilteredTasks() {
        return this.tasks.filter(task => {
            const statusMatch = this.currentFilter.status === 'all' ||
                               (this.currentFilter.status === 'completed' && task.completed) ||
                               (this.currentFilter.status === 'pending' && !task.completed);

            const categoryMatch = this.currentFilter.category === 'all' ||
                                 task.category === this.currentFilter.category;

            const searchMatch = this.searchQuery === '' ||
                               task.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                               task.description.toLowerCase().includes(this.searchQuery.toLowerCase());

            return statusMatch && categoryMatch && searchMatch;
        });
    }

    getSortedTasks(tasks) {
        return [...tasks].sort((a, b) => {
            switch (this.currentSort) {
                case 'priority':
                    const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                case 'dueDate':
                    if (!a.dueDate && !b.dueDate) return 0;
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'created':
                default:
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });
    }

    updateFilters() {
        this.currentFilter.status = this.filterStatus.value;
        this.currentFilter.category = this.filterCategory.value;
        this.updateDisplay();
    }

    updateSort() {
        this.currentSort = this.sortBy.value;
        this.updateDisplay();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveTasks() {
        localStorage.setItem('taskManagerTasks', JSON.stringify(this.tasks));
        localStorage.setItem('taskManagerCounter', this.taskIdCounter.toString());
    }

    loadTasks() {
        const savedTasks = localStorage.getItem('taskManagerTasks');
        const savedCounter = localStorage.getItem('taskManagerCounter');

        if (savedTasks) {
            this.tasks = JSON.parse(savedTasks);
        }

        if (savedCounter) {
            this.taskIdCounter = parseInt(savedCounter);
        }
    }

    handleSearch(e) {
        this.searchQuery = e.target.value.trim();
        this.updateDisplay();
        this.updateClearButton();
    }

    clearSearch() {
        this.taskSearch.value = '';
        this.searchQuery = '';
        this.updateDisplay();
        this.updateClearButton();
        this.taskSearch.focus();
    }

    updateClearButton() {
        if (this.searchQuery.length > 0) {
            this.clearSearchBtn.classList.add('visible');
        } else {
            this.clearSearchBtn.classList.remove('visible');
        }
    }

    updateSearchResults() {
        if (this.searchQuery.length > 0) {
            const filteredTasks = this.getFilteredTasks();
            const totalTasks = this.tasks.filter(task => {
                return task.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                       task.description.toLowerCase().includes(this.searchQuery.toLowerCase());
            }).length;

            this.searchResults.textContent = `Found ${filteredTasks.length} of ${totalTasks} matching tasks`;
        } else {
            this.searchResults.textContent = '';
        }
    }

    // Enhanced Notification System Methods
    updateNotifications() {
        const notifications = this.generateSmartNotifications();
        this.updateNotificationBadge(notifications);
        this.updateNotificationTabs(notifications);
        this.checkForNewNotifications(notifications);
    }

    generateSmartNotifications() {
        const notifications = [];
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        this.tasks.forEach(task => {
            if (task.completed || !task.dueDate) return;

            const dueDate = new Date(task.dueDate);
            const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
            const timeDiff = dueDateOnly.getTime() - today.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
            const reminderDays = this.notificationSettings.reminderTime;

            // Check if we should show notification based on settings
            if (!this.shouldShowNotification(now)) return;

            if (daysDiff < 0) {
                // Overdue
                const daysOverdue = Math.abs(daysDiff);
                notifications.push({
                    id: `overdue-${task.id}`,
                    taskId: task.id,
                    title: task.title,
                    message: `Overdue by ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''}`,
                    type: 'urgent',
                    priority: 1,
                    category: 'urgent',
                    daysOverdue: daysOverdue,
                    createdAt: now.toISOString()
                });
            } else if (daysDiff === 0) {
                // Due today
                notifications.push({
                    id: `today-${task.id}`,
                    taskId: task.id,
                    title: task.title,
                    message: 'Due today',
                    type: 'urgent',
                    priority: 2,
                    category: 'urgent',
                    createdAt: now.toISOString()
                });
            } else if (daysDiff === 1) {
                // Due tomorrow
                notifications.push({
                    id: `tomorrow-${task.id}`,
                    taskId: task.id,
                    title: task.title,
                    message: 'Due tomorrow',
                    type: 'warning',
                    priority: 3,
                    category: 'upcoming',
                    createdAt: now.toISOString()
                });
            } else if (daysDiff <= reminderDays) {
                // Due within reminder period
                notifications.push({
                    id: `upcoming-${task.id}`,
                    taskId: task.id,
                    title: task.title,
                    message: `Due in ${daysDiff} day${daysDiff !== 1 ? 's' : ''}`,
                    type: 'info',
                    priority: 4,
                    category: 'upcoming',
                    createdAt: now.toISOString()
                });
            }
        });

        // Add snoozed notifications that are ready
        const readySnoozed = this.snoozedNotifications.filter(n =>
            new Date(n.snoozeUntil) <= now
        );
        notifications.push(...readySnoozed);

        // Remove ready snoozed notifications from snoozed list
        this.snoozedNotifications = this.snoozedNotifications.filter(n =>
            new Date(n.snoozeUntil) > now
        );

        // Sort by priority (urgent first)
        return notifications.sort((a, b) => a.priority - b.priority);
    }

    shouldShowNotification(now) {
        const hour = now.getHours();
        const isWeekend = now.getDay() === 0 || now.getDay() === 6;
        const workStart = parseInt(this.notificationSettings.workStartTime.split(':')[0]);
        const workEnd = parseInt(this.notificationSettings.workEndTime.split(':')[0]);

        // Check weekend settings
        if (isWeekend && !this.notificationSettings.weekendNotifications) {
            return false;
        }

        // Check working hours
        if (hour < workStart || hour >= workEnd) {
            return false;
        }

        return true;
    }

    checkForNewNotifications(currentNotifications) {
        const newNotifications = currentNotifications.filter(notification => {
            return !this.notificationHistory.some(h => h.id === notification.id);
        });

        newNotifications.forEach(notification => {
            this.showToastNotification(notification);
            this.playNotificationSound();
            this.sendBrowserNotification(notification);

            // Add to history
            this.notificationHistory.push({
                ...notification,
                shownAt: new Date().toISOString()
            });
        });

        // Keep only last 50 notifications in history
        if (this.notificationHistory.length > 50) {
            this.notificationHistory = this.notificationHistory.slice(-50);
        }

        this.saveNotificationData();
    }

    updateNotificationBadge(notifications) {
        const urgentCount = notifications.filter(n => n.type === 'urgent').length;
        const totalCount = notifications.length + this.snoozedNotifications.length;

        if (totalCount > 0) {
            this.notificationCount.textContent = totalCount;
            this.notificationCount.classList.add('visible');

            if (urgentCount > 0) {
                this.notificationBadge.classList.add('has-urgent');
                this.notificationBadge.classList.remove('has-notifications');
            } else {
                this.notificationBadge.classList.add('has-notifications');
                this.notificationBadge.classList.remove('has-urgent');
            }
        } else {
            this.notificationCount.classList.remove('visible');
            this.notificationBadge.classList.remove('has-notifications', 'has-urgent');
        }
    }

    updateNotificationTabs(notifications) {
        const urgentNotifications = notifications.filter(n => n.category === 'urgent');
        const upcomingNotifications = notifications.filter(n => n.category === 'upcoming');

        this.updateNotificationList(this.urgentList, urgentNotifications);
        this.updateNotificationList(this.upcomingList, upcomingNotifications);
        this.updateProductivityInsights();
    }

    updateNotificationList(container, notifications) {
        if (notifications.length === 0) {
            container.innerHTML = '<p class="no-notifications">No notifications</p>';
            return;
        }

        container.innerHTML = notifications.map(notification => `
            <div class="notification-item ${notification.type}">
                <div class="notification-title">${this.escapeHtml(notification.title)}</div>
                <div class="notification-message">${notification.message}</div>
                <div class="notification-time">Created: ${new Date(notification.createdAt).toLocaleString()}</div>
                <div class="notification-actions">
                    <button class="notification-action-btn complete-action" onclick="taskManager.completeTaskFromNotification(${notification.taskId})">
                        ✓ Complete
                    </button>
                    <button class="notification-action-btn snooze-action" onclick="taskManager.snoozeNotification('${notification.id}')">
                        💤 Snooze
                    </button>
                    <button class="notification-action-btn edit-action" onclick="taskManager.editTask(${notification.taskId})">
                        ✏️ Edit
                    </button>
                </div>
            </div>
        `).join('');
    }
}

    updateProductivityInsights() {
        const insights = this.generateProductivityInsights();
        this.productivityInsightsList.innerHTML = insights;
    }

    generateProductivityInsights() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(t => t.completed).length;
        const overdueTasks = this.tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        const avgCompletionTime = this.calculateAverageCompletionTime();
        const productivityTrend = this.calculateProductivityTrend();
        const bestProductiveDay = this.getBestProductiveDay();

        return `
            <div class="insight-card">
                <div class="insight-title">📊 Your Productivity Overview</div>
                <div class="insight-text">
                    You're maintaining a ${completionRate}% completion rate.
                    ${completionRate >= 80 ? 'Excellent work!' : completionRate >= 60 ? 'Good progress, keep it up!' : 'There\'s room for improvement.'}
                </div>
                <div class="insight-stats">
                    <div class="insight-stat">
                        <span class="insight-stat-number">${completionRate}%</span>
                        <span class="insight-stat-label">Completion Rate</span>
                    </div>
                    <div class="insight-stat">
                        <span class="insight-stat-number">${overdueTasks}</span>
                        <span class="insight-stat-label">Overdue Tasks</span>
                    </div>
                    <div class="insight-stat">
                        <span class="insight-stat-number">${avgCompletionTime}</span>
                        <span class="insight-stat-label">Avg. Days to Complete</span>
                    </div>
                </div>
            </div>
            <div class="insight-card">
                <div class="insight-title">📈 Productivity Trends</div>
                <div class="insight-text">
                    ${productivityTrend}
                    Your most productive day appears to be ${bestProductiveDay}.
                </div>
            </div>
        `;
    }

    calculateAverageCompletionTime() {
        const completedWithDates = this.tasks.filter(t =>
            t.completed && t.completedAt && t.createdAt
        );

        if (completedWithDates.length === 0) return 'N/A';

        const totalDays = completedWithDates.reduce((sum, task) => {
            const created = new Date(task.createdAt);
            const completed = new Date(task.completedAt);
            const days = Math.ceil((completed - created) / (1000 * 60 * 60 * 24));
            return sum + days;
        }, 0);

        return Math.round(totalDays / completedWithDates.length);
    }

    calculateProductivityTrend() {
        const recentTasks = this.tasks.filter(t => {
            const taskDate = new Date(t.createdAt);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return taskDate >= weekAgo;
        });

        const recentCompleted = recentTasks.filter(t => t.completed).length;
        const recentTotal = recentTasks.length;
        const recentRate = recentTotal > 0 ? (recentCompleted / recentTotal) * 100 : 0;

        if (recentRate >= 80) return "You're on fire this week! 🔥";
        if (recentRate >= 60) return "Solid progress this week! 👍";
        if (recentRate >= 40) return "Steady pace, but there's room to improve. 📈";
        return "This week has been challenging. Consider breaking tasks into smaller pieces. 💪";
    }

    getBestProductiveDay() {
        const dayStats = {};
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        this.tasks.filter(t => t.completed && t.completedAt).forEach(task => {
            const day = new Date(task.completedAt).getDay();
            dayStats[day] = (dayStats[day] || 0) + 1;
        });

        const bestDay = Object.keys(dayStats).reduce((a, b) =>
            dayStats[a] > dayStats[b] ? a : b, 0
        );

        return days[bestDay] || 'Not enough data';
    }

    // Toast Notification Methods
    showToastNotification(notification) {
        const toast = this.notificationToast;
        const title = toast.querySelector('.toast-title');
        const text = toast.querySelector('.toast-text');

        title.textContent = notification.title;
        text.textContent = notification.message;

        toast.className = `notification-toast ${notification.type}`;
        toast.classList.add('show');

        // Auto-hide after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 5000);

        // Bind action buttons
        const completeBtn = toast.querySelector('.complete-btn');
        const snoozeBtn = toast.querySelector('.snooze-btn');
        const closeBtn = toast.querySelector('.close-toast');

        completeBtn.onclick = () => {
            this.completeTaskFromNotification(notification.taskId);
            toast.classList.remove('show');
        };

        snoozeBtn.onclick = () => {
            this.snoozeNotification(notification.id);
            toast.classList.remove('show');
        };

        closeBtn.onclick = () => {
            toast.classList.remove('show');
        };
    }

    playNotificationSound() {
        if (!this.notificationSettings.enableSounds) return;

        // Create a simple notification sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (error) {
            console.log('Audio notification not supported');
        }
    }

    sendBrowserNotification(notification) {
        if (!this.notificationSettings.enableBrowserNotifications) return;
        if (Notification.permission !== 'granted') return;

        const browserNotification = new Notification(notification.title, {
            body: notification.message,
            icon: '🔔',
            tag: notification.id
        });

        browserNotification.onclick = () => {
            window.focus();
            this.toggleNotificationPanel();
            browserNotification.close();
        };

        setTimeout(() => {
            browserNotification.close();
        }, 5000);
    }

    // Action Methods
    completeTaskFromNotification(taskId) {
        this.toggleTask(taskId);
        this.closeNotificationPanel();
    }

    snoozeNotification(notificationId) {
        const notification = this.notificationHistory.find(n => n.id === notificationId);
        if (!notification) return;

        // Snooze for 1 hour
        const snoozeUntil = new Date();
        snoozeUntil.setHours(snoozeUntil.getHours() + 1);

        this.snoozedNotifications.push({
            ...notification,
            snoozeUntil: snoozeUntil.toISOString()
        });

        this.saveNotificationData();
        this.updateDisplay();
    }

    // Settings Methods
    openSettingsModal() {
        this.settingsModal.classList.add('visible');
        this.loadSettingsForm();
    }

    closeSettingsModal() {
        this.settingsModal.classList.remove('visible');
    }

    loadSettingsForm() {
        document.getElementById('enableSounds').checked = this.notificationSettings.enableSounds;
        document.getElementById('enableBrowserNotifications').checked = this.notificationSettings.enableBrowserNotifications;
        document.getElementById('reminderTime').value = this.notificationSettings.reminderTime;
        document.getElementById('workStartTime').value = this.notificationSettings.workStartTime;
        document.getElementById('workEndTime').value = this.notificationSettings.workEndTime;
        document.getElementById('weekendNotifications').checked = this.notificationSettings.weekendNotifications;
    }

    saveNotificationSettings() {
        this.notificationSettings = {
            enableSounds: document.getElementById('enableSounds').checked,
            enableBrowserNotifications: document.getElementById('enableBrowserNotifications').checked,
            reminderTime: parseInt(document.getElementById('reminderTime').value),
            workStartTime: document.getElementById('workStartTime').value,
            workEndTime: document.getElementById('workEndTime').value,
            weekendNotifications: document.getElementById('weekendNotifications').checked
        };

        localStorage.setItem('taskManagerNotificationSettings', JSON.stringify(this.notificationSettings));
        this.closeSettingsModal();
        this.updateDisplay();
    }

    resetNotificationSettings() {
        this.notificationSettings = {
            enableSounds: true,
            enableBrowserNotifications: true,
            reminderTime: 1,
            workStartTime: '09:00',
            workEndTime: '17:00',
            weekendNotifications: false
        };
        this.loadSettingsForm();
    }

    loadNotificationSettings() {
        const saved = localStorage.getItem('taskManagerNotificationSettings');
        if (saved) {
            this.notificationSettings = { ...this.notificationSettings, ...JSON.parse(saved) };
        }

        const savedHistory = localStorage.getItem('taskManagerNotificationHistory');
        if (savedHistory) {
            this.notificationHistory = JSON.parse(savedHistory);
        }

        const savedSnoozed = localStorage.getItem('taskManagerSnoozedNotifications');
        if (savedSnoozed) {
            this.snoozedNotifications = JSON.parse(savedSnoozed);
        }
    }

    saveNotificationData() {
        localStorage.setItem('taskManagerNotificationHistory', JSON.stringify(this.notificationHistory));
        localStorage.setItem('taskManagerSnoozedNotifications', JSON.stringify(this.snoozedNotifications));
    }

    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    startNotificationScheduler() {
        // Check for notifications every minute
        setInterval(() => {
            this.updateNotifications();
        }, 60000);
    }

    // Tab Management
    switchTab(tabName) {
        this.activeTab = tabName;

        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        const activeContent = document.getElementById(`${tabName}Tab`);
        if (activeContent) {
            activeContent.classList.add('active');
        }
    }

    toggleNotificationPanel() {
        this.notificationPanel.classList.toggle('visible');
    }

    closeNotificationPanel() {
        this.notificationPanel.classList.remove('visible');
    }

    isDueSoon(dueDate) {
        const now = new Date();
        const due = new Date(dueDate);
        const timeDiff = due.getTime() - now.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return daysDiff >= 0 && daysDiff <= this.notificationSettings.reminderTime;
    }
}

// Initialize the task manager when the page loads
let taskManager;
document.addEventListener('DOMContentLoaded', () => {
    taskManager = new TaskManager();
});
