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
        
        this.initializeElements();
        this.bindEvents();
        this.loadTasks();
        this.updateDisplay();
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
    }

    bindEvents() {
        this.taskForm.addEventListener('submit', (e) => this.handleAddTask(e));
        this.filterStatus.addEventListener('change', () => this.updateFilters());
        this.filterCategory.addEventListener('change', () => this.updateFilters());
        this.sortBy.addEventListener('change', () => this.updateSort());

        // Search events
        this.taskSearch.addEventListener('input', (e) => this.handleSearch(e));
        this.clearSearchBtn.addEventListener('click', () => this.clearSearch());
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
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;

        const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date';
        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

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
}

// Initialize the task manager when the page loads
let taskManager;
document.addEventListener('DOMContentLoaded', () => {
    taskManager = new TaskManager();
});
