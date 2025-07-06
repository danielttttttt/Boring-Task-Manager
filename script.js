// Task Manager Application
class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
        this.updateStats();
    }

    bindEvents() {
        // Form submission
        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });
    }

    addTask() {
        const taskInput = document.getElementById('taskInput');
        const prioritySelect = document.getElementById('prioritySelect');
        const dueDateInput = document.getElementById('dueDateInput');

        const taskText = taskInput.value.trim();
        if (!taskText) {
            this.showNotification('Please enter a task description', 'warning');
            taskInput.focus();
            return;
        }

        const task = {
            id: Date.now(),
            text: taskText,
            priority: prioritySelect.value,
            dueDate: dueDateInput.value,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.render();
        this.updateStats();

        // Reset form with animation
        taskInput.value = '';
        dueDateInput.value = '';
        prioritySelect.value = 'medium';

        // Show success notification
        this.showNotification('Task added successfully!', 'success');

        // Focus back to input for quick task entry
        setTimeout(() => taskInput.focus(), 100);
    }

    showNotification(message, type = 'info') {
        // Remove existing notification
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add to DOM
        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.add('fade-out');
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.render();
            this.updateStats();
        }
    }

    deleteTask(id) {
        const taskElement = document.querySelector(`[data-task-id="${id}"]`).closest('.task-item');

        // Add fade out animation
        taskElement.style.transition = 'all 0.3s ease-out';
        taskElement.style.transform = 'translateX(-100%)';
        taskElement.style.opacity = '0';

        setTimeout(() => {
            this.tasks = this.tasks.filter(t => t.id !== id);
            this.saveTasks();
            this.render();
            this.updateStats();
            this.showNotification('Task deleted', 'info');
        }, 300);
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.render();
    }

    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'completed':
                return this.tasks.filter(task => task.completed);
            case 'pending':
                return this.tasks.filter(task => !task.completed);
            case 'high':
                return this.tasks.filter(task => task.priority === 'high');
            default:
                return this.tasks;
        }
    }

    render() {
        const container = document.getElementById('taskContainer');
        const emptyMessage = document.getElementById('emptyMessage');
        const filteredTasks = this.getFilteredTasks();

        if (filteredTasks.length === 0) {
            container.innerHTML = '';
            emptyMessage.style.display = 'block';
            return;
        }

        emptyMessage.style.display = 'none';
        container.innerHTML = filteredTasks.map(task => this.createTaskHTML(task)).join('');

        // Bind task events
        container.querySelectorAll('.task-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const taskId = parseInt(e.target.dataset.taskId);
                this.toggleTask(taskId);
            });
        });

        container.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = parseInt(e.target.dataset.taskId);
                this.deleteTask(taskId);
            });
        });
    }

    createTaskHTML(task) {
        const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '';
        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

        // Get priority icon
        const priorityIcons = {
            high: '🔴',
            medium: '🟡',
            low: '🟢'
        };

        return `
            <div class="task-item ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''} slide-in">
                <input type="checkbox" class="task-checkbox"
                       data-task-id="${task.id}" ${task.completed ? 'checked' : ''}>
                <div class="task-content">
                    <div class="task-title ${task.completed ? 'completed' : ''}">${this.escapeHtml(task.text)}</div>
                    <div class="task-meta">
                        <span class="priority-badge priority-${task.priority}">
                            ${priorityIcons[task.priority]} ${task.priority.toUpperCase()}
                        </span>
                        ${dueDate ? `<span class="due-date"><i class="fas fa-calendar-alt"></i> ${dueDate}</span>` : ''}
                        ${isOverdue ? '<span class="overdue-label"><i class="fas fa-exclamation-triangle"></i> Overdue!</span>' : ''}
                    </div>
                </div>
                <div class="task-actions">
                    <button class="delete-btn" data-task-id="${task.id}" title="Delete task">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        `;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const pending = total - completed;

        document.getElementById('totalTasks').textContent = total;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('pendingTasks').textContent = pending;
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new TaskManager();
});
