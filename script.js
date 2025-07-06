// Boring Task Manager - Simple JavaScript Functionality

class BoringTaskManager {
    constructor() {
        this.tasks = [];
        this.abandonedTasks = [];
        this.taskIdCounter = 1;
        this.activityLog = [];
        this.currentFilter = { status: 'all', category: 'all' };
        this.currentSort = 'created';
        this.sadQuotes = [
            "Another day, another list of things you probably won't finish...",
            "Your tasks are waiting, but they've learned not to expect much.",
            "Remember when you thought you'd be productive today? That was optimistic.",
            "These tasks have been here longer than some relationships you've had.",
            "Your to-do list is like your dreams - constantly growing, rarely achieved.",
            "Every uncompleted task is a small monument to your procrastination.",
            "Your future self is disappointed in your current self's task management.",
            "This list is a graveyard of good intentions and broken promises."
        ];
        this.demotivationalMessages = [
            "You've been staring at this task list for a while now. Maybe it's time to accept that you're just not going to do these things.",
            "Every task you complete just makes room for three more. It's an endless cycle of mediocrity.",
            "Your productivity peaked in elementary school when gold stars actually mattered.",
            "These tasks will outlive you. They'll be here long after you've given up.",
            "You could finish all these tasks, but then what? More tasks. It never ends.",
            "Your task completion rate is lower than your self-esteem, and that's saying something.",
            "Remember when you thought being an adult meant having your life together? How naive.",
            "Your tasks are like your problems - they multiply when you're not looking."
        ];
        this.existentialThoughts = [
            "Is this really how you want to spend your finite existence? Managing tasks that ultimately don't matter?",
            "In the grand scheme of the universe, your to-do list is less significant than a grain of sand.",
            "You're just rearranging deck chairs on the Titanic of your own productivity.",
            "Every completed task brings you one step closer to the inevitable heat death of the universe.",
            "Your ancestors survived wars and famines so you could stress about email responses.",
            "Somewhere in a parallel universe, there's a version of you that actually finishes things.",
            "Your task list is a reflection of your inability to accept the chaos of existence.",
            "You're not managing tasks, you're managing the illusion of control over your life."
        ];
        this.initializeElements();
        this.attachEventListeners();
        this.initializeTimestamp();
        this.startSadnessTimer();
        this.startTimeWasting();
        this.startOpportunityCounter();
        this.logActivity('System initialized - Another day of potential disappointment begins');
        this.updateDisplay();
    }

    initializeElements() {
        // Form elements
        this.taskInput = document.getElementById('taskInput');
        this.prioritySelect = document.getElementById('prioritySelect');
        this.categorySelect = document.getElementById('categorySelect');
        this.estimatedTime = document.getElementById('estimatedTime');
        this.dueDate = document.getElementById('dueDate');
        this.taskNotes = document.getElementById('taskNotes');
        this.addTaskBtn = document.getElementById('addTaskBtn');

        // Display elements
        this.taskList = document.getElementById('taskList');
        this.emptyState = document.getElementById('emptyState');

        // Statistics elements
        this.totalTasks = document.getElementById('totalTasks');
        this.completedTasks = document.getElementById('completedTasks');
        this.pendingTasks = document.getElementById('pendingTasks');
        this.completionRate = document.getElementById('completionRate');
        this.averageTime = document.getElementById('averageTime');
        this.totalEstimatedTime = document.getElementById('totalEstimatedTime');

        // Sad statistics elements
        this.overdueTasks = document.getElementById('overdueTasks');
        this.daysSinceCompletion = document.getElementById('daysSinceCompletion');
        this.procrastinationScore = document.getElementById('procrastinationScore');
        this.lifeSatisfaction = document.getElementById('lifeSatisfaction');
        this.sadInsights = document.getElementById('sadInsights');

        // Control elements
        this.filterStatus = document.getElementById('filterStatus');
        this.filterCategory = document.getElementById('filterCategory');
        this.sortBy = document.getElementById('sortBy');

        // Log elements
        this.activityLogElement = document.getElementById('activityLog');
        this.clearLogBtn = document.getElementById('clearLogBtn');
        this.exportLogBtn = document.getElementById('exportLogBtn');
        this.sadStatsBtn = document.getElementById('sadStatsBtn');

        // Sad elements
        this.sadQuoteElement = document.getElementById('sadQuote');
        this.currentMoodSelect = document.getElementById('currentMood');
        this.abandonedTasksElement = document.getElementById('abandonedTasks');
        this.viewAbandonedBtn = document.getElementById('viewAbandonedBtn');
        this.demotivationalMessageElement = document.getElementById('demotivationalMessage');
        this.newDemotivationBtn = document.getElementById('newDemotivationBtn');
        this.existentialThoughtElement = document.getElementById('existentialThought');

        // New satirical elements
        this.timeWastedElement = document.getElementById('timeWasted');
        this.productivityLevelElement = document.getElementById('productivityLevel');
        this.dreamsCrushedElement = document.getElementById('dreamsCrushed');
        this.regretLevelElement = document.getElementById('regretLevel');
        this.fakeComparisonsElement = document.getElementById('fakeComparisons');
        this.newComparisonBtn = document.getElementById('newComparisonBtn');
        this.opportunityListElement = document.getElementById('opportunityList');
        this.opportunitiesMissedElement = document.getElementById('opportunitiesMissed');
        this.daysLeftElement = document.getElementById('daysLeft');
        this.appTimeElement = document.getElementById('appTime');
        this.slothComparisonElement = document.getElementById('slothComparison');
        this.socialPressureElement = document.getElementById('socialPressure');
    }

    attachEventListeners() {
        // Form listeners
        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                this.addTask();
            }
        });
        this.taskInput.addEventListener('input', () => this.updateAddButton());

        // Control listeners
        this.filterStatus.addEventListener('change', () => this.updateFilters());
        this.filterCategory.addEventListener('change', () => this.updateFilters());
        this.sortBy.addEventListener('change', () => this.updateSort());

        // Log listeners
        this.clearLogBtn.addEventListener('click', () => this.clearActivityLog());
        this.exportLogBtn.addEventListener('click', () => this.exportActivityLog());
        this.sadStatsBtn.addEventListener('click', () => this.generateFailureReport());

        // Sad listeners
        this.currentMoodSelect.addEventListener('change', () => this.updateMood());
        this.viewAbandonedBtn.addEventListener('click', () => this.showAbandonedTasks());
        this.newDemotivationBtn.addEventListener('click', () => this.showNewDemotivation());
        this.newComparisonBtn.addEventListener('click', () => this.showNewComparison());

        // Form validation listeners
        this.estimatedTime.addEventListener('input', () => this.validateTimeInput());
        this.dueDate.addEventListener('change', () => this.validateDueDate());
    }

    addTask() {
        const taskText = this.taskInput.value.trim();

        // Extensive validation (very boring)
        if (taskText === '') {
            alert('Error: Task description is required. Please enter a task description.');
            this.logActivity('Failed task creation attempt - empty description');
            return;
        }

        if (taskText.length > 100) {
            alert('Error: Task description exceeds maximum length of 100 characters. Current length: ' + taskText.length);
            this.logActivity('Failed task creation attempt - description too long');
            return;
        }

        if (this.estimatedTime.value < 1 || this.estimatedTime.value > 480) {
            alert('Error: Estimated time must be between 1 and 480 minutes.');
            this.logActivity('Failed task creation attempt - invalid time estimate');
            return;
        }

        // Create comprehensive task object
        const task = {
            id: this.taskIdCounter++,
            text: taskText,
            priority: this.prioritySelect.value,
            category: this.categorySelect.value,
            estimatedTime: parseInt(this.estimatedTime.value),
            dueDate: this.dueDate.value || null,
            notes: this.taskNotes.value.trim(),
            completed: false,
            createdAt: new Date(),
            completedAt: null
        };

        this.tasks.push(task);
        this.logActivity(`Task created: "${taskText}" (Priority: ${task.priority}, Category: ${task.category})`);

        // Reset form to default values
        this.resetForm();
        this.updateDisplay();
        this.updateAddButton();
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            const wasCompleted = task.completed;
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date() : null;

            const action = task.completed ? 'completed' : 'marked as pending';
            this.logActivity(`Task ${action}: "${task.text}"`);
            this.updateDisplay();
        }
    }

    deleteTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            const options = [
                'Delete permanently (you\'ll probably regret this)',
                'Abandon task (add to hall of shame)',
                'Cancel (continue living with this burden)'
            ];

            const choice = prompt(`What would you like to do with "${task.text}"?\n\n1. ${options[0]}\n2. ${options[1]}\n3. ${options[2]}\n\nEnter 1, 2, or 3:`);

            if (choice === '1') {
                this.tasks = this.tasks.filter(t => t.id !== taskId);
                this.logActivity(`Task permanently deleted: "${task.text}" - Another dream dies`);
                this.updateDisplay();
            } else if (choice === '2') {
                this.abandonTask(task);
            }
        }
    }

    abandonTask(task) {
        const abandonedTask = {
            ...task,
            abandonedAt: new Date(),
            reason: 'Gave up due to lack of motivation'
        };

        this.abandonedTasks.push(abandonedTask);
        this.tasks = this.tasks.filter(t => t.id !== task.id);
        this.logActivity(`Task abandoned: "${task.text}" - Added to the hall of broken promises`);
        this.updateDisplay();
    }

    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            // Fill form with existing task data for editing
            this.taskInput.value = task.text;
            this.prioritySelect.value = task.priority;
            this.categorySelect.value = task.category;
            this.estimatedTime.value = task.estimatedTime;
            this.dueDate.value = task.dueDate || '';
            this.taskNotes.value = task.notes;

            // Remove the task and let user re-add it
            this.deleteTask(taskId);
            this.logActivity(`Task editing initiated: "${task.text}"`);

            // Scroll to form
            document.querySelector('.boring-form-section').scrollIntoView({ behavior: 'smooth' });
        }
    }

    updateDisplay() {
        this.renderTasks();
        this.updateStats();
        this.updateEmptyState();
        this.updateActivityLog();
    }

    renderTasks() {
        this.taskList.innerHTML = '';

        // Apply filters and sorting
        let filteredTasks = this.getFilteredTasks();
        let sortedTasks = this.getSortedTasks(filteredTasks);

        sortedTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;

            const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set';
            const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

            taskItem.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text" title="${this.escapeHtml(task.notes || 'No additional notes')}">${this.escapeHtml(task.text)}</span>
                <span class="task-priority priority-${task.priority}">${this.formatPriority(task.priority)}</span>
                <span class="task-category">${this.formatCategory(task.category)}</span>
                <span class="task-time">${task.estimatedTime}m</span>
                <span class="task-due-date ${isOverdue ? 'overdue' : ''}">${dueDate}</span>
                <div class="task-actions">
                    <button class="edit-btn" title="Edit task">Edit</button>
                    <button class="delete-btn" title="Delete task">Del</button>
                </div>
            `;

            const checkbox = taskItem.querySelector('.task-checkbox');
            const editBtn = taskItem.querySelector('.edit-btn');
            const deleteBtn = taskItem.querySelector('.delete-btn');

            checkbox.addEventListener('change', () => this.toggleTask(task.id));
            editBtn.addEventListener('click', () => this.editTask(task.id));
            deleteBtn.addEventListener('click', () => this.deleteTask(task.id));

            this.taskList.appendChild(taskItem);
        });
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        // Calculate time statistics
        const totalTime = this.tasks.reduce((sum, task) => sum + task.estimatedTime, 0);
        const averageTime = total > 0 ? Math.round(totalTime / total) : 0;

        // Calculate sad statistics
        const overdue = this.tasks.filter(t =>
            t.dueDate && new Date(t.dueDate) < new Date() && !t.completed
        ).length;

        const lastCompletion = this.getLastCompletionDate();
        const daysSince = lastCompletion ?
            Math.floor((new Date() - lastCompletion) / (1000 * 60 * 60 * 24)) : '∞';

        const procrastination = this.calculateProcrastinationScore();
        const satisfaction = this.calculateLifeSatisfaction(completionRate, overdue, pending);

        // Update basic stats
        this.totalTasks.textContent = total;
        this.completedTasks.textContent = completed;
        this.pendingTasks.textContent = pending;
        this.completionRate.textContent = `${completionRate}%`;
        this.averageTime.textContent = `${averageTime} min`;
        this.totalEstimatedTime.textContent = `${totalTime} min`;

        // Update sad stats
        this.overdueTasks.textContent = overdue;
        this.daysSinceCompletion.textContent = daysSince;
        this.procrastinationScore.textContent = `${procrastination}%`;
        this.lifeSatisfaction.textContent = satisfaction;

        // Update new satirical stats
        this.updateSatiricalStats(total, completed, overdue);

        // Update depressing insights
        this.updateSadInsights(total, completed, overdue, procrastination);
    }

    updateEmptyState() {
        const filteredTasks = this.getFilteredTasks();
        if (filteredTasks.length === 0) {
            this.emptyState.style.display = 'block';
            this.taskList.style.display = 'none';
        } else {
            this.emptyState.style.display = 'none';
            this.taskList.style.display = 'block';
        }
    }

    updateAddButton() {
        const hasText = this.taskInput.value.trim().length > 0;
        this.addTaskBtn.disabled = !hasText;
    }

    // Boring filtering and sorting methods
    getFilteredTasks() {
        return this.tasks.filter(task => {
            const statusMatch = this.currentFilter.status === 'all' ||
                               (this.currentFilter.status === 'completed' && task.completed) ||
                               (this.currentFilter.status === 'pending' && !task.completed);

            const categoryMatch = this.currentFilter.category === 'all' ||
                                 task.category === this.currentFilter.category;

            return statusMatch && categoryMatch;
        });
    }

    getSortedTasks(tasks) {
        return [...tasks].sort((a, b) => {
            switch (this.currentSort) {
                case 'priority':
                    const priorityOrder = { 'very-high': 5, 'high': 4, 'medium': 3, 'low': 2, 'very-low': 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                case 'category':
                    return a.category.localeCompare(b.category);
                case 'due-date':
                    if (!a.dueDate && !b.dueDate) return 0;
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
                case 'estimated-time':
                    return a.estimatedTime - b.estimatedTime;
                case 'created':
                default:
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });
    }

    updateFilters() {
        this.currentFilter.status = this.filterStatus.value;
        this.currentFilter.category = this.filterCategory.value;
        this.logActivity(`Filters applied - Status: ${this.currentFilter.status}, Category: ${this.currentFilter.category}`);
        this.updateDisplay();
    }

    updateSort() {
        this.currentSort = this.sortBy.value;
        this.logActivity(`Tasks sorted by: ${this.currentSort}`);
        this.updateDisplay();
    }
    // Boring utility methods
    formatPriority(priority) {
        const priorityMap = {
            'very-high': 'V.High',
            'high': 'High',
            'medium': 'Med',
            'low': 'Low',
            'very-low': 'V.Low'
        };
        return priorityMap[priority] || priority;
    }

    formatCategory(category) {
        return category.charAt(0).toUpperCase() + category.slice(1);
    }

    resetForm() {
        this.taskInput.value = '';
        this.prioritySelect.value = 'medium';
        this.categorySelect.value = 'miscellaneous';
        this.estimatedTime.value = '30';
        this.dueDate.value = '';
        this.taskNotes.value = '';
    }

    validateTimeInput() {
        const value = parseInt(this.estimatedTime.value);
        if (value < 1) this.estimatedTime.value = 1;
        if (value > 480) this.estimatedTime.value = 480;
    }

    validateDueDate() {
        const selectedDate = new Date(this.dueDate.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            if (confirm('The selected due date is in the past. Do you want to keep it?')) {
                this.logActivity('Past due date accepted by user');
            } else {
                this.dueDate.value = '';
            }
        }
    }

    // Extremely boring activity log methods
    logActivity(message) {
        const timestamp = new Date().toLocaleString();
        const logEntry = {
            timestamp: timestamp,
            message: message,
            id: Date.now()
        };
        this.activityLog.push(logEntry);

        // Keep only last 50 entries to prevent memory issues
        if (this.activityLog.length > 50) {
            this.activityLog = this.activityLog.slice(-50);
        }
    }

    updateActivityLog() {
        const logHtml = this.activityLog.map(entry =>
            `<p class="log-entry">[<span class="timestamp">${entry.timestamp}</span>] ${this.escapeHtml(entry.message)}</p>`
        ).join('');

        this.activityLogElement.innerHTML = logHtml || '<p class="log-entry">No activity recorded yet.</p>';

        // Auto-scroll to bottom
        this.activityLogElement.scrollTop = this.activityLogElement.scrollHeight;
    }

    clearActivityLog() {
        if (confirm('Are you sure you want to clear the entire activity log? This action cannot be undone.')) {
            this.activityLog = [];
            this.logActivity('Activity log cleared by user');
            this.updateActivityLog();
        }
    }

    exportActivityLog() {
        const logText = this.activityLog.map(entry =>
            `[${entry.timestamp}] ${entry.message}`
        ).join('\n');

        const blob = new Blob([logText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `boring-task-manager-log-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.logActivity('Activity log exported to file');
    }

    initializeTimestamp() {
        const timestampElement = document.querySelector('.timestamp');
        if (timestampElement) {
            timestampElement.textContent = new Date().toLocaleString();
        }
    }

    // Sad calculation methods
    getLastCompletionDate() {
        const completedTasks = this.tasks.filter(t => t.completed && t.completedAt);
        if (completedTasks.length === 0) return null;

        return completedTasks.reduce((latest, task) => {
            const taskDate = new Date(task.completedAt);
            return taskDate > latest ? taskDate : latest;
        }, new Date(0));
    }

    calculateProcrastinationScore() {
        const totalTasks = this.tasks.length;
        if (totalTasks === 0) return 0;

        const overdueTasks = this.tasks.filter(t =>
            t.dueDate && new Date(t.dueDate) < new Date() && !t.completed
        ).length;

        const oldTasks = this.tasks.filter(t => {
            const daysSinceCreated = (new Date() - new Date(t.createdAt)) / (1000 * 60 * 60 * 24);
            return daysSinceCreated > 7 && !t.completed;
        }).length;

        return Math.min(100, Math.round(((overdueTasks + oldTasks) / totalTasks) * 100));
    }

    calculateLifeSatisfaction(completionRate, overdue, pending) {
        if (completionRate > 80) return '📈 Surprisingly Decent';
        if (completionRate > 60) return '📊 Mediocre';
        if (completionRate > 40) return '📉 Declining';
        if (completionRate > 20) return '💔 Disappointing';
        if (overdue > 0) return '🔥 Dumpster Fire';
        if (pending > 10) return '😱 Overwhelming';
        return '💀 Rock Bottom';
    }

    updateSadInsights(total, completed, overdue, procrastination) {
        const insights = [];

        if (total === 0) {
            insights.push("You haven't even started disappointing yourself yet. That's... something.");
        } else {
            if (completed === 0) {
                insights.push("You've completed exactly zero tasks. Your productivity is as empty as your soul.");
            }

            if (overdue > 0) {
                insights.push(`You have ${overdue} overdue task${overdue > 1 ? 's' : ''}. Time is a flat circle of disappointment.`);
            }

            if (procrastination > 70) {
                insights.push("Your procrastination score is higher than most people's test scores. Congratulations?");
            }

            if (total > completed * 3) {
                insights.push("You create tasks faster than you complete them. You're basically a task hoarder.");
            }

            if (this.abandonedTasks.length > 0) {
                insights.push(`You've abandoned ${this.abandonedTasks.length} task${this.abandonedTasks.length > 1 ? 's' : ''}. They trusted you, and you let them down.`);
            }
        }

        if (insights.length === 0) {
            insights.push("No specific insights available. Your mediocrity is too profound to analyze.");
        }

        this.sadInsights.innerHTML = insights.map(insight => `<p>${insight}</p>`).join('');
    }

    // Sad interaction methods
    updateMood() {
        const mood = this.currentMoodSelect.value;
        const moodMessages = {
            'terrible': 'Your honesty is refreshing, if depressing.',
            'awful': 'At least you\'re consistent in your misery.',
            'bad': 'Bad is the new normal, apparently.',
            'meh': 'Meh is a lifestyle choice at this point.',
            'slightly-less-bad': 'Setting the bar low and still struggling to reach it.'
        };

        this.logActivity(`Mood updated to: ${mood} - ${moodMessages[mood]}`);
    }

    showAbandonedTasks() {
        if (this.abandonedTasks.length === 0) {
            this.abandonedTasksElement.innerHTML = '<p>No abandoned tasks yet. Give it time, you\'ll disappoint yourself soon enough.</p>';
        } else {
            const html = this.abandonedTasks.map(task => `
                <div class="abandoned-task-item">
                    <div class="task-text">${this.escapeHtml(task.text)}</div>
                    <div class="abandoned-date">Abandoned on ${new Date(task.abandonedAt).toLocaleDateString()}</div>
                </div>
            `).join('');
            this.abandonedTasksElement.innerHTML = html;
        }
    }

    showNewDemotivation() {
        const randomMessage = this.demotivationalMessages[Math.floor(Math.random() * this.demotivationalMessages.length)];
        this.demotivationalMessageElement.innerHTML = `<p>"${randomMessage}"</p>`;
        this.logActivity('New demotivational message requested - User seeking validation for their failures');
    }

    generateFailureReport() {
        const report = this.createFailureReport();
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `personal-failure-report-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.logActivity('Personal failure report generated and downloaded - Masochism at its finest');
    }

    createFailureReport() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const overdue = this.tasks.filter(t =>
            t.dueDate && new Date(t.dueDate) < new Date() && !t.completed
        ).length;

        return `
PERSONAL FAILURE REPORT
Generated on: ${new Date().toLocaleString()}
===========================================

SUMMARY OF DISAPPOINTMENT:
- Total tasks created: ${total}
- Tasks actually completed: ${completed}
- Tasks you've given up on: ${this.abandonedTasks.length}
- Overdue tasks haunting you: ${overdue}
- Current mood: ${this.currentMoodSelect.value}

ANALYSIS:
Your completion rate of ${total > 0 ? Math.round((completed / total) * 100) : 0}% suggests that you are ${total > 0 && completed / total < 0.5 ? 'significantly underperforming' : 'meeting rock-bottom expectations'}.

ABANDONED TASKS (Hall of Shame):
${this.abandonedTasks.map(task => `- "${task.text}" (abandoned ${new Date(task.abandonedAt).toLocaleDateString()})`).join('\n') || 'None yet, but give it time.'}

RECOMMENDATIONS:
1. Lower your expectations further
2. Accept that this is who you are now
3. Consider taking up a hobby that requires less follow-through, like watching paint dry

Remember: Every day is a new opportunity to disappoint yourself in creative ways.

Generated by Melancholy Task Manager - Crushing dreams since today.
        `.trim();
    }

    startSadnessTimer() {
        // Rotate sad quotes every 30 seconds
        setInterval(() => {
            const randomQuote = this.sadQuotes[Math.floor(Math.random() * this.sadQuotes.length)];
            this.sadQuoteElement.textContent = randomQuote;
        }, 30000);

        // Rotate existential thoughts every 2 minutes
        setInterval(() => {
            const randomThought = this.existentialThoughts[Math.floor(Math.random() * this.existentialThoughts.length)];
            this.existentialThoughtElement.textContent = randomThought;
        }, 120000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the melancholy task manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new BoringTaskManager();

    // Add some depressing console messages
    console.log('😔 Melancholy Task Manager initialized successfully.');
    console.log('This is a depressingly ordinary application designed to highlight your failures.');
    console.log('No fancy features here, just plain old disappointment management.');
    console.log('Remember: Every task you don\'t complete is a small death of your ambition.');
    console.log('Welcome to the digital embodiment of your procrastination.');
});
