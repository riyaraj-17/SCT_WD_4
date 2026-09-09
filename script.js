/* =========================================================
   WORKFLOW PRO
   Complete JavaScript
   Matches the supplied index.html + style.css
   ========================================================= */

class WorkFlowPro {

    constructor() {
        this.currentUser = null;
        this.tasks = [];

        this.currentCategory = "all";
        this.statusFilter = "all";
        this.priorityFilter = "all";
        this.sortBy = "created-desc";
        this.searchQuery = "";

        this.editingTaskId = null;
        this.confirmAction = null;

        this.reminderInterval = null;

        this.init();
    }

    /* =====================================================
       INIT
       ===================================================== */

    init() {
        this.cacheElements();
        this.bindEvents();
        this.loadTheme();
        this.checkLoggedInUser();
    }

    /* =====================================================
       ELEMENTS
       ===================================================== */

    cacheElements() {

        /* AUTH */

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


        /* SIDEBAR */

        this.sidebar = document.getElementById("sidebar");
        this.closeSidebar = document.getElementById("closeSidebar");
        this.mobileMenu = document.getElementById("mobileMenu");

        this.userAvatar = document.getElementById("userAvatar");
        this.userName = document.getElementById("userName");
        this.userEmail = document.getElementById("userEmail");

        this.streakCount = document.getElementById("streakCount");
        this.streakProgress = document.getElementById("streakProgress");
        this.streakMessage = document.getElementById("streakMessage");


        /* NAVIGATION */

        this.navItems = document.querySelectorAll(
            ".nav-item[data-category]"
        );

        this.allCount = document.getElementById("allCount");
        this.personalCount = document.getElementById("personalCount");
        this.workCount = document.getElementById("workCount");
        this.studyCount = document.getElementById("studyCount");
        this.healthCount = document.getElementById("healthCount");
        this.othersCount = document.getElementById("othersCount");

        this.achievementCount =
            document.getElementById("achievementCount");


        /* HEADER */

        this.welcomeMessage =
            document.getElementById("welcomeMessage");

        this.currentDate =
            document.getElementById("currentDate");

        this.searchInput =
            document.getElementById("searchInput");

        this.newTaskBtn =
            document.getElementById("newTaskBtn");


        /* STATS */

        this.totalTasks =
            document.getElementById("totalTasks");

        this.completedTasks =
            document.getElementById("completedTasks");

        this.pendingTasks =
            document.getElementById("pendingTasks");

        this.overdueTasks =
            document.getElementById("overdueTasks");


        /* FILTERS */

        this.priorityFilterElement =
            document.getElementById("priorityFilter");

        this.statusFilterElement =
            document.getElementById("statusFilter");

        this.sortSelect =
            document.getElementById("sortSelect");


        /* TASKS */

        this.taskList =
            document.getElementById("taskList");

        this.emptyState =
            document.getElementById("emptyState");

        this.emptyAddBtn =
            document.getElementById("emptyAddBtn");

        this.emptyTitle =
            document.getElementById("emptyTitle");

        this.emptyMessage =
            document.getElementById("emptyMessage");

        this.sectionTitle =
            document.getElementById("sectionTitle");

        this.taskSummary =
            document.getElementById("taskSummary");


        /* TASK MODAL */

        this.taskModal =
            document.getElementById("taskModal");

        this.modalTitle =
            document.getElementById("modalTitle");

        this.closeTaskModal =
            document.getElementById("closeTaskModal");

        this.taskForm =
            document.getElementById("taskForm");

        this.taskId =
            document.getElementById("taskId");

        this.taskTitle =
            document.getElementById("taskTitle");

        this.taskNotes =
            document.getElementById("taskNotes");

        this.taskDueDate =
            document.getElementById("taskDueDate");

        this.taskDueTime =
            document.getElementById("taskDueTime");

        this.taskCategory =
            document.getElementById("taskCategory");

        this.taskPriority =
            document.getElementById("taskPriority");

        this.taskReminder =
            document.getElementById("taskReminder");

        this.cancelTaskBtn =
            document.getElementById("cancelTaskBtn");


        /* CONFIRM MODAL */

        this.confirmModal =
            document.getElementById("confirmModal");

        this.confirmTitle =
            document.getElementById("confirmTitle");

        this.confirmMessage =
            document.getElementById("confirmMessage");

        this.confirmCancel =
            document.getElementById("confirmCancel");

        this.confirmDelete =
            document.getElementById("confirmDelete");


        /* THEME */

        this.themeToggle =
            document.getElementById("themeToggle");

        this.themeIcon =
            document.getElementById("themeIcon");


        /* SIGN OUT */

        this.signOutBtn =
            document.getElementById("signOutBtn");


        /* PROGRESS */

        this.progressPercent =
            document.getElementById("progressPercent");

        this.progressFill =
            document.getElementById("progressFill");

        this.progressText =
            document.getElementById("progressText");


        /* TOAST */

        this.toastContainer =
            document.getElementById("toastContainer");
    }


    /* =====================================================
       EVENTS
       ===================================================== */

    bindEvents() {

        /* AUTH TABS */

        this.signInTab?.addEventListener(
            "click",
            () => this.showSignIn()
        );

        this.signUpTab?.addEventListener(
            "click",
            () => this.showSignUp()
        );


        /* AUTH FORMS */

        this.signInForm?.addEventListener(
            "submit",
            (event) => {
                event.preventDefault();
                this.signIn();
            }
        );

        this.signUpForm?.addEventListener(
            "submit",
            (event) => {
                event.preventDefault();
                this.signUp();
            }
        );


        /* PASSWORD TOGGLE */

        document
            .querySelectorAll(".password-toggle")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const targetId =
                            button.dataset.target;

                        const input =
                            document.getElementById(
                                targetId
                            );

                        if (!input) return;

                        if (
                            input.type === "password"
                        ) {
                            input.type = "text";
                            button.textContent = "🙈";
                        } else {
                            input.type = "password";
                            button.textContent = "👁";
                        }
                    }
                );
            });


        /* NAVIGATION */

        this.navItems.forEach(item => {

            item.addEventListener(
                "click",
                () => {

                    this.currentCategory =
                        item.dataset.category || "all";

                    this.updateNavigation();
                    this.renderTasks();

                    this.closeMobileSidebar();
                }
            );
        });


        /* SEARCH */

        this.searchInput?.addEventListener(
            "input",
            () => {

                this.searchQuery =
                    this.searchInput.value
                        .trim()
                        .toLowerCase();

                this.renderTasks();
            }
        );


        /* PRIORITY */

        this.priorityFilterElement?.addEventListener(
            "change",
            () => {

                this.priorityFilter =
                    this.priorityFilterElement.value;

                this.renderTasks();
            }
        );


        /* STATUS */

        this.statusFilterElement?.addEventListener(
            "change",
            () => {

                this.statusFilter =
                    this.statusFilterElement.value;

                this.renderTasks();
            }
        );


        /* SORT */

        this.sortSelect?.addEventListener(
            "change",
            () => {

                this.sortBy =
                    this.sortSelect.value;

                this.renderTasks();
            }
        );


        /* NEW TASK */

        this.newTaskBtn?.addEventListener(
            "click",
            () => this.openNewTaskModal()
        );


        /* EMPTY STATE CREATE TASK */

        this.emptyAddBtn?.addEventListener(
            "click",
            () => this.openNewTaskModal()
        );


        /* TASK MODAL */

        this.closeTaskModal?.addEventListener(
            "click",
            () => this.closeTaskModalWindow()
        );

        this.cancelTaskBtn?.addEventListener(
            "click",
            () => this.closeTaskModalWindow()
        );


        this.taskForm?.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();

                this.saveTask();
            }
        );


        /* CONFIRM MODAL */

        this.confirmCancel?.addEventListener(
            "click",
            () => this.closeConfirmModal()
        );

        this.confirmDelete?.addEventListener(
            "click",
            () => {

                if (
                    typeof this.confirmAction ===
                    "function"
                ) {
                    this.confirmAction();
                }

                this.closeConfirmModal();
            }
        );


        /* THEME */

        this.themeToggle?.addEventListener(
            "click",
            () => this.toggleTheme()
        );


        /* SIGN OUT */

        this.signOutBtn?.addEventListener(
            "click",
            () => this.signOut()
        );


        /* MOBILE */

        this.mobileMenu?.addEventListener(
            "click",
            () => this.openMobileSidebar()
        );

        this.closeSidebar?.addEventListener(
            "click",
            () => this.closeMobileSidebar()
        );


        /* CLICK OUTSIDE MODALS */

        window.addEventListener(
            "click",
            (event) => {

                if (
                    event.target ===
                    this.taskModal
                ) {
                    this.closeTaskModalWindow();
                }

                if (
                    event.target ===
                    this.confirmModal
                ) {
                    this.closeConfirmModal();
                }
            }
        );


        /* ESCAPE */

        document.addEventListener(
            "keydown",
            (event) => {

                if (event.key === "Escape") {
                    this.closeTaskModalWindow();
                    this.closeConfirmModal();
                }
            }
        );
    }


    /* =====================================================
       AUTH
       ===================================================== */

    checkLoggedInUser() {

        const saved =
            localStorage.getItem(
                "workflow_user"
            );

        if (!saved) {
            this.showAuth();
            return;
        }

        try {

            const user =
                JSON.parse(saved);

            if (
                !user ||
                !user.email ||
                !user.name
            ) {
                throw new Error(
                    "Invalid user"
                );
            }

            this.currentUser = user;

            this.loadUserData();
            this.showApp();

        } catch (error) {

            console.error(error);

            localStorage.removeItem(
                "workflow_user"
            );

            this.showAuth();
        }
    }


    showAuth() {

        this.authScreen?.classList.remove(
            "hidden"
        );

        this.app?.classList.add(
            "hidden"
        );
    }


    showApp() {

        this.authScreen?.classList.add(
            "hidden"
        );

        this.app?.classList.remove(
            "hidden"
        );

        this.updateUserUI();
        this.updateDate();
        this.updateNavigation();
        this.updateDashboard();
        this.renderTasks();

        this.startReminderChecker();
    }


    showSignIn() {

        this.signInTab?.classList.add(
            "active"
        );

        this.signUpTab?.classList.remove(
            "active"
        );

        this.signInForm?.classList.remove(
            "hidden"
        );

        this.signUpForm?.classList.add(
            "hidden"
        );
    }


    showSignUp() {

        this.signUpTab?.classList.add(
            "active"
        );

        this.signInTab?.classList.remove(
            "active"
        );

        this.signUpForm?.classList.remove(
            "hidden"
        );

        this.signInForm?.classList.add(
            "hidden"
        );
    }


    getUsers() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    "workflowUsers"
                ) || "[]"
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

        const name =
            this.signUpName?.value.trim();

        const email =
            this.signUpEmail?.value
                .trim()
                .toLowerCase();

        const password =
            this.signUpPassword?.value;


        if (
            !name ||
            !email ||
            !password
        ) {

            this.showToast(
                "Please fill in all fields.",
                "error"
            );

            return;
        }


        if (!this.isValidEmail(email)) {

            this.showToast(
                "Please enter a valid email.",
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


        const users =
            this.getUsers();


        if (
            users.some(
                user =>
                    user.email === email
            )
        ) {

            this.showToast(
                "An account with this email already exists.",
                "error"
            );

            return;
        }


        users.push({
            name,
            email,
            password
        });


        this.saveUsers(users);


        this.currentUser = {
            name,
            email
        };


        localStorage.setItem(
            "workflow_user",
            JSON.stringify(
                this.currentUser
            )
        );


        this.createFreshUserData();


        this.showToast(
            "Account created successfully!",
            "success"
        );


        setTimeout(
            () => this.showApp(),
            300
        );
    }


    signIn() {

        const email =
            this.signInEmail?.value
                .trim()
                .toLowerCase();

        const password =
            this.signInPassword?.value;


        if (!email || !password) {

            this.showToast(
                "Please enter your email and password.",
                "error"
            );

            return;
        }


        const users =
            this.getUsers();


        const user =
            users.find(
                item =>
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
            JSON.stringify(
                this.currentUser
            )
        );


        this.loadUserData();


        this.showToast(
            "Welcome back!",
            "success"
        );


        setTimeout(
            () => this.showApp(),
            300
        );
    }


    signOut() {

        this.saveUserData();

        if (this.reminderInterval) {

            clearInterval(
                this.reminderInterval
            );

            this.reminderInterval = null;
        }


        localStorage.removeItem(
            "workflow_user"
        );


        this.currentUser = null;
        this.tasks = [];


        this.showAuth();
        this.showSignIn();


        if (this.signInForm) {
            this.signInForm.reset();
        }

        if (this.signUpForm) {
            this.signUpForm.reset();
        }
    }


    isValidEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(email);
    }


    /* =====================================================
       USER DATA
       ===================================================== */

    getUserStorageKey() {

        if (!this.currentUser?.email) {
            return null;
        }

        const email =
            this.currentUser.email
                .toLowerCase()
                .trim()
                .replace(
                    /[^a-z0-9]/g,
                    "_"
                );

        return `workflowProData_${email}`;
    }


    createFreshUserData() {

        const key =
            this.getUserStorageKey();

        if (!key) return;

        const data = {
            tasks: [],
            achievements: []
        };

        localStorage.setItem(
            key,
            JSON.stringify(data)
        );

        this.tasks = [];
    }


    loadUserData() {

        const key =
            this.getUserStorageKey();

        if (!key) {

            this.tasks = [];

            return;
        }


        try {

            const data =
                JSON.parse(
                    localStorage.getItem(
                        key
                    ) || "null"
                );


            if (!data) {

                this.createFreshUserData();

                return;
            }


            this.tasks =
                Array.isArray(data.tasks)
                    ? data.tasks
                    : [];


            this.tasks =
                this.tasks.map(
                    task => ({
                        id:
                            task.id ||
                            this.generateId(),

                        title:
                            task.title ||
                            "Untitled Task",

                        notes:
                            task.notes || "",

                        dueDate:
                            task.dueDate || "",

                        dueTime:
                            task.dueTime || "",

                        category:
                            task.category ||
                            "personal",

                        priority:
                            task.priority ||
                            "medium",

                        reminder:
                            task.reminder ??
                            "none",

                        completed:
                            task.completed === true,

                        createdAt:
                            task.createdAt ||
                            new Date().toISOString(),

                        completedAt:
                            task.completedAt ||
                            null,

                        reminderSent:
                            task.reminderSent === true
                    })
                );

        } catch (error) {

            console.error(
                "Could not load data:",
                error
            );

            this.tasks = [];
        }
    }


    saveUserData() {

        const key =
            this.getUserStorageKey();

        if (!key) return;


        const oldData =
            this.getUserData();


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

        const key =
            this.getUserStorageKey();

        if (!key) {

            return {
                tasks: [],
                achievements: []
            };
        }


        try {

            return JSON.parse(
                localStorage.getItem(
                    key
                ) || "{}"
            );

        } catch {

            return {
                tasks: [],
                achievements: []
            };
        }
    }


    /* =====================================================
       UI
       ===================================================== */

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

            this.userAvatar.textContent =
                this.currentUser.name
                    .charAt(0)
                    .toUpperCase();
        }


        if (this.welcomeMessage) {

            const firstName =
                this.currentUser.name
                    .split(" ")[0];

            this.welcomeMessage.textContent =
                `Good day, ${firstName}! 👋`;
        }
    }


    updateDate() {

        if (!this.currentDate) return;

        this.currentDate.textContent =
            new Date().toLocaleDateString(
                "en-IN",
                {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );
    }


    updateNavigation() {

        this.navItems.forEach(item => {

            item.classList.toggle(
                "active",
                item.dataset.category ===
                    this.currentCategory
            );
        });


        const titles = {
            all: "All Tasks",
            personal: "Personal Tasks",
            work: "Work Tasks",
            study: "Study Tasks",
            health: "Health Tasks",
            others: "Other Tasks"
        };


        if (this.sectionTitle) {

            this.sectionTitle.textContent =
                titles[
                    this.currentCategory
                ] || "All Tasks";
        }


        this.updateCategoryCounts();
    }


    /* =====================================================
       TASK CRUD
       ===================================================== */

    generateId() {

        return (
            Date.now().toString(36) +
            Math.random()
                .toString(36)
                .substring(2, 8)
        );
    }


    openNewTaskModal() {

        this.editingTaskId = null;


        if (this.modalTitle) {
            this.modalTitle.textContent =
                "Create New Task";
        }


        this.taskForm?.reset();


        if (this.taskId) {
            this.taskId.value = "";
        }


        if (this.taskCategory) {
            this.taskCategory.value =
                "personal";
        }


        if (this.taskPriority) {
            this.taskPriority.value =
                "medium";
        }


        if (this.taskReminder) {
            this.taskReminder.value =
                "none";
        }


        this.setMinimumDueDate();

        this.openTaskModal();
    }


    openEditTaskModal(id) {

        const task =
            this.tasks.find(
                item => item.id === id
            );

        if (!task) return;


        this.editingTaskId = id;


        if (this.modalTitle) {
            this.modalTitle.textContent =
                "Edit Task";
        }


        if (this.taskId) {
            this.taskId.value =
                task.id;
        }


        if (this.taskTitle) {
            this.taskTitle.value =
                task.title;
        }


        if (this.taskNotes) {
            this.taskNotes.value =
                task.notes || "";
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
                String(
                    task.reminder ??
                    "none"
                );
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

            this.taskTitle?.focus();

            return;
        }


        const taskData = {

            title,

            notes:
                this.taskNotes?.value.trim() ||
                "",

            dueDate:
                this.taskDueDate?.value ||
                "",

            dueTime:
                this.taskDueTime?.value ||
                "",

            category:
                this.taskCategory?.value ||
                "personal",

            priority:
                this.taskPriority?.value ||
                "medium",

            reminder:
                this.taskReminder?.value ||
                "none"
        };


        /* EDIT */

        if (this.editingTaskId) {

            const index =
                this.tasks.findIndex(
                    task =>
                        task.id ===
                        this.editingTaskId
                );


            if (index !== -1) {

                this.tasks[index] = {

                    ...this.tasks[index],

                    ...taskData,

                    // New reminder settings
                    // should be checked again.
                    reminderSent: false
                };


                this.showToast(
                    "Task updated successfully.",
                    "success"
                );
            }

        }


        /* CREATE */

        else {

            const newTask = {

                id:
                    this.generateId(),

                ...taskData,

                completed: false,

                createdAt:
                    new Date().toISOString(),

                completedAt: null,

                reminderSent: false
            };


            this.tasks.push(
                newTask
            );


            this.showToast(
                "Task created successfully!",
                "success"
            );
        }


        this.saveUserData();

        this.closeTaskModalWindow();

        this.updateDashboard();

        this.renderTasks();
    }


    toggleTask(id) {

        const task =
            this.tasks.find(
                item => item.id === id
            );

        if (!task) return;


        task.completed =
            !task.completed;


        if (task.completed) {

            task.completedAt =
                new Date().toISOString();

            task.reminderSent = true;


            this.showToast(
                "Task completed!",
                "success"
            );

        } else {

            task.completedAt = null;

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


    deleteTask(id) {

        const task =
            this.tasks.find(
                item => item.id === id
            );

        if (!task) return;


        this.openConfirmModal(
            "Delete Task?",
            `Are you sure you want to delete "${task.title}"?`,
            () => {

                this.tasks =
                    this.tasks.filter(
                        item =>
                            item.id !== id
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


    /* =====================================================
       FILTERING
       ===================================================== */

    getFilteredTasks() {

        let result =
            [...this.tasks];


        /* CATEGORY */

        if (
            this.currentCategory !==
            "all"
        ) {

            result =
                result.filter(
                    task =>
                        String(
                            task.category
                        ).toLowerCase() ===
                        this.currentCategory
                            .toLowerCase()
                );
        }


        /* STATUS */

        if (
            this.statusFilter ===
            "pending"
        ) {

            result =
                result.filter(
                    task =>
                        task.completed !== true
                );
        }


        if (
            this.statusFilter ===
            "completed"
        ) {

            result =
                result.filter(
                    task =>
                        task.completed === true
                );
        }


        /* PRIORITY */

        if (
            this.priorityFilter !==
            "all"
        ) {

            result =
                result.filter(
                    task =>
                        task.priority ===
                        this.priorityFilter
                );
        }


        /* SEARCH */

        if (this.searchQuery) {

            result =
                result.filter(
                    task => {

                        const text =
                            [
                                task.title,
                                task.notes,
                                task.category,
                                task.priority
                            ]
                                .join(" ")
                                .toLowerCase();


                        return text.includes(
                            this.searchQuery
                        );
                    }
                );
        }


        /* SORT */

        result.sort(
            (a, b) => {

                switch (
                    this.sortBy
                ) {

                    case "created-asc":

                        return (
                            new Date(
                                a.createdAt
                            ) -
                            new Date(
                                b.createdAt
                            )
                        );


                    case "due-asc":

                        return (
                            this.getTaskTimestamp(
                                a
                            ) -
                            this.getTaskTimestamp(
                                b
                            )
                        );


                    case "priority": {

                        const order = {
                            high: 1,
                            medium: 2,
                            low: 3
                        };

                        return (
                            (order[
                                a.priority
                            ] || 4) -
                            (order[
                                b.priority
                            ] || 4)
                        );
                    }


                    case "title":

                        return a.title
                            .toLowerCase()
                            .localeCompare(
                                b.title
                                    .toLowerCase()
                            );


                    case "created-desc":

                    default:

                        return (
                            new Date(
                                b.createdAt
                            ) -
                            new Date(
                                a.createdAt
                            )
                        );
                }
            }
        );


        return result;
    }


    /* =====================================================
       RENDER TASKS
       ===================================================== */

    renderTasks() {

        if (!this.taskList) return;


        const tasks =
            this.getFilteredTasks();


        this.taskList.innerHTML = "";


        /* EMPTY */

        if (tasks.length === 0) {

            this.showEmptyState();

            return;
        }


        this.hideEmptyState();


        tasks.forEach(
            task => {

                const card =
                    this.createTaskCard(
                        task
                    );

                this.taskList.appendChild(
                    card
                );
            }
        );


        if (this.taskSummary) {

            this.taskSummary.textContent =
                `${tasks.length} ${
                    tasks.length === 1
                        ? "task"
                        : "tasks"
                }`;
        }
    }


    showEmptyState() {

        if (!this.emptyState) return;


        this.emptyState.classList.remove(
            "hidden"
        );


        if (
            this.statusFilter ===
            "completed"
        ) {

            this.emptyTitle.textContent =
                "No completed tasks";

            this.emptyMessage.textContent =
                "Complete a task and it will appear here.";

        } else if (
            this.statusFilter ===
            "pending"
        ) {

            this.emptyTitle.textContent =
                "No pending tasks";

            this.emptyMessage.textContent =
                "You're all caught up!";

        } else if (
            this.searchQuery
        ) {

            this.emptyTitle.textContent =
                "No tasks found";

            this.emptyMessage.textContent =
                "Try a different search.";

        } else {

            this.emptyTitle.textContent =
                "No tasks found";

            this.emptyMessage.textContent =
                "Create your first task to get started.";
        }
    }


    hideEmptyState() {

        this.emptyState?.classList.add(
            "hidden"
        );
    }


    createTaskCard(task) {

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "task-card";


        if (task.completed) {
            card.classList.add(
                "completed"
            );
        }


        const overdue =
            this.isTaskOverdue(
                task
            );


        const dueText =
            this.formatDueDate(
                task
            );


        card.innerHTML = `

            <button
                class="task-checkbox"
                type="button"
                data-action="toggle"
                data-id="${this.escape(task.id)}"
                aria-label="Complete task"
            >
                ${
                    task.completed
                        ? "✓"
                        : ""
                }
            </button>


            <div class="task-info">

                <div class="task-title-row">

                    <h3 class="task-title">
                        ${this.escape(
                            task.title
                        )}
                    </h3>

                </div>


                ${
                    task.notes
                        ? `
                            <p class="task-notes">
                                ${this.escape(
                                    task.notes
                                )}
                            </p>
                          `
                        : ""
                }


                <div class="task-meta">

                    <span class="task-tag">
                        ${this.escape(
                            this.capitalize(
                                task.category
                            )
                        )}
                    </span>


                    <span class="priority-badge ${
                        this.escape(
                            task.priority
                        )
                    }">
                        ${this.escape(
                            this.capitalize(
                                task.priority
                            )
                        )}
                    </span>


                    ${
                        dueText
                            ? `
                                <span class="due-badge ${
                                    overdue
                                        ? "overdue"
                                        : ""
                                }">
                                    ${this.escape(
                                        dueText
                                    )}
                                </span>
                              `
                            : ""
                    }


                    ${
                        task.reminder !==
                        "none"
                            ? `
                                <span class="task-tag">
                                    🔔 ${this.escape(
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
                    class="task-action"
                    type="button"
                    data-action="edit"
                    data-id="${this.escape(
                        task.id
                    )}"
                    title="Edit"
                >
                    ✎
                </button>


                <button
                    class="task-action delete"
                    type="button"
                    data-action="delete"
                    data-id="${this.escape(
                        task.id
                    )}"
                    title="Delete"
                >
                    🗑
                </button>

            </div>
        `;


        card
            .querySelectorAll(
                "[data-action]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        const action =
                            button.dataset.action;

                        const id =
                            button.dataset.id;


                        if (
                            action ===
                            "toggle"
                        ) {

                            this.toggleTask(
                                id
                            );
                        }


                        if (
                            action ===
                            "edit"
                        ) {

                            this.openEditTaskModal(
                                id
                            );
                        }


                        if (
                            action ===
                            "delete"
                        ) {

                            this.deleteTask(
                                id
                            );
                        }
                    }
                );
            });


        return card;
    }


    /* =====================================================
       DASHBOARD
       ===================================================== */

    updateDashboard() {

        const total =
            this.tasks.length;


        const completed =
            this.tasks.filter(
                task =>
                    task.completed === true
            ).length;


        const pending =
            this.tasks.filter(
                task =>
                    task.completed !== true
            ).length;


        const overdue =
            this.tasks.filter(
                task =>
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

        const elements = {

            all:
                this.allCount,

            personal:
                this.personalCount,

            work:
                this.workCount,

            study:
                this.studyCount,

            health:
                this.healthCount,

            others:
                this.othersCount
        };


        Object.entries(
            elements
        ).forEach(
            ([category, element]) => {

                if (!element) return;


                if (
                    category ===
                    "all"
                ) {

                    element.textContent =
                        this.tasks.length;

                } else {

                    element.textContent =
                        this.tasks.filter(
                            task =>
                                task.category ===
                                category
                        ).length;
                }
            }
        );
    }


    /* =====================================================
       STREAK
       ===================================================== */

    updateStreak() {

        const dates =
            this.tasks
                .filter(
                    task =>
                        task.completed &&
                        task.completedAt
                )
                .map(
                    task =>
                        this.getDateKey(
                            new Date(
                                task.completedAt
                            )
                        )
                );


        const uniqueDates =
            [...new Set(dates)];


        let streak = 0;

        let cursor =
            new Date();


        const today =
            this.getDateKey(
                cursor
            );


        const yesterdayDate =
            new Date();

        yesterdayDate.setDate(
            yesterdayDate.getDate() - 1
        );


        const yesterday =
            this.getDateKey(
                yesterdayDate
            );


        if (
            !uniqueDates.includes(today) &&
            !uniqueDates.includes(yesterday)
        ) {

            streak = 0;

        } else {

            if (
                !uniqueDates.includes(today)
            ) {

                cursor =
                    yesterdayDate;
            }


            while (
                uniqueDates.includes(
                    this.getDateKey(
                        cursor
                    )
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


        if (this.streakProgress) {

            this.streakProgress.style.width =
                `${Math.min(
                    streak * 14.28,
                    100
                )}%`;
        }


        if (this.streakMessage) {

            if (streak === 0) {

                this.streakMessage.textContent =
                    "Complete a task today to start your streak!";

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


    /* =====================================================
       ACHIEVEMENTS
       ===================================================== */

    updateAchievements() {

        const completed =
            this.tasks.filter(
                task => task.completed
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


        if (this.achievementCount) {

            this.achievementCount.textContent =
                achievements.length;
        }


        const key =
            this.getUserStorageKey();


        if (key) {

            const data =
                this.getUserData();


            localStorage.setItem(
                key,
                JSON.stringify({
                    ...data,
                    tasks: this.tasks,
                    achievements
                })
            );
        }
    }


    /* =====================================================
       REMINDERS
       ===================================================== */

    startReminderChecker() {

        if (this.reminderInterval) {

            clearInterval(
                this.reminderInterval
            );
        }


        this.requestNotificationPermission();


        this.checkReminders();


        this.reminderInterval =
            setInterval(
                () => {
                    this.checkReminders();
                },
                10000
            );
    }


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

            Notification
                .requestPermission()
                .catch(
                    () => {}
                );
        }
    }


    checkReminders() {

        if (!this.currentUser) {
            return;
        }


        let changed = false;


        const now =
            new Date();


        this.tasks.forEach(
            task => {

                if (
                    task.completed ||
                    task.reminder ===
                    "none" ||
                    !task.dueDate ||
                    !task.dueTime ||
                    task.reminderSent
                ) {
                    return;
                }


                const reminderTime =
                    this.getReminderTime(
                        task
                    );


                if (!reminderTime) {
                    return;
                }


                if (
                    now.getTime() >=
                    reminderTime.getTime()
                ) {

                    this.sendReminder(
                        task
                    );


                    task.reminderSent =
                        true;

                    changed = true;
                }
            }
        );


        if (changed) {
            this.saveUserData();
        }
    }


    sendReminder(task) {

        this.showToast(
            `Reminder: ${task.title}`,
            "warning"
        );


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
                        body:
                            `"${task.title}" is due at ${this.formatTime(
                                task.dueTime
                            )}.`
                    }
                );

            } catch (error) {

                console.log(
                    "Notification unavailable:",
                    error
                );
            }
        }
    }


    getReminderTime(task) {

        const due =
            new Date(
                `${task.dueDate}T${task.dueTime}`
            );


        if (
            Number.isNaN(
                due.getTime()
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
            due.getTime() -
            minutes *
            60 *
            1000
        );
    }


    getReminderMinutes(value) {

        if (
            value === null ||
            value === undefined ||
            value === "none"
        ) {
            return null;
        }


        const number =
            parseFloat(
                String(value)
            );


        if (Number.isNaN(number)) {
            return null;
        }


        return number;
    }


    formatReminder(value) {

        const minutes =
            this.getReminderMinutes(
                value
            );


        if (minutes === null) {
            return "";
        }


        if (
            minutes === 1440
        ) {

            return "1 day before";
        }


        if (
            minutes >= 60
        ) {

            return `${
                minutes / 60
            } hour${
                minutes / 60 === 1
                    ? ""
                    : "s"
            } before`;
        }


        return `${minutes} min before`;
    }


    /* =====================================================
       DATE
       ===================================================== */

    getTaskTimestamp(task) {

        if (!task.dueDate) {
            return Infinity;
        }


        const date =
            task.dueTime
                ? `${task.dueDate}T${task.dueTime}`
                : `${task.dueDate}T23:59`;


        const timestamp =
            new Date(
                date
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
            this.getTaskTimestamp(
                task
            ) < Date.now()
        );
    }


    formatDueDate(task) {

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


        let text =
            date.toLocaleDateString(
                "en-IN",
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                }
            );


        if (task.dueTime) {

            text +=
                ` • ${this.formatTime(
                    task.dueTime
                )}`;
        }


        return text;
    }


    formatTime(time) {

        if (!time) return "";


        const parts =
            time.split(":");


        let hours =
            parseInt(
                parts[0],
                10
            );


        const minutes =
            parts[1] || "00";


        if (
            Number.isNaN(hours)
        ) {
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

        if (!this.taskDueDate) {
            return;
        }


        this.taskDueDate.min =
            this.getDateKey(
                new Date()
            );
    }


    /* =====================================================
       MODALS
       ===================================================== */

    openTaskModal() {

        if (!this.taskModal) return;


        this.taskModal.classList.remove(
            "hidden"
        );


        document.body.style.overflow =
            "hidden";


        setTimeout(
            () => {
                this.taskTitle?.focus();
            },
            100
        );
    }


    closeTaskModalWindow() {

        if (!this.taskModal) {
            return;
        }


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

        if (!this.confirmModal) {
            return;
        }


        this.confirmTitle.textContent =
            title;


        this.confirmMessage.textContent =
            message;


        this.confirmAction =
            action;


        this.confirmModal.classList.remove(
            "hidden"
        );


        document.body.style.overflow =
            "hidden";
    }


    closeConfirmModal() {

        if (!this.confirmModal) {
            return;
        }


        this.confirmModal.classList.add(
            "hidden"
        );


        this.confirmAction = null;


        document.body.style.overflow =
            "";
    }


    /* =====================================================
       MOBILE
       ===================================================== */

    openMobileSidebar() {

        this.sidebar?.classList.add(
            "open"
        );
    }


    closeMobileSidebar() {

        this.sidebar?.classList.remove(
            "open"
        );
    }


    /* =====================================================
       DARK MODE
       ===================================================== */

    toggleTheme() {

        /*
         IMPORTANT:
         Your CSS uses body.dark
         NOT body.dark-mode.
        */

        document.body.classList.toggle(
            "dark"
        );


        const isDark =
            document.body.classList.contains(
                "dark"
            );


        localStorage.setItem(
            "workflow_theme",
            isDark
                ? "dark"
                : "light"
        );


        this.updateThemeIcon();
    }


    loadTheme() {

        const saved =
            localStorage.getItem(
                "workflow_theme"
            );


        if (saved === "dark") {

            document.body.classList.add(
                "dark"
            );

        } else {

            document.body.classList.remove(
                "dark"
            );
        }


        this.updateThemeIcon();
    }


    updateThemeIcon() {

        if (!this.themeIcon) {
            return;
        }


        const isDark =
            document.body.classList.contains(
                "dark"
            );


        this.themeIcon.textContent =
            isDark
                ? "☀️"
                : "🌙";
    }


    /* =====================================================
       TOAST
       ===================================================== */

    showToast(
        message,
        type = "info"
    ) {

        if (!this.toastContainer) {
            return;
        }


        const toast =
            document.createElement(
                "div"
            );


        toast.className =
            `toast ${type}`;


        toast.textContent =
            message;


        this.toastContainer.appendChild(
            toast
        );


        setTimeout(
            () => {

                toast.remove();

            },
            4000
        );
    }


    /* =====================================================
       HELPERS
       ===================================================== */

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


    escape(value) {

        return String(
            value ?? ""
        )
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );
    }
}


/* =========================================================
   START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        window.workFlowPro =
            new WorkFlowPro();

    }
);
