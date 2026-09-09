/* =========================================================
   WorkFlow Pro - Complete JavaScript
   GitHub Pages Ready
   ========================================================= */

class WorkFlowPro {
    constructor() {
        this.currentUser = null;
        this.tasks = [];
        this.currentCategory = "all";
        this.statusFilter = "all";
        this.priorityFilter = "all";
        this.sortBy = "newest";
        this.searchQuery = "";
        this.editingTaskId = null;
        this.confirmAction = null;
        this.reminderInterval = null;

        this.init();
    }

    /* =========================================================
       INITIALIZATION
       ========================================================= */

    init() {
        this.cacheElements();
        this.bindEvents();
        this.checkLoggedInUser();
    }

    cacheElements() {
        // Auth
        this.authScreen = document.getElementById("authScreen");
        this.app = document.getElementById("app");

        this.signInTab = document.getElementById("signInTab");
        this.signUpTab = document.getElementById("signUpTab");

        this.signInForm = document.getElementById("signInForm");
        this.signUpForm = document.getElementById("signUpForm");

        this.signInEmail = document.getElementById("signInEmail");
        this.signInPassword = document.getElementById("signInPassword");

        this.signUpName = document.getElementById("signUpName");
        this.signUpEmail = document.getElementById("signUpEmail");
        this.signUpPassword = document.getElementById("signUpPassword");

        // Password toggles
        this.signInPasswordToggle = document.getElementById("signInPasswordToggle");
        this.signUpPasswordToggle = document.getElementById("signUpPasswordToggle");

        // Sidebar
        this.sidebar = document.getElementById("sidebar");
        this.closeSidebar = document.getElementById("closeSidebar");
        this.mobileMenu = document.getElementById("mobileMenu");

        this.userAvatar = document.getElementById("userAvatar");
        this.userName = document.getElementById("userName");
        this.userEmail = document.getElementById("userEmail");

        this.streakCount = document.getElementById("streakCount");
        this.streakProgress = document.getElementById("streakProgress");
        this.streakMessage = document.getElementById("streakMessage");

        // Navigation
        this.navItems = document.querySelectorAll(".nav-item[data-category]");

        this.allCount = document.getElementById("allCount");
        this.personalCount = document.getElementById("personalCount");
        this.workCount = document.getElementById("workCount");
        this.studyCount = document.getElementById("studyCount");
        this.healthCount = document.getElementById("healthCount");
        this.othersCount = document.getElementById("othersCount");
        this.achievementCount = document.getElementById("achievementCount");

        // Header
        this.welcomeMessage = document.getElementById("welcomeMessage");
        this.currentDate = document.getElementById("currentDate");
        this.searchInput = document.getElementById("searchInput");
        this.newTaskBtn = document.getElementById("newTaskBtn");

        // Stats
        this.totalTasks = document.getElementById("totalTasks");
        this.completedTasks = document.getElementById("completedTasks");
        this.pendingTasks = document.getElementById("pendingTasks");
        this.overdueTasks = document.getElementById("overdueTasks");

        // Filters
        this.priorityFilterElement = document.getElementById("priorityFilter");
        this.statusFilterElement = document.getElementById("statusFilter");
        this.sortSelect = document.getElementById("sortSelect");

        // Tasks
        this.taskList = document.getElementById("taskList");
        this.emptyState = document.getElementById("emptyState");

        // Task modal
        this.taskModal = document.getElementById("taskModal");
        this.modalTitle = document.getElementById("modalTitle");
        this.closeTaskModal = document.getElementById("closeTaskModal");
        this.taskForm = document.getElementById("taskForm");

        this.taskId = document.getElementById("taskId");
        this.taskTitle = document.getElementById("taskTitle");
        this.taskNotes = document.getElementById("taskNotes");
        this.taskDueDate = document.getElementById("taskDueDate");
        this.taskDueTime = document.getElementById("taskDueTime");
        this.taskCategory = document.getElementById("taskCategory");
        this.taskPriority = document.getElementById("taskPriority");
        this.taskReminder = document.getElementById("taskReminder");
        this.cancelTaskBtn = document.getElementById("cancelTaskBtn");

        // Confirm modal
        this.confirmModal = document.getElementById("confirmModal");
        this.confirmTitle = document.getElementById("confirmTitle");
        this.confirmMessage = document.getElementById("confirmMessage");
        this.confirmCancel = document.getElementById("confirmCancel");
        this.confirmDelete = document.getElementById("confirmDelete");

        // Theme
        this.themeToggle = document.getElementById("themeToggle");
        this.themeIcon = document.getElementById("themeIcon");

        // Sign out
        this.signOutBtn = document.getElementById("signOutBtn");

        // Progress
        this.progressPercent = document.getElementById("progressPercent");
        this.progressFill = document.getElementById("progressFill");
        this.progressText = document.getElementById("progressText");

        // Toast
        this.toastContainer = document.getElementById("toastContainer");
    }

    bindEvents() {
        /* ---------- AUTH ---------- */

        if (this.signInTab) {
            this.signInTab.addEventListener("click", () => {
                this.showSignIn();
            });
        }

        if (this.signUpTab) {
            this.signUpTab.addEventListener("click", () => {
                this.showSignUp();
            });
        }

        if (this.signInForm) {
            this.signInForm.addEventListener("submit", (e) => {
                e.preventDefault();
                this.signIn();
            });
        }

        if (this.signUpForm) {
            this.signUpForm.addEventListener("submit", (e) => {
                e.preventDefault();
                this.signUp();
            });
        }

        if (this.signInPasswordToggle) {
            this.signInPasswordToggle.addEventListener("click", () => {
                this.togglePassword(this.signInPassword, this.signInPasswordToggle);
            });
        }

        if (this.signUpPasswordToggle) {
            this.signUpPasswordToggle.addEventListener("click", () => {
                this.togglePassword(this.signUpPassword, this.signUpPasswordToggle);
            });
        }

        /* ---------- APP ---------- */

        this.navItems.forEach((item) => {
            item.addEventListener("click", () => {
                const category = item.dataset.category || "all";
                this.currentCategory = category;

                this.updateActiveNavigation();
                this.renderTasks();

                this.closeMobileSidebar();
            });
        });

        if (this.searchInput) {
            this.searchInput.addEventListener("input", () => {
                this.searchQuery = this.searchInput.value.trim().toLowerCase();
                this.renderTasks();
            });
        }

        if (this.priorityFilterElement) {
            this.priorityFilterElement.addEventListener("change", () => {
                this.priorityFilter =
                    this.priorityFilterElement.value.toLowerCase();

                this.renderTasks();
            });
        }

        if (this.statusFilterElement) {
            this.statusFilterElement.addEventListener("change", () => {
                this.statusFilter =
                    this.statusFilterElement.value.toLowerCase();

                this.renderTasks();
            });
        }

        if (this.sortSelect) {
            this.sortSelect.addEventListener("change", () => {
                this.sortBy = this.sortSelect.value;
                this.renderTasks();
            });
        }

        if (this.newTaskBtn) {
            this.newTaskBtn.addEventListener("click", () => {
                this.openNewTaskModal();
            });
        }

        if (this.closeTaskModal) {
            this.closeTaskModal.addEventListener("click", () => {
                this.closeTaskModalWindow();
            });
        }

        if (this.cancelTaskBtn) {
            this.cancelTaskBtn.addEventListener("click", () => {
                this.closeTaskModalWindow();
            });
        }

        if (this.taskForm) {
            this.taskForm.addEventListener("submit", (e) => {
                e.preventDefault();
                this.saveTask();
            });
        }

        if (this.confirmCancel) {
            this.confirmCancel.addEventListener("click", () => {
                this.closeConfirmModal();
            });
        }

        if (this.confirmDelete) {
            this.confirmDelete.addEventListener("click", () => {
                if (typeof this.confirmAction === "function") {
                    this.confirmAction();
                }

                this.closeConfirmModal();
            });
        }

        if (this.themeToggle) {
            this.themeToggle.addEventListener("click", () => {
                this.toggleTheme();
            });
        }

        if (this.signOutBtn) {
            this.signOutBtn.addEventListener("click", () => {
                this.signOut();
            });
        }

        if (this.mobileMenu) {
            this.mobileMenu.addEventListener("click", () => {
                this.openMobileSidebar();
            });
        }

        if (this.closeSidebar) {
            this.closeSidebar.addEventListener("click", () => {
                this.closeMobileSidebar();
            });
        }

        /* ---------- CLOSE MODALS ---------- */

        window.addEventListener("click", (e) => {
            if (e.target === this.taskModal) {
                this.closeTaskModalWindow();
            }

            if (e.target === this.confirmModal) {
                this.closeConfirmModal();
            }
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                this.closeTaskModalWindow();
                this.closeConfirmModal();
            }
        });
    }

    /* =========================================================
       AUTHENTICATION
       ========================================================= */

    checkLoggedInUser() {
        const savedUser = localStorage.getItem("workflow_user");

        if (!savedUser) {
            this.showAuth();
            return;
        }

        try {
            this.currentUser = JSON.parse(savedUser);

            if (
                !this.currentUser ||
                !this.currentUser.email ||
                !this.currentUser.name
            ) {
                throw new Error("Invalid user");
            }

            this.loadUserData();
            this.showApp();
        } catch (error) {
            console.error("Login data error:", error);

            localStorage.removeItem("workflow_user");
            this.currentUser = null;

            this.showAuth();
        }
    }

    showAuth() {
        if (this.authScreen) {
            this.authScreen.classList.remove("hidden");
        }

        if (this.app) {
            this.app.classList.add("hidden");
        }
    }

    showApp() {
        if (this.authScreen) {
            this.authScreen.classList.add("hidden");
        }

        if (this.app) {
            this.app.classList.remove("hidden");
        }

        this.updateUserUI();
        this.updateDate();
        this.updateActiveNavigation();
        this.updateThemeIcon();
        this.updateDashboard();
        this.renderTasks();

        this.startReminderChecker();
    }

    showSignIn() {
        if (this.signInTab) {
            this.signInTab.classList.add("active");
        }

        if (this.signUpTab) {
            this.signUpTab.classList.remove("active");
        }

        if (this.signInForm) {
            this.signInForm.classList.remove("hidden");
        }

        if (this.signUpForm) {
            this.signUpForm.classList.add("hidden");
        }
    }

    showSignUp() {
        if (this.signUpTab) {
            this.signUpTab.classList.add("active");
        }

        if (this.signInTab) {
            this.signInTab.classList.remove("active");
        }

        if (this.signUpForm) {
            this.signUpForm.classList.remove("hidden");
        }

        if (this.signInForm) {
            this.signInForm.classList.add("hidden");
        }
    }

    getUsers() {
        try {
            return JSON.parse(
                localStorage.getItem("workflowUsers") || "[]"
            );
        } catch {
            return [];
        }
    }

    saveUsers(users) {
        localStorage.setItem(
            "workflowUsers",
            JSON.stringify(users)
        );
    }

    signUp() {
        const name = this.signUpName?.value.trim();
        const email = this.signUpEmail?.value.trim().toLowerCase();
        const password = this.signUpPassword?.value;

        if (!name || !email || !password) {
            this.showToast(
                "Please fill in all fields.",
                "error"
            );
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showToast(
                "Please enter a valid email address.",
                "error"
            );
            return;
        }

        if (password.length < 6) {
            this.showToast(
                "Password must be at least 6 characters.",
                "error"
            );
            return;
        }

        const users = this.getUsers();

        const existingUser = users.find(
            (user) => user.email === email
        );

        if (existingUser) {
            this.showToast(
                "An account with this email already exists.",
                "error"
            );
            return;
        }

        const newUser = {
            name,
            email,
            password
        };

        users.push(newUser);
        this.saveUsers(users);

        this.currentUser = {
            name,
            email
        };

        localStorage.setItem(
            "workflow_user",
            JSON.stringify(this.currentUser)
        );

        this.createFreshUserData();

        this.showToast(
            "Account created successfully!",
            "success"
        );

        setTimeout(() => {
            this.showApp();
        }, 500);
    }

    signIn() {
        const email = this.signInEmail?.value.trim().toLowerCase();
        const password = this.signInPassword?.value;

        if (!email || !password) {
            this.showToast(
                "Please enter your email and password.",
                "error"
            );
            return;
        }

        const users = this.getUsers();

        const user = users.find(
            (item) =>
                item.email === email &&
                item.password === password
        );

        if (!user) {
            this.showToast(
                "Invalid email or password.",
                "error"
            );
            return;
        }

        this.currentUser = {
            name: user.name,
            email: user.email
        };

        localStorage.setItem(
            "workflow_user",
            JSON.stringify(this.currentUser)
        );

        this.loadUserData();

        this.showToast(
            "Welcome back!",
            "success"
        );

        setTimeout(() => {
            this.showApp();
        }, 400);
    }

    signOut() {
        this.saveUserData();

        if (this.reminderInterval) {
            clearInterval(this.reminderInterval);
            this.reminderInterval = null;
        }

        localStorage.removeItem("workflow_user");

        this.currentUser = null;
        this.tasks = [];

        this.showAuth();

        if (this.signInForm) {
            this.signInForm.reset();
        }

        if (this.signUpForm) {
            this.signUpForm.reset();
        }

        this.showSignIn();

        this.showToast(
            "Signed out successfully.",
            "success"
        );
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    togglePassword(input, button) {
        if (!input) return;

        if (input.type === "password") {
            input.type = "text";

            if (button) {
                button.textContent = "Hide";
            }
        } else {
            input.type = "password";

            if (button) {
                button.textContent = "Show";
            }
        }
    }

    /* =========================================================
       USER DATA
       ========================================================= */

    getUserStorageKey() {
        if (!this.currentUser?.email) {
            return null;
        }

        const normalizedEmail =
            this.currentUser.email
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "_");

        return `workflowProData_${normalizedEmail}`;
    }

    createFreshUserData() {
        const data = {
            tasks: [],
            streak: 0,
            achievements: []
        };

        const key = this.getUserStorageKey();

        if (key) {
            localStorage.setItem(
                key,
                JSON.stringify(data)
            );
        }

        this.tasks = [];
    }

    loadUserData() {
        const key = this.getUserStorageKey();

        if (!key) {
            this.tasks = [];
            return;
        }

        try {
            const savedData = JSON.parse(
                localStorage.getItem(key) || "null"
            );

            if (!savedData) {
                this.createFreshUserData();
                return;
            }

            this.tasks = Array.isArray(savedData.tasks)
                ? savedData.tasks
                : [];

            this.tasks = this.tasks.map((task) => ({
                id: task.id || this.generateId(),
                title: task.title || "Untitled Task",
                notes: task.notes || "",
                dueDate: task.dueDate || "",
                dueTime: task.dueTime || "",
                category: task.category || "others",
                priority: task.priority || "medium",
                reminder: task.reminder ?? "none",
                completed: task.completed === true,
                createdAt:
                    task.createdAt ||
                    new Date().toISOString(),
                completedAt: task.completedAt || null,
                reminderSent:
                    task.reminderSent === true
            }));

            this.updateDashboard();
        } catch (error) {
            console.error(
                "Could not load user data:",
                error
            );

            this.tasks = [];
        }
    }

    saveUserData() {
        const key = this.getUserStorageKey();

        if (!key) return;

        const oldData = this.getUserData();

        const data = {
            ...oldData,
            tasks: this.tasks
        };

        localStorage.setItem(
            key,
            JSON.stringify(data)
        );
    }

    getUserData() {
        const key = this.getUserStorageKey();

        if (!key) {
            return {
                tasks: [],
                streak: 0,
                achievements: []
            };
        }

        try {
            return JSON.parse(
                localStorage.getItem(key) || "{}"
            );
        } catch {
            return {
                tasks: [],
                streak: 0,
                achievements: []
            };
        }
    }

    /* =========================================================
       UI
       ========================================================= */

    updateUserUI() {
        if (!this.currentUser) return;

        if (this.userName) {
            this.userName.textContent =
                this.currentUser.name;
        }

        if (this.userEmail) {
            this.userEmail.textContent =
                this.currentUser.email;
        }

        if (this.userAvatar) {
            const firstLetter =
                this.currentUser.name
                    .charAt(0)
                    .toUpperCase();

            this.userAvatar.textContent =
                firstLetter;
        }

        if (this.welcomeMessage) {
            this.welcomeMessage.textContent =
                `Welcome back, ${this.currentUser.name.split(" ")[0]}!`;
        }
    }

    updateDate() {
        if (!this.currentDate) return;

        const now = new Date();

        this.currentDate.textContent =
            now.toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            });
    }

    updateActiveNavigation() {
        this.navItems.forEach((item) => {
            const category =
                item.dataset.category || "all";

            item.classList.toggle(
                "active",
                category === this.currentCategory
            );
        });

        this.updateCategoryCounts();
    }

    /* =========================================================
       TASK CRUD
       ========================================================= */

    generateId() {
        return (
            Date.now().toString(36) +
            Math.random()
                .toString(36)
                .substring(2, 9)
        );
    }

    openNewTaskModal() {
        this.editingTaskId = null;

        if (this.modalTitle) {
            this.modalTitle.textContent = "New Task";
        }

        if (this.taskForm) {
            this.taskForm.reset();
        }

        if (this.taskId) {
            this.taskId.value = "";
        }

        if (this.taskPriority) {
            this.taskPriority.value = "medium";
        }

        if (this.taskCategory) {
            this.taskCategory.value = "personal";
        }

        if (this.taskReminder) {
            this.taskReminder.value = "none";
        }

        this.setMinimumDueDate();

        this.openTaskModal();
    }

    openEditTaskModal(taskId) {
        const task = this.tasks.find(
            (item) => item.id === taskId
        );

        if (!task) return;

        this.editingTaskId = taskId;

        if (this.modalTitle) {
            this.modalTitle.textContent = "Edit Task";
        }

        if (this.taskId) {
            this.taskId.value = task.id;
        }

        if (this.taskTitle) {
            this.taskTitle.value = task.title || "";
        }

        if (this.taskNotes) {
            this.taskNotes.value = task.notes || "";
        }

        if (this.taskDueDate) {
            this.taskDueDate.value =
                task.dueDate || "";
        }

        if (this.taskDueTime) {
            this.taskDueTime.value =
                task.dueTime || "";
        }

        if (this.taskCategory) {
            this.taskCategory.value =
                task.category || "personal";
        }

        if (this.taskPriority) {
            this.taskPriority.value =
                task.priority || "medium";
        }

        if (this.taskReminder) {
            this.taskReminder.value =
                String(task.reminder ?? "none");
        }

        this.openTaskModal();
    }

    saveTask() {
        const title =
            this.taskTitle?.value.trim();

        if (!title) {
            this.showToast(
                "Please enter a task title.",
                "error"
            );
            return;
        }

        const dueDate =
            this.taskDueDate?.value || "";

        const dueTime =
            this.taskDueTime?.value || "";

        const reminder =
            this.taskReminder?.value || "none";

        const category =
            this.taskCategory?.value || "personal";

        const priority =
            this.taskPriority?.value || "medium";

        const notes =
            this.taskNotes?.value.trim() || "";

        if (this.editingTaskId) {
            const index = this.tasks.findIndex(
                (task) =>
                    task.id === this.editingTaskId
            );

            if (index !== -1) {
                const oldTask =
                    this.tasks[index];

                this.tasks[index] = {
                    ...oldTask,
                    title,
                    notes,
                    dueDate,
                    dueTime,
                    category,
                    priority,
                    reminder,
                    reminderSent: false
                };

                this.showToast(
                    "Task updated successfully.",
                    "success"
                );
            }
        } else {
            const newTask = {
                id: this.generateId(),
                title,
                notes,
                dueDate,
                dueTime,
                category,
                priority,
                reminder,
                completed: false,
                createdAt:
                    new Date().toISOString(),
                completedAt: null,
                reminderSent: false
            };

            this.tasks.push(newTask);

            this.showToast(
                "Task created successfully.",
                "success"
            );
        }

        this.saveUserData();
        this.closeTaskModalWindow();
        this.updateDashboard();
        this.renderTasks();
    }

    deleteTask(taskId) {
        const task = this.tasks.find(
            (item) => item.id === taskId
        );

        if (!task) return;

        this.openConfirmModal(
            "Delete Task",
            `Are you sure you want to delete "${task.title}"?`,
            () => {
                this.tasks =
                    this.tasks.filter(
                        (item) =>
                            item.id !== taskId
                    );

                this.saveUserData();
                this.updateDashboard();
                this.renderTasks();

                this.showToast(
                    "Task deleted.",
                    "success"
                );
            }
        );
    }

    toggleTask(taskId) {
        const task = this.tasks.find(
            (item) => item.id === taskId
        );

        if (!task) return;

        task.completed = !task.completed;

        if (task.completed) {
            task.completedAt =
                new Date().toISOString();

            // Completed tasks should never trigger reminders.
            task.reminderSent = true;

            this.showToast(
                "Task completed!",
                "success"
            );
        } else {
            task.completedAt = null;

            // If reopened, allow reminder again.
            task.reminderSent = false;

            this.showToast(
                "Task marked as pending.",
                "success"
            );
        }

        this.saveUserData();
        this.updateDashboard();
        this.renderTasks();
    }

    /* =========================================================
       TASK FILTERING
       ========================================================= */

    getFilteredTasks() {
        let filtered = [...this.tasks];

        /* CATEGORY */

        if (
            this.currentCategory &&
            this.currentCategory !== "all"
        ) {
            filtered = filtered.filter(
                (task) =>
                    String(task.category)
                        .toLowerCase() ===
                    String(this.currentCategory)
                        .toLowerCase()
            );
        }

        /* STATUS */

        const status =
            String(
                this.statusFilter || "all"
            ).toLowerCase();

        if (status === "completed") {
            filtered = filtered.filter(
                (task) => task.completed === true
            );
        }

        if (status === "pending") {
            filtered = filtered.filter(
                (task) => task.completed !== true
            );
        }

        /* PRIORITY */

        const priority =
            String(
                this.priorityFilter || "all"
            ).toLowerCase();

        if (priority !== "all") {
            filtered = filtered.filter(
                (task) =>
                    String(task.priority)
                        .toLowerCase() === priority
            );
        }

        /* SEARCH */

        if (this.searchQuery) {
            filtered = filtered.filter(
                (task) => {
                    const searchableText = [
                        task.title,
                        task.notes,
                        task.category,
                        task.priority
                    ]
                        .join(" ")
                        .toLowerCase();

                    return searchableText.includes(
                        this.searchQuery
                    );
                }
            );
        }

        /* SORT */

        filtered.sort((a, b) => {
            switch (this.sortBy) {
                case "oldest":
                    return (
                        new Date(a.createdAt) -
                        new Date(b.createdAt)
                    );

                case "dueSoon":
                    return (
                        this.getTaskTimestamp(a) -
                        this.getTaskTimestamp(b)
                    );

                case "priority": {
                    const order = {
                        high: 1,
                        medium: 2,
                        low: 3
                    };

                    return (
                        (order[a.priority] || 4) -
                        (order[b.priority] || 4)
                    );
                }

                case "newest":
                default:
                    return (
                        new Date(b.createdAt) -
                        new Date(a.createdAt)
                    );
            }
        });

        return filtered;
    }

    /* =========================================================
       RENDER TASKS
       ========================================================= */

    renderTasks() {
        if (!this.taskList) return;

        const tasks =
            this.getFilteredTasks();

        this.taskList.innerHTML = "";

        if (tasks.length === 0) {
            if (this.emptyState) {
                this.emptyState.classList.remove(
                    "hidden"
                );

                this.taskList.appendChild(
                    this.emptyState
                );
            }

            return;
        }

        if (this.emptyState) {
            this.emptyState.classList.add(
                "hidden"
            );
        }

        tasks.forEach((task) => {
            const card =
                this.createTaskElement(task);

            this.taskList.appendChild(card);
        });
    }

    createTaskElement(task) {
        const card =
            document.createElement("div");

        card.className =
            "task-card";

        if (task.completed) {
            card.classList.add("completed");
        }

        const dueDateText =
            this.formatTaskDueDate(task);

        const priority =
            String(
                task.priority || "medium"
            ).toLowerCase();

        const category =
            String(
                task.category || "others"
            ).toLowerCase();

        card.innerHTML = `
            <div class="task-check">
                <button
                    class="task-checkbox ${task.completed ? "checked" : ""}"
                    data-action="toggle"
                    data-id="${this.escapeAttribute(task.id)}"
                    aria-label="Toggle task"
                    type="button"
                >
                    ${task.completed ? "✓" : ""}
                </button>
            </div>

            <div class="task-content">
                <div class="task-main">
                    <h3 class="task-title">
                        ${this.escapeHTML(task.title)}
                    </h3>

                    ${
                        task.notes
                            ? `
                        <p class="task-notes">
                            ${this.escapeHTML(task.notes)}
                        </p>
                    `
                            : ""
                    }

                    <div class="task-meta">

                        ${
                            dueDateText
                                ? `
                            <span class="task-due">
                                ${this.escapeHTML(dueDateText)}
                            </span>
                        `
                                : ""
                        }

                        <span class="task-category">
                            ${this.escapeHTML(
                                this.capitalize(category)
                            )}
                        </span>

                        <span class="task-priority ${priority}">
                            ${this.escapeHTML(
                                this.capitalize(priority)
                            )}
                        </span>

                        ${
                            task.reminder &&
                            task.reminder !== "none"
                                ? `
                            <span class="task-reminder">
                                Reminder: ${this.escapeHTML(
                                    this.formatReminder(
                                        task.reminder
                                    )
                                )}
                            </span>
                        `
                                : ""
                        }

                    </div>
                </div>

                <div class="task-actions">

                    <button
                        type="button"
                        class="edit-task"
                        data-action="edit"
                        data-id="${this.escapeAttribute(task.id)}"
                        aria-label="Edit task"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        class="delete-task"
                        data-action="delete"
                        data-id="${this.escapeAttribute(task.id)}"
                        aria-label="Delete task"
                    >
                        Delete
                    </button>

                </div>
            </div>
        `;

        const actionButtons =
            card.querySelectorAll(
                "[data-action]"
            );

        actionButtons.forEach((button) => {
            button.addEventListener(
                "click",
                (e) => {
                    e.stopPropagation();

                    const action =
                        button.dataset.action;

                    const id =
                        button.dataset.id;

                    if (action === "toggle") {
                        this.toggleTask(id);
                    }

                    if (action === "edit") {
                        this.openEditTaskModal(id);
                    }

                    if (action === "delete") {
                        this.deleteTask(id);
                    }
                }
            );
        });

        return card;
    }

    /* =========================================================
       DASHBOARD
       ========================================================= */

    updateDashboard() {
        const total =
            this.tasks.length;

        const completed =
            this.tasks.filter(
                (task) => task.completed === true
            ).length;

        const pending =
            total - completed;

        const overdue =
            this.tasks.filter(
                (task) =>
                    !task.completed &&
                    this.isTaskOverdue(task)
            ).length;

        if (this.totalTasks) {
            this.totalTasks.textContent =
                total;
        }

        if (this.completedTasks) {
            this.completedTasks.textContent =
                completed;
        }

        if (this.pendingTasks) {
            this.pendingTasks.textContent =
                pending;
        }

        if (this.overdueTasks) {
            this.overdueTasks.textContent =
                overdue;
        }

        const percentage =
            total === 0
                ? 0
                : Math.round(
                      (completed / total) *
                          100
                  );

        if (this.progressPercent) {
            this.progressPercent.textContent =
                `${percentage}%`;
        }

        if (this.progressFill) {
            this.progressFill.style.width =
                `${percentage}%`;
        }

        if (this.progressText) {
            this.progressText.textContent =
                `${completed} of ${total} tasks completed`;
        }

        this.updateCategoryCounts();
        this.updateStreak();
        this.updateAchievements();
    }

    updateCategoryCounts() {
        const categories = {
            all: this.allCount,
            personal: this.personalCount,
            work: this.workCount,
            study: this.studyCount,
            health: this.healthCount,
            others: this.othersCount
        };

        Object.keys(categories).forEach(
            (category) => {
                const element =
                    categories[category];

                if (!element) return;

                if (category === "all") {
                    element.textContent =
                        this.tasks.length;
                } else {
                    element.textContent =
                        this.tasks.filter(
                            (task) =>
                                String(
                                    task.category
                                ).toLowerCase() ===
                                category
                        ).length;
                }
            }
        );
    }

    /* =========================================================
       STREAKS
       ========================================================= */

    updateStreak() {
        const completedDates =
            this.tasks
                .filter(
                    (task) =>
                        task.completed &&
                        task.completedAt
                )
                .map((task) =>
                    this.getDateKey(
                        new Date(
                            task.completedAt
                        )
                    )
                );

        const uniqueDates =
            [...new Set(completedDates)];

        uniqueDates.sort(
            (a, b) =>
                new Date(b) -
                new Date(a)
        );

        let streak = 0;
        let cursor = new Date();

        const todayKey =
            this.getDateKey(cursor);

        const yesterday =
            new Date(cursor);

        yesterday.setDate(
            yesterday.getDate() - 1
        );

        const yesterdayKey =
            this.getDateKey(yesterday);

        if (
            !uniqueDates.includes(
                todayKey
            ) &&
            !uniqueDates.includes(
                yesterdayKey
            )
        ) {
            streak = 0;
        } else {
            if (
                !uniqueDates.includes(
                    todayKey
                )
            ) {
                cursor = yesterday;
            }

            while (
                uniqueDates.includes(
                    this.getDateKey(cursor)
                )
            ) {
                streak++;

                cursor.setDate(
                    cursor.getDate() - 1
                );
            }
        }

        if (this.streakCount) {
            this.streakCount.textContent =
                streak;
        }

        const progress =
            Math.min(
                (streak / 7) * 100,
                100
            );

        if (this.streakProgress) {
            this.streakProgress.style.width =
                `${progress}%`;
        }

        if (this.streakMessage) {
            if (streak === 0) {
                this.streakMessage.textContent =
                    "Start your streak today!";
            } else if (streak < 3) {
                this.streakMessage.textContent =
                    "Keep going!";
            } else if (streak < 7) {
                this.streakMessage.textContent =
                    "You're on fire!";
            } else {
                this.streakMessage.textContent =
                    "Amazing consistency!";
            }
        }
    }

    updateAchievements() {
        const completed =
            this.tasks.filter(
                (task) => task.completed
            ).length;

        const achievements = [];

        if (completed >= 1) {
            achievements.push(
                "first-task"
            );
        }

        if (completed >= 5) {
            achievements.push(
                "five-tasks"
            );
        }

        if (completed >= 10) {
            achievements.push(
                "ten-tasks"
            );
        }

        if (completed >= 25) {
            achievements.push(
                "twenty-five-tasks"
            );
        }

        const data =
            this.getUserData();

        data.achievements =
            achievements;

        const key =
            this.getUserStorageKey();

        if (key) {
            localStorage.setItem(
                key,
                JSON.stringify({
                    ...data,
                    tasks: this.tasks
                })
            );
        }

        if (this.achievementCount) {
            this.achievementCount.textContent =
                achievements.length;
        }
    }

    /* =========================================================
       REMINDERS
       ========================================================= */

    requestNotificationPermission() {
        if (
            typeof Notification ===
                "undefined"
        ) {
            return;
        }

        if (
            Notification.permission ===
            "default"
        ) {
            Notification.requestPermission().catch(
                () => {}
            );
        }
    }

    startReminderChecker() {
        if (this.reminderInterval) {
            clearInterval(
                this.reminderInterval
            );
        }

        this.requestNotificationPermission();

        // Check immediately.
        this.checkReminders();

        // Check every 10 seconds.
        this.reminderInterval =
            setInterval(() => {
                this.checkReminders();
            }, 10000);
    }

    checkReminders() {
        if (!this.currentUser) return;

        let changed = false;

        const now =
            new Date();

        this.tasks.forEach((task) => {
            if (task.completed) {
                return;
            }

            if (
                !task.dueDate ||
                !task.dueTime
            ) {
                return;
            }

            if (
                !task.reminder ||
                task.reminder === "none"
            ) {
                return;
            }

            if (task.reminderSent) {
                return;
            }

            const reminderTime =
                this.getReminderTime(task);

            if (!reminderTime) {
                return;
            }

            if (
                now.getTime() >=
                reminderTime.getTime()
            ) {
                this.sendReminderNotification(
                    task
                );

                task.reminderSent = true;
                changed = true;
            }
        });

        if (changed) {
            this.saveUserData();
        }
    }

    sendReminderNotification(task) {
        const message =
            task.dueTime
                ? `"${task.title}" is due at ${this.formatTime(task.dueTime)}.`
                : `"${task.title}" is due soon.`;

        // In-app notification
        this.showToast(
            `Reminder: ${task.title}`,
            "info"
        );

        // Browser notification
        if (
            typeof Notification !==
                "undefined" &&
            Notification.permission ===
                "granted"
        ) {
            try {
                new Notification(
                    "WorkFlow Pro Reminder",
                    {
                        body: message,
                        icon: "./favicon.ico"
                    }
                );
            } catch (error) {
                console.log(
                    "Browser notification unavailable:",
                    error
                );
            }
        }
    }

    getReminderTime(task) {
        if (
            !task.dueDate ||
            !task.dueTime
        ) {
            return null;
        }

        const dueDateTime =
            new Date(
                `${task.dueDate}T${task.dueTime}`
            );

        if (
            Number.isNaN(
                dueDateTime.getTime()
            )
        ) {
            return null;
        }

        const minutes =
            this.getReminderMinutes(
                task.reminder
            );

        if (minutes === null) {
            return null;
        }

        return new Date(
            dueDateTime.getTime() -
                minutes * 60 * 1000
        );
    }

    getReminderMinutes(reminder) {
        if (
            reminder === null ||
            reminder === undefined ||
            reminder === "none"
        ) {
            return null;
        }

        const value =
            String(reminder)
                .trim()
                .toLowerCase();

        const number =
            parseFloat(value);

        if (Number.isNaN(number)) {
            return null;
        }

        if (
            value.includes("day") ||
            value.includes("24h")
        ) {
            return number * 24 * 60;
        }

        if (
            value.includes("hour") ||
            value.includes("hr") ||
            value.includes("h")
        ) {
            return number * 60;
        }

        return number;
    }

    formatReminder(reminder) {
        const minutes =
            this.getReminderMinutes(
                reminder
            );

        if (minutes === null) {
            return "No reminder";
        }

        if (minutes < 60) {
            return `${minutes} min before`;
        }

        if (
            minutes % 1440 ===
            0
        ) {
            return `${
                minutes / 1440
            } day before`;
        }

        return `${minutes / 60} hr before`;
    }

    /* =========================================================
       DATE / TIME
       ========================================================= */

    getTaskTimestamp(task) {
        if (!task.dueDate) {
            return Infinity;
        }

        const dateString =
            task.dueTime
                ? `${task.dueDate}T${task.dueTime}`
                : `${task.dueDate}T23:59`;

        const timestamp =
            new Date(
                dateString
            ).getTime();

        return Number.isNaN(timestamp)
            ? Infinity
            : timestamp;
    }

    isTaskOverdue(task) {
        if (
            task.completed ||
            !task.dueDate
        ) {
            return false;
        }

        return (
            this.getTaskTimestamp(task) <
            Date.now()
        );
    }

    formatTaskDueDate(task) {
        if (!task.dueDate) {
            return "";
        }

        const date =
            new Date(
                `${task.dueDate}T00:00`
            );

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "";
        }

        const dateText =
            date.toLocaleDateString(
                "en-IN",
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                }
            );

        if (task.dueTime) {
            return `${dateText} • ${this.formatTime(
                task.dueTime
            )}`;
        }

        return dateText;
    }

    formatTime(time) {
        if (!time) return "";

        const parts =
            time.split(":");

        if (parts.length < 2) {
            return time;
        }

        let hours =
            parseInt(parts[0], 10);

        const minutes =
            parts[1];

        if (Number.isNaN(hours)) {
            return time;
        }

        const period =
            hours >= 12
                ? "PM"
                : "AM";

        hours =
            hours % 12 || 12;

        return `${hours}:${minutes} ${period}`;
    }

    getDateKey(date) {
        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                date.getDate()
            ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    setMinimumDueDate() {
        if (!this.taskDueDate) return;

        const today =
            this.getDateKey(
                new Date()
            );

        this.taskDueDate.min =
            today;
    }

    /* =========================================================
       MODALS
       ========================================================= */

    openTaskModal() {
        if (!this.taskModal) return;

        this.taskModal.classList.remove(
            "hidden"
        );

        document.body.style.overflow =
            "hidden";

        setTimeout(() => {
            this.taskTitle?.focus();
        }, 100);
    }

    closeTaskModalWindow() {
        if (!this.taskModal) return;

        this.taskModal.classList.add(
            "hidden"
        );

        document.body.style.overflow =
            "";

        this.editingTaskId = null;
    }

    openConfirmModal(
        title,
        message,
        action
    ) {
        if (!this.confirmModal) return;

        if (this.confirmTitle) {
            this.confirmTitle.textContent =
                title;
        }

        if (this.confirmMessage) {
            this.confirmMessage.textContent =
                message;
        }

        this.confirmAction =
            action;

        this.confirmModal.classList.remove(
            "hidden"
        );

        document.body.style.overflow =
            "hidden";
    }

    closeConfirmModal() {
        if (!this.confirmModal) return;

        this.confirmModal.classList.add(
            "hidden"
        );

        this.confirmAction = null;

        document.body.style.overflow =
            "";
    }

    /* =========================================================
       MOBILE SIDEBAR
       ========================================================= */

    openMobileSidebar() {
        if (!this.sidebar) return;

        this.sidebar.classList.add(
            "open"
        );
    }

    closeMobileSidebar() {
        if (!this.sidebar) return;

        this.sidebar.classList.remove(
            "open"
        );
    }

    /* =========================================================
       THEME
       ========================================================= */

    toggleTheme() {
        const current =
            document.body.classList.contains(
                "dark-mode"
            );

        if (current) {
            document.body.classList.remove(
                "dark-mode"
            );

            localStorage.setItem(
                "workflow_theme",
                "light"
            );
        } else {
            document.body.classList.add(
                "dark-mode"
            );

            localStorage.setItem(
                "workflow_theme",
                "dark"
            );
        }

        this.updateThemeIcon();
    }

    loadTheme() {
        const saved =
            localStorage.getItem(
                "workflow_theme"
            );

        if (saved === "dark") {
            document.body.classList.add(
                "dark-mode"
            );
        } else {
            document.body.classList.remove(
                "dark-mode"
            );
        }

        this.updateThemeIcon();
    }

    updateThemeIcon() {
        if (!this.themeIcon) return;

        const dark =
            document.body.classList.contains(
                "dark-mode"
            );

        this.themeIcon.textContent =
            dark ? "☀" : "☾";
    }

    /* =========================================================
       TOAST
       ========================================================= */

    showToast(
        message,
        type = "info"
    ) {
        if (!this.toastContainer) {
            return;
        }

        const toast =
            document.createElement("div");

        toast.className =
            `toast toast-${type}`;

        toast.innerHTML = `
            <span class="toast-message">
                ${this.escapeHTML(message)}
            </span>

            <button
                type="button"
                class="toast-close"
                aria-label="Close"
            >
                ×
            </button>
        `;

        this.toastContainer.appendChild(
            toast
        );

        const closeButton =
            toast.querySelector(
                ".toast-close"
            );

        if (closeButton) {
            closeButton.addEventListener(
                "click",
                () => {
                    toast.remove();
                }
            );
        }

        setTimeout(() => {
            if (
                toast &&
                toast.parentNode
            ) {
                toast.remove();
            }
        }, 4500);
    }

    /* =========================================================
       HELPERS
       ========================================================= */

    capitalize(value) {
        if (!value) return "";

        return (
            String(value)
                .charAt(0)
                .toUpperCase() +
            String(value)
                .slice(1)
        );
    }

    escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    escapeAttribute(value) {
        return this.escapeHTML(value);
    }
}


/* =========================================================
   START APPLICATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        window.workFlowPro =
            new WorkFlowPro();

        // Load saved theme after DOM is ready.
        window.workFlowPro.loadTheme();
    }
);
