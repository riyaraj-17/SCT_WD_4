/* =========================================================
   WORKFLOW PRO — Complete JavaScript
========================================================= */

class WorkFlowPro {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.tasks = [];
        this.streakData = { current: 0, best: 0, history: {} };
        this.achievements = [];
        this.currentList = 'all';
        this.currentFilter = 'all';
        this.currentSort = 'dueDate';
        this.editingTaskId = null;
        this.isDarkMode = false;

        this.initDOM();
        this.checkAuth();
        this.initEventListeners();

        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    // =========================================================
    // DOM INIT
    // =========================================================
    initDOM() {
        this.authScreen = document.getElementById('authScreen');
        this.app = document.getElementById('app');
        this.authForm = document.getElementById('authForm');
        this.authBtn = document.getElementById('authBtn');
        this.authError = document.getElementById('authError');
        this.authEmail = document.getElementById('authEmail');
        this.authPassword = document.getElementById('authPassword');
        this.authName = document.getElementById('authName');
        this.nameGroup = document.getElementById('nameGroup');
        this.authTabs = document.querySelectorAll('.auth-tab');

        this.taskList = document.getElementById('taskList');
        this.emptyState = document.getElementById('emptyState');
        this.taskModal = document.getElementById('taskModal');
        this.reminderModal = document.getElementById('reminderModal');
        this.toastContainer = document.getElementById('toastContainer');

        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.cancelModal = document.getElementById('cancelModal');
        this.closeModal = document.getElementById('closeModal');
        this.closeReminder = document.getElementById('closeReminder');
        this.dismissReminder = document.getElementById('dismissReminder');
        this.signOutBtn = document.getElementById('signOutBtn');
        this.themeToggle = document.getElementById('themeToggle');

        this.taskTitle = document.getElementById('taskTitle');
        this.taskNotes = document.getElementById('taskNotes');
        this.taskDate = document.getElementById('taskDate');
        this.taskTime = document.getElementById('taskTime');
        this.taskCategory = document.getElementById('taskCategory');
        this.taskPriority = document.getElementById('taskPriority');
        this.taskReminder = document.getElementById('taskReminder');
        this.modalTitle = document.getElementById('modalTitle');
        this.searchInput = document.getElementById('searchInput');
        this.sortSelect = document.getElementById('sortSelect');
        this.menuToggle = document.getElementById('menuToggle');
        this.sidebar = document.getElementById('sidebar');
        this.todayDate = document.getElementById('todayDate');
    }

    // =========================================================
    // AUTH
    // =========================================================
    checkAuth() {
        const saved = localStorage.getItem('workflow_user');
        if (saved) {
            this.currentUser = JSON.parse(saved);
            this.isAuthenticated = true;
            this.showApp();
        }
        this.loadThemePreference();
        this.updateDate();
    }

    initAuthListeners() {
        this.authTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.authTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const isSignup = tab.dataset.tab === 'signup';
                this.nameGroup.classList.toggle('hidden', !isSignup);
                this.authBtn.textContent = isSignup ? 'Create Account' : 'Sign In';
                this.authError.classList.add('hidden');
            });
        });

        this.authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAuth();
        });
    }

    handleAuth() {
        const email = this.authEmail.value.trim();
        const password = this.authPassword.value.trim();
        const isSignup = document.querySelector('.auth-tab.active').dataset.tab === 'signup';

        if (!email || !password) {
            this.showAuthError('Please fill in all fields');
            return;
        }

        if (isSignup) {
            const name = this.authName.value.trim();
            if (!name) {
                this.showAuthError('Please enter your name');
                return;
            }
            const user = { email, name, created: Date.now() };
            localStorage.setItem('workflow_user', JSON.stringify(user));
            this.currentUser = user;
            this.isAuthenticated = true;
            this.showApp();
            this.showToast('✅ Account created successfully!', 'success');
        } else {
            const saved = localStorage.getItem('workflow_user');
            if (saved) {
                const user = JSON.parse(saved);
                if (user.email === email) {
                    this.currentUser = user;
                    this.isAuthenticated = true;
                    this.showApp();
                    this.showToast(`👋 Welcome back, ${user.name}!`, 'success');
                    return;
                }
            }
            const newUser = { email, name: email.split('@')[0], created: Date.now() };
            localStorage.setItem('workflow_user', JSON.stringify(newUser));
            this.currentUser = newUser;
            this.isAuthenticated = true;
            this.showApp();
            this.showToast(`👋 Welcome, ${newUser.name}!`, 'success');
        }
    }

    showAuthError(msg) {
        this.authError.textContent = msg;
        this.authError.classList.remove('hidden');
        setTimeout(() => this.authError.classList.add('hidden'), 3000);
    }

    showApp() {
        this.authScreen.classList.add('hidden');
        this.app.classList.remove('hidden');
        this.loadData();
        this.renderAll();
        this.checkStreak();

        setInterval(() => this.checkReminders(), 30000);
        setInterval(() => this.checkStreak(), 3600000);
        setInterval(() => this.updateDate(), 60000);
    }

    signOut() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.authScreen.classList.remove('hidden');
        this.app.classList.add('hidden');
        localStorage.removeItem('workflow_user');
        this.showToast('👋 Signed out successfully', 'info');
    }

    // =========================================================
    // DATE
    // =========================================================
    updateDate() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateStr = now.toLocaleDateString('en-US', options);
        if (this.todayDate) {
            this.todayDate.textContent = dateStr;
        }
    }

    // =========================================================
    // THEME
    // =========================================================
    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        document.body.classList.toggle('dark-mode', this.isDarkMode);
        localStorage.setItem('workflow_theme', this.isDarkMode ? 'dark' : 'light');
        this.showToast(this.isDarkMode ? '🌙 Dark mode' : '☀️ Light mode', 'info');
    }

    loadThemePreference() {
        const saved = localStorage.getItem('workflow_theme');
        if (saved === 'dark') {
            this.isDarkMode = true;
            document.body.classList.add('dark-mode');
        }
    }

    // =========================================================
    // DATA
    // =========================================================
    loadData() {
        const stored = localStorage.getItem('workflowProData');
        if (stored) {
            const data = JSON.parse(stored);
            this.tasks = data.tasks || [];
            this.streakData = data.streakData || { current: 0, best: 0, history: {} };
            this.achievements = data.achievements || [];
        } else {
            this.tasks = [
                {
                    id: Date.now() + 1,
                    title: 'Design new dashboard',
                    notes: 'Create wireframes for the new dashboard',
                    status: 'todo',
                    priority: 'high',
                    category: 'work',
                    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                    time: '10:00',
                    reminder: null,
                    created: Date.now(),
                    completedAt: null
                },
                {
                    id: Date.now() + 2,
                    title: 'Write weekly report',
                    notes: 'Summarize team progress',
                    status: 'inprogress',
                    priority: 'medium',
                    category: 'work',
                    date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
                    time: '14:00',
                    reminder: null,
                    created: Date.now() - 86400000,
                    completedAt: null
                },
                {
                    id: Date.now() + 3,
                    title: 'Morning workout',
                    notes: '30 min cardio session',
                    status: 'completed',
                    priority: 'low',
                    category: 'health',
                    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
                    time: '07:00',
                    reminder: null,
                    created: Date.now() - 172800000,
                    completedAt: Date.now() - 86400000
                }
            ];
            this.streakData = { current: 0, best: 0, history: {} };
            this.saveData();
        }
        this.processReminders();
    }

    saveData() {
        localStorage.setItem('workflowProData', JSON.stringify({
            tasks: this.tasks,
            streakData: this.streakData,
            achievements: this.achievements
        }));
    }

    // =========================================================
    // STREAK
    // =========================================================
    checkStreak() {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        const completedToday = this.tasks.filter(t =>
            t.completedAt && t.completedAt.split('T')[0] === today
        ).length;

        if (completedToday > 0) {
            if (!this.streakData.history[today]) {
                this.streakData.history[today] = true;
                this.streakData.current += 1;
                if (this.streakData.current > this.streakData.best) {
                    this.streakData.best = this.streakData.current;
                    this.showToast(`🔥 New record! ${this.streakData.current}-day streak!`, 'streak');
                }
                this.saveData();
                this.renderAll();
                this.updateAchievements();
            }
        } else {
            const yesterdayStreak = this.streakData.history[yesterday];
            if (!yesterdayStreak && this.streakData.current > 0) {
                this.streakData.current = 0;
                this.saveData();
                this.renderAll();
            }
        }
    }

    getStreakDays() {
        const days = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const isToday = i === 0;
            const isFuture = date > new Date();
            const completed = this.streakData.history[dateStr] || false;
            days.push({ date: dateStr, completed, isToday, isFuture });
        }
        return days;
    }

    // =========================================================
    // REMINDERS
    // =========================================================
    processReminders() {
        this.reminders = [];
        this.tasks.forEach(task => {
            if (task.reminder && task.status !== 'completed') {
                this.reminders.push({
                    taskId: task.id,
                    title: task.title,
                    reminderTime: task.reminder,
                    triggered: false
                });
            }
        });
    }

    checkReminders() {
        const now = new Date();
        this.reminders.forEach(reminder => {
            if (reminder.triggered) return;
            const reminderTime = new Date(reminder.reminderTime);
            if (reminderTime <= now) {
                reminder.triggered = true;
                this.showReminder(reminder);
            }
        });
    }

    showReminder(reminder) {
        const content = document.getElementById('reminderContent');
        content.innerHTML = `
            <div style="font-size:20px;font-weight:700;margin:16px 0 8px;">${this.escapeHTML(reminder.title)}</div>
            <div style="color:var(--text-secondary);font-size:14px;">This task is due soon. Don't forget to complete it.</div>
        `;
        this.reminderModal.classList.remove('hidden');
        this.showToast(`⏰ Reminder: ${reminder.title}`, 'reminder');
        if (Notification.permission === 'granted') {
            new Notification('WorkFlow Reminder', {
                body: `Don't forget: ${reminder.title}`,
                icon: '📋'
            });
        }
    }

    // =========================================================
    // ACHIEVEMENTS
    // =========================================================
    updateAchievements() {
        const allAchievements = [
            { id: 'first-task', icon: '🌟', name: 'First Task', condition: () => this.tasks.length >= 1 },
            { id: 'streak-3', icon: '🔥', name: '3-Day Streak', condition: () => this.streakData.current >= 3 },
            { id: 'streak-7', icon: '⚡', name: '7-Day Streak', condition: () => this.streakData.current >= 7 },
            { id: 'streak-30', icon: '🏆', name: '30-Day Streak', condition: () => this.streakData.current >= 30 },
            { id: 'tasks-10', icon: '📊', name: '10 Tasks Done', condition: () => this.tasks.filter(t => t.completedAt).length >= 10 },
            { id: 'tasks-50', icon: '💎', name: '50 Tasks Done', condition: () => this.tasks.filter(t => t.completedAt).length >= 50 },
            { id: 'all-done', icon: '✨', name: 'All Complete', condition: () => this.tasks.every(t => t.status === 'completed') && this.tasks.length > 0 }
        ];

        allAchievements.forEach(ach => {
            if (!this.achievements.includes(ach.id) && ach.condition()) {
                this.achievements.push(ach.id);
                this.showToast(`${ach.icon} Achievement: ${ach.name}!`, 'streak');
                this.saveData();
            }
        });
        this.renderAchievements();
    }

    // =========================================================
    // TASK CRUD
    // =========================================================
    addTask(title, notes, date, time, priority, category, reminder) {
        const task = {
            id: Date.now(),
            title: title.trim(),
            notes: notes.trim(),
            status: 'todo',
            priority: priority || 'medium',
            category: category || 'personal',
            date: date || '',
            time: time || '',
            reminder: reminder || null,
            created: Date.now(),
            completedAt: null
        };
        this.tasks.unshift(task);
        this.processReminders();
        this.saveData();
        this.renderAll();
        this.updateAchievements();
        this.showToast(`✅ Task added: "${task.title}"`, 'success');
        return task;
    }

    updateTask(id, updates) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            Object.assign(task, updates);
            if (updates.status === 'completed' && !task.completedAt) {
                task.completedAt = new Date().toISOString();
                this.checkStreak();
                this.updateAchievements();
            }
            if (updates.status !== 'completed') {
                task.completedAt = null;
            }
            this.processReminders();
            this.saveData();
            this.renderAll();
            this.updateAchievements();
            this.showToast(`✏️ Task updated: "${task.title}"`, 'success');
        }
    }

    deleteTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task && confirm(`Delete "${task.title}"?`)) {
            this.tasks = this.tasks.filter(t => t.id !== id);
            this.processReminders();
            this.saveData();
            this.renderAll();
            this.showToast(`🗑️ Task deleted: "${task.title}"`, 'error');
        }
    }

    toggleComplete(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            if (task.status === 'completed') {
                task.status = 'todo';
                task.completedAt = null;
            } else {
                task.status = 'completed';
                task.completedAt = new Date().toISOString();
                this.checkStreak();
                this.updateAchievements();
            }
            this.saveData();
            this.renderAll();
        }
    }

    // =========================================================
    // RENDER
    // =========================================================
    renderAll() {
        this.renderListTabs();
        this.renderTasks();
        this.renderStats();
        this.renderStreak();
        this.renderAchievements();
        this.renderProgress();
    }

    renderListTabs() {
        const container = document.getElementById('listTabs');
        const lists = ['all', 'personal', 'work', 'study', 'health', 'others'];
        const labels = ['📋 All Tasks', '👤 Personal', '💼 Work', '📚 Study', '💪 Health', '📌 Others'];

        container.innerHTML = '';
        lists.forEach((list, index) => {
            const btn = document.createElement('button');
            btn.className = `nav-item ${this.currentList === list ? 'active' : ''}`;
            btn.dataset.list = list;
            btn.textContent = labels[index];
            btn.addEventListener('click', () => {
                this.currentList = list;
                this.renderAll();
            });
            container.appendChild(btn);
        });
    }

    renderTasks() {
        let tasks = [...this.tasks];

        if (this.currentList !== 'all') {
            tasks = tasks.filter(t => t.category === this.currentList);
        }

        if (this.currentFilter === 'active') {
            tasks = tasks.filter(t => t.status !== 'completed');
        } else if (this.currentFilter === 'completed') {
            tasks = tasks.filter(t => t.status === 'completed');
        }

        const searchTerm = this.searchInput.value.toLowerCase();
        if (searchTerm) {
            tasks = tasks.filter(t => t.title.toLowerCase().includes(searchTerm));
        }

        tasks.sort((a, b) => {
            if (this.currentSort === 'dueDate') {
                const da = a.date ? new Date(`${a.date}T${a.time || '23:59'}`).getTime() : Infinity;
                const db = b.date ? new Date(`${b.date}T${b.time || '23:59'}`).getTime() : Infinity;
                return da - db;
            }
            if (this.currentSort === 'priority') {
                const order = { high: 0, medium: 1, low: 2 };
                return order[a.priority] - order[b.priority];
            }
            return b.created - a.created;
        });

        this.taskList.innerHTML = '';
        this.emptyState.classList.toggle('hidden', tasks.length > 0);

        tasks.forEach(task => {
            const li = document.createElement('li');
            const isCompleted = task.status === 'completed';
            const isOverdue = task.date && !isCompleted &&
                new Date(`${task.date}T${task.time || '23:59'}`).getTime() < Date.now();

            li.className = `task-item priority-${task.priority}`;
            if (isCompleted) li.classList.add('completed');
            if (isOverdue) li.classList.add('overdue');

            li.innerHTML = `
                <button class="task-checkbox ${isCompleted ? 'checked' : ''}" data-id="${task.id}">
                    ${isCompleted ? '✓' : ''}
                </button>
                <div class="task-body">
                    <div class="task-title-text">${this.escapeHTML(task.title)}</div>
                    ${task.notes ? `<div class="task-notes-preview">${this.escapeHTML(task.notes)}</div>` : ''}
                    <div class="task-meta">
                        ${task.date ? `<span class="due-date">${isOverdue ? '⚠️ Overdue — ' : ''}${this.formatDate(task.date, task.time)}</span>` : ''}
                        <span class="meta-tag ${task.category}">${task.category}</span>
                        <span class="meta-tag">${task.priority}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="task-action-btn edit" data-id="${task.id}">✏️</button>
                    <button class="task-action-btn delete" data-id="${task.id}">🗑️</button>
                </div>
            `;

            li.querySelector('.task-checkbox').addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleComplete(task.id);
            });

            li.querySelector('.edit').addEventListener('click', (e) => {
                e.stopPropagation();
                this.openEditModal(task.id);
            });

            li.querySelector('.delete').addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteTask(task.id);
            });

            this.taskList.appendChild(li);
        });
    }

    renderStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.status === 'completed').length;
        const pending = total - completed;

        document.getElementById('totalTasks').textContent = total;
        document.getElementById('pendingTasks').textContent = pending;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('streakDisplay').textContent = `${this.streakData.current}d`;
    }

    renderStreak() {
        document.getElementById('currentStreak').textContent = `${this.streakData.current} days`;
        document.getElementById('bestStreak').textContent = `${this.streakData.best} days`;

        const calendar = document.getElementById('streakCalendar');
        const days = this.getStreakDays();
        const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

        calendar.innerHTML = '';
        days.forEach((day, index) => {
            const div = document.createElement('div');
            div.className = 'streak-day';
            if (day.completed) div.classList.add('completed');
            if (day.isToday) div.classList.add('today');
            if (day.isFuture) div.classList.add('future');
            div.textContent = dayLabels[index];
            calendar.appendChild(div);
        });
    }

    renderAchievements() {
        const container = document.getElementById('achievements');
        const all = [
            { id: 'first-task', icon: '🌟', name: 'First Task' },
            { id: 'streak-3', icon: '🔥', name: '3-Day Streak' },
            { id: 'streak-7', icon: '⚡', name: '7-Day Streak' },
            { id: 'streak-30', icon: '🏆', name: '30-Day Streak' },
            { id: 'tasks-10', icon: '📊', name: '10 Tasks Done' },
            { id: 'tasks-50', icon: '💎', name: '50 Tasks Done' },
            { id: 'all-done', icon: '✨', name: 'All Complete' }
        ];

        container.innerHTML = '';
        all.forEach(ach => {
            const div = document.createElement('div');
            const unlocked = this.achievements.includes(ach.id);
            div.className = `achievement-badge ${unlocked ? 'unlocked' : 'locked'}`;
            div.innerHTML = `${ach.icon}<span class="tooltip">${ach.name}</span>`;
            container.appendChild(div);
        });
    }

    renderProgress() {
        const today = new Date().toISOString().split('T')[0];
        const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

        const todayTasks = this.tasks.filter(t => t.createdAt && t.createdAt.split('T')[0] === today);
        const todayDone = todayTasks.filter(t => t.status === 'completed').length;
        const todayPct = todayTasks.length ? Math.round((todayDone / todayTasks.length) * 100) : 0;

        const weekTasks = this.tasks.filter(t => t.createdAt && t.createdAt >= weekAgo);
        const weekDone = weekTasks.filter(t => t.status === 'completed').length;
        const weekPct = weekTasks.length ? Math.round((weekDone / weekTasks.length) * 100) : 0;

        document.getElementById('todayProgress').style.width = `${todayPct}%`;
        document.getElementById('todayPercent').textContent = `${todayPct}%`;
        document.getElementById('weekProgress').style.width = `${weekPct}%`;
        document.getElementById('weekPercent').textContent = `${weekPct}%`;
    }

    // =========================================================
    // MODAL
    // =========================================================
    openAddModal() {
        this.editingTaskId = null;
        this.modalTitle.textContent = 'New Task';
        this.taskTitle.value = '';
        this.taskNotes.value = '';
        this.taskDate.value = '';
        this.taskTime.value = '';
        this.taskPriority.value = 'medium';
        this.taskCategory.value = 'personal';
        this.taskReminder.value = '';
        this.taskModal.classList.remove('hidden');
        setTimeout(() => this.taskTitle.focus(), 100);
    }

    openEditModal(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        this.editingTaskId = id;
        this.modalTitle.textContent = 'Edit Task';
        this.taskTitle.value = task.title;
        this.taskNotes.value = task.notes || '';
        this.taskDate.value = task.date || '';
        this.taskTime.value = task.time || '';
        this.taskPriority.value = task.priority;
        this.taskCategory.value = task.category;
        this.taskReminder.value = task.reminder || '';
        this.taskModal.classList.remove('hidden');
        setTimeout(() => this.taskTitle.focus(), 100);
    }

    closeTaskModal() {
        this.taskModal.classList.add('hidden');
        this.editingTaskId = null;
    }

    saveTask() {
        const title = this.taskTitle.value.trim();
        if (!title) {
            this.taskTitle.focus();
            this.taskTitle.style.borderColor = '#e74c3c';
            setTimeout(() => this.taskTitle.style.borderColor = '', 2000);
            return;
        }

        const data = {
            title,
            notes: this.taskNotes.value.trim(),
            date: this.taskDate.value,
            time: this.taskTime.value,
            priority: this.taskPriority.value,
            category: this.taskCategory.value,
            reminder: this.taskReminder.value || null
        };

        if (this.editingTaskId) {
            const task = this.tasks.find(t => t.id === this.editingTaskId);
            if (task) {
                this.updateTask(this.editingTaskId, data);
            }
        } else {
            this.addTask(data.title, data.notes, data.date, data.time, data.priority, data.category, data.reminder);
        }
        this.closeTaskModal();
    }

    // =========================================================
    // UTILITY
    // =========================================================
    escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    formatDate(date, time) {
        if (!date) return '';
        const d = new Date(`${date}T${time || '00:00'}`);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
            (time ? `, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}` : '');
    }

    showToast(message, type = 'info') {
        const container = this.toastContainer;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icons = {
            success: '✅',
            error: '❌',
            streak: '🔥',
            reminder: '⏰',
            info: '📋'
        };

        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || '📋'}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close">✕</button>
        `;

        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });

        container.appendChild(toast);

        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 300);
            }
        }, 4000);
    }

    // =========================================================
    // EVENT LISTENERS
    // =========================================================
    initEventListeners() {
        this.initAuthListeners();

        this.signOutBtn.addEventListener('click', () => this.signOut());
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        this.addTaskBtn.addEventListener('click', () => this.openAddModal());

        this.cancelModal.addEventListener('click', () => this.closeTaskModal());
        this.closeModal.addEventListener('click', () => this.closeTaskModal());

        this.closeReminder.addEventListener('click', () => this.reminderModal.classList.add('hidden'));
        this.dismissReminder.addEventListener('click', () => this.reminderModal.classList.add('hidden'));

        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTask();
        });

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.renderTasks();
            });
        });

        this.sortSelect.addEventListener('change', () => {
            this.currentSort = this.sortSelect.value;
            this.renderTasks();
        });

        this.searchInput.addEventListener('input', () => {
            this.renderTasks();
        });

        document.querySelectorAll('.overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.classList.add('hidden');
                }
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeTaskModal();
                this.reminderModal.classList.add('hidden');
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                this.openAddModal();
            }
        });

        document.querySelectorAll('.reminder-preset').forEach(btn => {
            btn.addEventListener('click', () => {
                const minutes = parseInt(btn.dataset.minutes);
                const now = new Date();
                now.setMinutes(now.getMinutes() + minutes);
                const formatted = now.toISOString().slice(0, 16);
                this.taskReminder.value = formatted;
            });
        });

        this.menuToggle.addEventListener('click', () => {
            this.sidebar.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!this.sidebar.contains(e.target) && e.target !== this.menuToggle) {
                    this.sidebar.classList.remove('open');
                }
            }
        });

        document.getElementById('exportData').addEventListener('click', () => {
            const data = JSON.stringify({
                tasks: this.tasks,
                streakData: this.streakData,
                achievements: this.achievements
            }, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `workflow_backup_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            this.showToast('📤 Data exported successfully!', 'success');
        });

        document.getElementById('importData').addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const data = JSON.parse(event.target.result);
                        this.tasks = data.tasks || [];
                        this.streakData = data.streakData || { current: 0, best: 0, history: {} };
                        this.achievements = data.achievements || [];
                        this.saveData();
                        this.renderAll();
                        this.showToast('📥 Data imported successfully!', 'success');
                    } catch (err) {
                        this.showToast('❌ Invalid file format', 'error');
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        });
    }
}

// =========================================================
// INIT
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    const app = new WorkFlowPro();
});
