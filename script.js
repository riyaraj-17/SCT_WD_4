class WorkFlowPro {

    constructor() {

        this.tasks = [];

        this.streakData = {
            count: 0,
            lastCompletedDate: null
        };

        this.achievements = [];

        this.currentUser = null;

        this.currentCategory = "all";
        this.currentSearch = "";
        this.priorityFilter = "all";
        this.statusFilter = "all";
        this.sortBy = "created-desc";

        this.editingTaskId = null;
        this.deleteTaskId = null;

        this.reminderInterval = null;

        this.initDOM();
        this.checkAuth();
        this.initEventListeners();
        this.loadTheme();
    }


    /* ================= DOM ================= */

    initDOM() {

        this.authScreen =
            document.getElementById("authScreen");

        this.app =
            document.getElementById("app");

        this.signInTab =
            document.getElementById("signInTab");

        this.signUpTab =
            document.getElementById("signUpTab");

        this.signInForm =
            document.getElementById("signInForm");

        this.signUpForm =
            document.getElementById("signUpForm");

        this.signInEmail =
            document.getElementById("signInEmail");

        this.signInPassword =
            document.getElementById("signInPassword");

        this.signUpName =
            document.getElementById("signUpName");

        this.signUpEmail =
            document.getElementById("signUpEmail");

        this.signUpPassword =
            document.getElementById("signUpPassword");

        this.userName =
            document.getElementById("userName");

        this.userEmail =
            document.getElementById("userEmail");

        this.userAvatar =
            document.getElementById("userAvatar");

        this.welcomeMessage =
            document.getElementById("welcomeMessage");

        this.currentDate =
            document.getElementById("currentDate");

        this.taskList =
            document.getElementById("taskList");

        this.emptyState =
            document.getElementById("emptyState");

        this.emptyTitle =
            document.getElementById("emptyTitle");

        this.emptyMessage =
            document.getElementById("emptyMessage");

        this.taskModal =
            document.getElementById("taskModal");

        this.confirmModal =
            document.getElementById("confirmModal");

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

        this.modalTitle =
            document.getElementById("modalTitle");

        this.searchInput =
            document.getElementById("searchInput");

        this.priorityFilterElement =
            document.getElementById("priorityFilter");

        this.statusFilterElement =
            document.getElementById("statusFilter");

        this.sortSelect =
            document.getElementById("sortSelect");

        this.themeToggle =
            document.getElementById("themeToggle");

        this.themeIcon =
            document.getElementById("themeIcon");

        this.sidebar =
            document.getElementById("sidebar");

        this.toastContainer =
            document.getElementById("toastContainer");
    }


    /* ================= AUTH STORAGE ================= */

    getUsers() {

        const savedUsers =
            localStorage.getItem("workflowUsers");

        if (!savedUsers) {
            return [];
        }

        try {

            const users =
                JSON.parse(savedUsers);

            return Array.isArray(users)
                ? users
                : [];

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


    normalizeEmail(email) {

        return String(email || "")
            .trim()
            .toLowerCase();

    }


    /* ================= CURRENT USER ================= */

    getCurrentUser() {

        const saved =
            localStorage.getItem("workflow_user");

        if (!saved) {
            return null;
        }

        try {

            return JSON.parse(saved);

        } catch {

            localStorage.removeItem(
                "workflow_user"
            );

            return null;

        }
    }


    setCurrentUser(user) {

        localStorage.setItem(
            "workflow_user",
            JSON.stringify(user)
        );

    }


    /* ================= AUTH ================= */

    checkAuth() {

        const user =
            this.getCurrentUser();

        if (user) {

            this.showApp(user);

        } else {

            this.showAuth();

        }

    }


    showAuth() {

        this.authScreen
            .classList.remove("hidden");

        this.app
            .classList.add("hidden");

        this.currentUser = null;

        if (this.reminderInterval) {

            clearInterval(
                this.reminderInterval
            );

            this.reminderInterval = null;
        }

    }


    showApp(user) {

        this.authScreen
            .classList.add("hidden");

        this.app
            .classList.remove("hidden");

        this.currentUser = user;

        this.userName.textContent =
            user.name || "User";

        this.userEmail.textContent =
            user.email || "";

        this.userAvatar.textContent =
            (user.name || "U")
                .charAt(0)
                .toUpperCase();


        /* Reset filters */

        this.currentCategory = "all";
        this.currentSearch = "";
        this.priorityFilter = "all";
        this.statusFilter = "all";
        this.sortBy = "created-desc";


        if (this.searchInput) {
            this.searchInput.value = "";
        }

        if (this.priorityFilterElement) {
            this.priorityFilterElement.value = "all";
        }

        if (this.statusFilterElement) {
            this.statusFilterElement.value = "all";
        }

        if (this.sortSelect) {
            this.sortSelect.value = "created-desc";
        }


        document
            .querySelectorAll(".nav-item")
            .forEach(item => {

                item.classList.remove("active");

                if (
                    item.dataset.category === "all"
                ) {

                    item.classList.add("active");

                }

            });


        this.updateWelcome();

        /*
            Load only this user's data.
        */

        this.loadData();

        /*
            Start reminder checking.
        */

        this.startReminderChecker();

    }


    /* ================= EVENT LISTENERS ================= */

    initEventListeners() {

        /* AUTH TABS */

        this.signInTab.addEventListener(
            "click",
            () => {

                this.signInTab
                    .classList.add("active");

                this.signUpTab
                    .classList.remove("active");

                this.signInForm
                    .classList.remove("hidden");

                this.signUpForm
                    .classList.add("hidden");

            }
        );


        this.signUpTab.addEventListener(
            "click",
            () => {

                this.signUpTab
                    .classList.add("active");

                this.signInTab
                    .classList.remove("active");

                this.signUpForm
                    .classList.remove("hidden");

                this.signInForm
                    .classList.add("hidden");

            }
        );


        /* SIGN UP */

        this.signUpForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const name =
                    this.signUpName.value.trim();

                const email =
                    this.normalizeEmail(
                        this.signUpEmail.value
                    );

                const password =
                    this.signUpPassword.value;


                if (!name) {

                    this.showToast(
                        "Please enter your name.",
                        "error"
                    );

                    return;

                }


                if (!email) {

                    this.showToast(
                        "Please enter your email.",
                        "error"
                    );

                    return;

                }


                if (password.length < 6) {

                    this.showToast(
                        "Password must contain at least 6 characters.",
                        "error"
                    );

                    return;

                }


                const users =
                    this.getUsers();


                const existingUser =
                    users.find(
                        user =>
                            this.normalizeEmail(
                                user.email
                            ) === email
                    );


                if (existingUser) {

                    this.showToast(
                        "An account with this email already exists.",
                        "error"
                    );

                    return;

                }


                const user = {

                    name,

                    email,

                    password,

                    created:
                        new Date().toISOString()

                };


                users.push(user);

                this.saveUsers(users);


                this.setCurrentUser(user);

                /*
                    Set currentUser BEFORE
                    creating user data.
                */

                this.currentUser = user;


                this.createFreshUserData();


                this.signUpForm.reset();


                this.showToast(
                    "Account created successfully!",
                    "success"
                );


                this.showApp(user);

            }
        );


        /* SIGN IN */

        this.signInForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const email =
                    this.normalizeEmail(
                        this.signInEmail.value
                    );

                const password =
                    this.signInPassword.value;


                const users =
                    this.getUsers();


                const user =
                    users.find(
                        account =>
                            this.normalizeEmail(
                                account.email
                            ) === email &&
                            account.password ===
                                password
                    );


                if (!user) {

                    this.showToast(
                        "Incorrect email or password.",
                        "error"
                    );

                    return;

                }


                this.setCurrentUser(user);

                this.showApp(user);

                this.signInForm.reset();

                this.showToast(
                    `Welcome back, ${user.name}! 👋`,
                    "success"
                );

            }
        );


        /* PASSWORD TOGGLE */

        document
            .querySelectorAll(".password-toggle")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const target =
                            document.getElementById(
                                button.dataset.target
                            );

                        if (!target) {
                            return;
                        }


                        if (
                            target.type ===
                            "password"
                        ) {

                            target.type =
                                "text";

                            button.textContent =
                                "🙈";

                        } else {

                            target.type =
                                "password";

                            button.textContent =
                                "👁";

                        }

                    }
                );

            });


        /* SIGN OUT */

        const signOutBtn =
            document.getElementById(
                "signOutBtn"
            );

        if (signOutBtn) {

            signOutBtn.addEventListener(
                "click",
                () => {

                    if (this.reminderInterval) {

                        clearInterval(
                            this.reminderInterval
                        );

                        this.reminderInterval =
                            null;

                    }


                    localStorage.removeItem(
                        "workflow_user"
                    );


                    this.currentUser = null;


                    this.showToast(
                        "Signed out successfully.",
                        "success"
                    );


                    setTimeout(
                        () => {

                            this.showAuth();

                        },
                        300
                    );

                }
            );

        }


        /* THEME */

        this.themeToggle.addEventListener(
            "click",
            () => this.toggleTheme()
        );


        /* NEW TASK */

        const newTaskBtn =
            document.getElementById(
                "newTaskBtn"
            );

        if (newTaskBtn) {

            newTaskBtn.addEventListener(
                "click",
                () => this.openTaskModal()
            );

        }


        const emptyAddBtn =
            document.getElementById(
                "emptyAddBtn"
            );

        if (emptyAddBtn) {

            emptyAddBtn.addEventListener(
                "click",
                () => this.openTaskModal()
            );

        }


        /* CLOSE MODAL */

        const closeTaskModal =
            document.getElementById(
                "closeTaskModal"
            );

        if (closeTaskModal) {

            closeTaskModal.addEventListener(
                "click",
                () => this.closeTaskModal()
            );

        }


        const cancelTaskBtn =
            document.getElementById(
                "cancelTaskBtn"
            );

        if (cancelTaskBtn) {

            cancelTaskBtn.addEventListener(
                "click",
                () => this.closeTaskModal()
            );

        }


        /* TASK FORM */

        this.taskForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                this.saveTask();

            }
        );


        /* SEARCH */

        this.searchInput.addEventListener(
            "input",
            event => {

                this.currentSearch =
                    event.target.value
                        .trim()
                        .toLowerCase();

                this.renderTasks();

            }
        );


        /* PRIORITY FILTER */

        this.priorityFilterElement
            .addEventListener(
                "change",
                event => {

                    this.priorityFilter =
                        event.target.value
                            .trim()
                            .toLowerCase();

                    this.renderTasks();

                }
            );


        /* STATUS FILTER */

        this.statusFilterElement
            .addEventListener(
                "change",
                event => {

                    this.statusFilter =
                        event.target.value
                            .trim()
                            .toLowerCase();


                    /*
                        Only allow valid values.
                    */

                    if (
                        this.statusFilter !== "all" &&
                        this.statusFilter !== "pending" &&
                        this.statusFilter !== "completed"
                    ) {

                        this.statusFilter =
                            "all";

                    }


                    this.renderTasks();

                }
            );


        /* SORT */

        this.sortSelect.addEventListener(
            "change",
            event => {

                this.sortBy =
                    event.target.value;

                this.renderTasks();

            }
        );


        /* CATEGORY */

        document
            .querySelectorAll(".nav-item")
            .forEach(item => {

                item.addEventListener(
                    "click",
                    () => {

                        document
                            .querySelectorAll(
                                ".nav-item"
                            )
                            .forEach(nav =>
                                nav.classList.remove(
                                    "active"
                                )
                            );


                        item.classList.add(
                            "active"
                        );


                        this.currentCategory =
                            item.dataset.category ||
                            "all";


                        this.updateSectionTitle();

                        this.renderTasks();


                        this.sidebar
                            .classList.remove(
                                "open"
                            );

                    }
                );

            });


        /* CONFIRM DELETE */

        const confirmCancel =
            document.getElementById(
                "confirmCancel"
            );

        if (confirmCancel) {

            confirmCancel.addEventListener(
                "click",
                () => {

                    this.deleteTaskId =
                        null;

                    this.confirmModal
                        .classList.add(
                            "hidden"
                        );

                }
            );

        }


        const confirmDelete =
            document.getElementById(
                "confirmDelete"
            );

        if (confirmDelete) {

            confirmDelete.addEventListener(
                "click",
                () => this.confirmDelete()
            );

        }


        /* MOBILE MENU */

        const mobileMenu =
            document.getElementById(
                "mobileMenu"
            );

        if (mobileMenu) {

            mobileMenu.addEventListener(
                "click",
                () => {

                    this.sidebar
                        .classList.add(
                            "open"
                        );

                }
            );

        }


        const closeSidebar =
            document.getElementById(
                "closeSidebar"
            );

        if (closeSidebar) {

            closeSidebar.addEventListener(
                "click",
                () => {

                    this.sidebar
                        .classList.remove(
                            "open"
                        );

                }
            );

        }


        /* CLOSE TASK MODAL OUTSIDE */

        this.taskModal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    this.taskModal
                ) {

                    this.closeTaskModal();

                }

            }
        );


        /* CLOSE CONFIRM MODAL OUTSIDE */

        this.confirmModal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    this.confirmModal
                ) {

                    this.confirmModal
                        .classList.add(
                            "hidden"
                        );

                }

            }
        );


        /* KEYBOARD */

        document.addEventListener(
            "keydown",
            event => {

                if (event.key === "Escape") {

                    this.closeTaskModal();

                    this.confirmModal
                        .classList.add(
                            "hidden"
                        );

                }


                if (
                    event.ctrlKey &&
                    event.key.toLowerCase() === "k"
                ) {

                    event.preventDefault();

                    this.searchInput.focus();

                }


                if (
                    event.ctrlKey &&
                    event.key.toLowerCase() === "n"
                ) {

                    event.preventDefault();

                    this.openTaskModal();

                }

            }
        );

    }


    /* ================= USER DATA ================= */

    getUserDataKey() {

        if (
            !this.currentUser ||
            !this.currentUser.email
        ) {

            return null;

        }


        const email =
            this.normalizeEmail(
                this.currentUser.email
            );


        return `workflowProData_${email}`;

    }


    createFreshUserData() {

        const dataKey =
            this.getUserDataKey();

        if (!dataKey) {
            return;
        }


        this.tasks = [];

        this.streakData = {
            count: 0,
            lastCompletedDate: null
        };

        this.achievements = [];


        this.saveData();

    }


    loadData() {

        const dataKey =
            this.getUserDataKey();


        if (!dataKey) {

            this.tasks = [];

            this.streakData = {
                count: 0,
                lastCompletedDate: null
            };

            this.achievements = [];

            this.renderAll();

            return;

        }


        const saved =
            localStorage.getItem(dataKey);


        if (saved) {

            try {

                const data =
                    JSON.parse(saved);


                this.tasks =
                    Array.isArray(data.tasks)
                        ? data.tasks
                        : [];


                this.streakData =
                    data.streakData || {
                        count: 0,
                        lastCompletedDate: null
                    };


                this.achievements =
                    Array.isArray(
                        data.achievements
                    )
                        ? data.achievements
                        : [];


                /*
                    Make sure old tasks have
                    reminderSent property.
                */

                this.tasks =
                    this.tasks.map(task => ({
                        ...task,
                        reminderSent:
                            task.reminderSent === true
                    }));


            } catch (error) {

                console.error(
                    "Error loading user data:",
                    error
                );


                this.tasks = [];

                this.streakData = {
                    count: 0,
                    lastCompletedDate: null
                };

                this.achievements = [];

                this.saveData();

            }

        } else {

            /*
                Brand new user.
                Start completely empty.
            */

            this.tasks = [];

            this.streakData = {
                count: 0,
                lastCompletedDate: null
            };

            this.achievements = [];

            this.saveData();

        }


        this.renderAll();

    }


    saveData() {

        const dataKey =
            this.getUserDataKey();


        if (!dataKey) {
            return;
        }


        localStorage.setItem(
            dataKey,
            JSON.stringify({

                tasks:
                    this.tasks,

                streakData:
                    this.streakData,

                achievements:
                    this.achievements

            })
        );

    }


    /* ================= TASK CRUD ================= */

    saveTask() {

        const title =
            this.taskTitle.value.trim();


        if (!title) {

            this.showToast(
                "Please enter a task title.",
                "error"
            );

            return;

        }


        const taskData = {

            title,

            notes:
                this.taskNotes.value.trim(),

            dueDate:
                this.taskDueDate.value,

            dueTime:
                this.taskDueTime.value,

            category:
                this.taskCategory.value,

            priority:
                this.taskPriority.value,

            reminder:
                this.taskReminder.value

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

                    /*
                        Reset reminder when
                        task details change.
                    */

                    reminderSent: false,

                    updated:
                        new Date().toISOString()

                };

            }


            this.showToast(
                "Task updated successfully.",
                "success"
            );

        }


        /* CREATE */

        else {

            const task = {

                id:
                    this.generateId(),

                ...taskData,

                completed:
                    false,

                created:
                    new Date().toISOString(),

                reminderSent:
                    false

            };


            this.tasks.unshift(task);


            this.showToast(
                "Task created successfully.",
                "success"
            );

        }


        this.saveData();

        this.closeTaskModal();

        this.renderAll();


        /*
            Request browser notification
            permission when a reminder is used.
        */

        if (
            taskData.reminder &&
            taskData.reminder !== "none"
        ) {

            this.requestNotificationPermission();

        }


        /*
            Check immediately in case
            reminder time has already arrived.
        */

        this.checkReminders();

    }


    toggleTask(id) {

        const task =
            this.tasks.find(
                item =>
                    item.id === id
            );


        if (!task) {
            return;
        }


        task.completed =
            !task.completed;


        if (task.completed) {

            /*
                If completed, make sure
                its reminder cannot fire.
            */

            task.reminderSent = true;


            this.updateStreak();


            this.showToast(
                "Task completed! 🎉",
                "success"
            );

        } else {

            /*
                If task is marked pending again,
                allow its reminder to work again.
            */

            task.reminderSent = false;


            this.showToast(
                "Task marked as pending.",
                "warning"
            );

        }


        this.saveData();

        this.renderAll();

        this.checkReminders();

    }


    editTask(id) {

        const task =
            this.tasks.find(
                item =>
                    item.id === id
            );


        if (!task) {
            return;
        }


        this.editingTaskId = id;


        this.modalTitle.textContent =
            "Edit Task";


        this.taskId.value =
            id;


        this.taskTitle.value =
            task.title || "";


        this.taskNotes.value =
            task.notes || "";


        this.taskDueDate.value =
            task.dueDate || "";


        this.taskDueTime.value =
            task.dueTime || "";


        this.taskCategory.value =
            task.category || "personal";


        this.taskPriority.value =
            task.priority || "medium";


        this.taskReminder.value =
            task.reminder || "none";


        this.taskModal
            .classList.remove("hidden");


        setTimeout(
            () => this.taskTitle.focus(),
            100
        );

    }


    askDeleteTask(id) {

        const task =
            this.tasks.find(
                item =>
                    item.id === id
            );


        if (!task) {
            return;
        }


        this.deleteTaskId = id;


        const confirmMessage =
            document.getElementById(
                "confirmMessage"
            );


        if (confirmMessage) {

            confirmMessage.textContent =
                `Delete "${task.title}"? This action cannot be undone.`;

        }


        this.confirmModal
            .classList.remove("hidden");

    }


    confirmDelete() {

        if (!this.deleteTaskId) {
            return;
        }


        this.tasks =
            this.tasks.filter(
                task =>
                    task.id !==
                    this.deleteTaskId
            );


        this.saveData();


        this.confirmModal
            .classList.add("hidden");


        this.deleteTaskId = null;


        this.showToast(
            "Task deleted.",
            "success"
        );


        this.renderAll();

    }


    /* ================= MODALS ================= */

    openTaskModal() {

        this.editingTaskId = null;


        this.modalTitle.textContent =
            "Create New Task";


        this.taskForm.reset();


        this.taskId.value = "";


        this.taskCategory.value =
            "personal";


        this.taskPriority.value =
            "medium";


        this.taskReminder.value =
            "none";


        this.taskModal
            .classList.remove("hidden");


        setTimeout(
            () => this.taskTitle.focus(),
            100
        );

    }


    closeTaskModal() {

        this.taskModal
            .classList.add("hidden");


        this.editingTaskId = null;


        this.taskForm.reset();

    }


    /* ================= RENDER ================= */

    renderAll() {

        this.renderTasks();

        this.renderStats();

        this.renderCounts();

        this.renderProgress();

        this.renderStreak();

        this.renderAchievements();

        this.updateSectionTitle();

    }


    renderTasks() {

        let filtered =
            [...this.tasks];


        /* CATEGORY */

        if (
            this.currentCategory !==
            "all"
        ) {

            filtered =
                filtered.filter(
                    task =>
                        task.category ===
                        this.currentCategory
                );

        }


        /* SEARCH */

        if (this.currentSearch) {

            filtered =
                filtered.filter(task => {

                    const searchable =
                        [

                            task.title,

                            task.notes,

                            task.category,

                            task.priority

                        ]
                        .join(" ")
                        .toLowerCase();


                    return searchable.includes(
                        this.currentSearch
                    );

                });

        }


        /* PRIORITY */

        if (
            this.priorityFilter !==
            "all"
        ) {

            filtered =
                filtered.filter(
                    task =>
                        task.priority ===
                        this.priorityFilter
                );

        }


        /* STATUS */

        if (
            this.statusFilter !==
            "all"
        ) {

            if (
                this.statusFilter ===
                "completed"
            ) {

                filtered =
                    filtered.filter(
                        task =>
                            task.completed ===
                            true
                    );

            } else if (
                this.statusFilter ===
                "pending"
            ) {

                filtered =
                    filtered.filter(
                        task =>
                            task.completed !==
                            true
                    );

            }

        }


        /* SORT */

        filtered.sort(
            (a, b) =>
                this.compareTasks(a, b)
        );


        this.taskList.innerHTML = "";


        if (filtered.length === 0) {

            this.emptyState
                .classList.remove("hidden");


            if (this.tasks.length === 0) {

                this.emptyTitle.textContent =
                    "No tasks yet";


                this.emptyMessage.textContent =
                    "Create your first task to get started.";

            } else {

                this.emptyTitle.textContent =
                    "No matching tasks";


                this.emptyMessage.textContent =
                    "Try changing your filters or search.";

            }


            return;

        }


        this.emptyState
            .classList.add("hidden");


        filtered.forEach(
            task => {

                this.taskList
                    .appendChild(
                        this.createTaskElement(
                            task
                        )
                    );

            }
        );

    }


    createTaskElement(task) {

        const card =
            document.createElement("div");


        card.className =
            `task-card ${
                task.completed
                    ? "completed"
                    : ""
            }`;


        const overdue =
            this.isOverdue(task);


        card.innerHTML = `

            <button
                class="task-checkbox"
                data-action="toggle"
                data-id="${task.id}"
                aria-label="${
                    task.completed
                        ? "Mark task as pending"
                        : "Complete task"
                }"
            >
                ${task.completed ? "✓" : ""}
            </button>


            <div class="task-info">

                <div class="task-title-row">

                    <span class="task-title">
                        ${this.escapeHtml(
                            task.title
                        )}
                    </span>

                </div>


                ${
                    task.notes
                        ? `
                            <div class="task-notes">
                                ${this.escapeHtml(
                                    task.notes
                                )}
                            </div>
                        `
                        : ""
                }


                <div class="task-meta">

                    <span class="task-tag">
                        ${this.categoryIcon(
                            task.category
                        )}

                        ${this.capitalize(
                            task.category
                        )}
                    </span>


                    <span
                        class="priority-badge ${
                            task.priority
                        }"
                    >
                        ${this.capitalize(
                            task.priority
                        )}
                    </span>


                    ${
                        task.dueDate
                            ? `
                                <span
                                    class="due-badge ${
                                        overdue &&
                                        !task.completed
                                            ? "overdue"
                                            : ""
                                    }"
                                >
                                    📅
                                    ${this.formatDueDate(
                                        task
                                    )}
                                </span>
                            `
                            : ""
                    }

                    ${
                        task.reminder &&
                        task.reminder !== "none"
                            ? `
                                <span class="reminder-badge">
                                    🔔
                                </span>
                            `
                            : ""
                    }

                </div>

            </div>


            <div class="task-actions">

                <button
                    class="task-action"
                    data-action="edit"
                    data-id="${task.id}"
                    title="Edit"
                >
                    ✏️
                </button>


                <button
                    class="task-action delete"
                    data-action="delete"
                    data-id="${task.id}"
                    title="Delete"
                >
                    🗑️
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

                            this.toggleTask(id);

                        }


                        if (
                            action ===
                            "edit"
                        ) {

                            this.editTask(id);

                        }


                        if (
                            action ===
                            "delete"
                        ) {

                            this.askDeleteTask(id);

                        }

                    }
                );

            });


        return card;

    }


    /* ================= STATS ================= */

    renderStats() {

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
                    this.isOverdue(task)
            ).length;


        const totalElement =
            document.getElementById(
                "totalTasks"
            );

        const completedElement =
            document.getElementById(
                "completedTasks"
            );

        const pendingElement =
            document.getElementById(
                "pendingTasks"
            );

        const overdueElement =
            document.getElementById(
                "overdueTasks"
            );


        if (totalElement) {
            totalElement.textContent =
                total;
        }


        if (completedElement) {
            completedElement.textContent =
                completed;
        }


        if (pendingElement) {
            pendingElement.textContent =
                pending;
        }


        if (overdueElement) {
            overdueElement.textContent =
                overdue;
        }

    }


    renderCounts() {

        const categories = [

            "personal",

            "work",

            "study",

            "health",

            "others"

        ];


        const allCount =
            document.getElementById(
                "allCount"
            );


        if (allCount) {

            allCount.textContent =
                this.tasks.filter(
                    task =>
                        !task.completed
                ).length;

        }


        categories.forEach(
            category => {

                const element =
                    document.getElementById(
                        `${category}Count`
                    );


                if (element) {

                    element.textContent =
                        this.tasks.filter(
                            task =>
                                task.category ===
                                    category &&
                                !task.completed
                        ).length;

                }

            }
        );

    }


    renderProgress() {

        const total =
            this.tasks.length;


        const completed =
            this.tasks.filter(
                task =>
                    task.completed === true
            ).length;


        const percentage =
            total === 0
                ? 0
                : Math.round(
                    (completed / total) *
                    100
                );


        const percentElement =
            document.getElementById(
                "progressPercent"
            );

        const progressFill =
            document.getElementById(
                "progressFill"
            );

        const progressText =
            document.getElementById(
                "progressText"
            );


        if (percentElement) {

            percentElement.textContent =
                `${percentage}%`;

        }


        if (progressFill) {

            progressFill.style.width =
                `${percentage}%`;

        }


        if (progressText) {

            progressText.textContent =
                `${completed} of ${total} tasks completed`;

        }

    }


    /* ================= STREAK ================= */

    updateStreak() {

        const today =
            this.getToday();


        if (
            this.streakData
                .lastCompletedDate ===
            today
        ) {

            return;

        }


        const yesterday =
            this.getDateOffset(-1);


        if (
            this.streakData
                .lastCompletedDate ===
            yesterday
        ) {

            this.streakData.count++;

        } else {

            this.streakData.count = 1;

        }


        this.streakData
            .lastCompletedDate =
            today;

    }


    renderStreak() {

        const count =
            this.streakData.count || 0;


        const streakCount =
            document.getElementById(
                "streakCount"
            );

        const streakProgress =
            document.getElementById(
                "streakProgress"
            );

        const streakMessage =
            document.getElementById(
                "streakMessage"
            );


        if (streakCount) {

            streakCount.textContent =
                count;

        }


        const progress =
            Math.min(
                (count / 7) * 100,
                100
            );


        if (streakProgress) {

            streakProgress.style.width =
                `${progress}%`;

        }


        let message =
            "Complete a task today to start your streak!";


        if (count === 1) {

            message =
                "Great start! Keep going 🔥";

        } else if (count < 7 && count > 1) {

            message =
                `${7 - count} more day${
                    7 - count === 1
                        ? ""
                        : "s"
                } to reach a 7-day streak!`;

        } else if (count >= 7) {

            message =
                "Amazing! You're on fire! 🔥";

        }


        if (streakMessage) {

            streakMessage.textContent =
                message;

        }

    }


    /* ================= ACHIEVEMENTS ================= */

    renderAchievements() {

        const completed =
            this.tasks.filter(
                task =>
                    task.completed === true
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


        if (
            this.streakData.count >= 7
        ) {

            achievements.push(
                "seven-day"
            );

        }


        this.achievements =
            achievements;


        /*
            Save only if user exists.
        */

        if (this.currentUser) {

            this.saveData();

        }


        const achievementCount =
            document.getElementById(
                "achievementCount"
            );


        if (achievementCount) {

            achievementCount.textContent =
                achievements.length;

        }

    }


    /* ================= SECTION ================= */

    updateSectionTitle() {

        const names = {

            all: "All Tasks",

            personal: "Personal",

            work: "Work",

            study: "Study",

            health: "Health",

            others: "Others"

        };


        const title =
            names[this.currentCategory] ||
            "All Tasks";


        const sectionTitle =
            document.getElementById(
                "sectionTitle"
            );

        const taskSummary =
            document.getElementById(
                "taskSummary"
            );


        if (sectionTitle) {

            sectionTitle.textContent =
                title;

        }


        if (taskSummary) {

            taskSummary.textContent =
                `${this.tasks.length} task${
                    this.tasks.length === 1
                        ? ""
                        : "s"
                } in your workspace`;

        }

    }


    /* ================= THEME ================= */

    loadTheme() {

        const theme =
            localStorage.getItem(
                "workflow_theme"
            );


        if (theme === "dark") {

            document.body
                .classList.add("dark");


            this.themeIcon.textContent =
                "☀️";

        } else {

            document.body
                .classList.remove("dark");


            this.themeIcon.textContent =
                "🌙";

        }

    }


    toggleTheme() {

        const isDark =
            document.body
                .classList.toggle("dark");


        localStorage.setItem(
            "workflow_theme",
            isDark
                ? "dark"
                : "light"
        );


        this.themeIcon.textContent =
            isDark
                ? "☀️"
                : "🌙";

    }


    /* ================= DATE ================= */

    updateWelcome() {

        const hour =
            new Date().getHours();


        let greeting =
            "Good evening";


        if (hour < 12) {

            greeting =
                "Good morning";

        } else if (hour < 17) {

            greeting =
                "Good afternoon";

        }


        this.welcomeMessage.textContent =
            `${greeting}! 👋`;


        const now =
            new Date();


        this.currentDate.textContent =
            now.toLocaleDateString(
                "en-IN",
                {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );

    }


    getToday() {

        const date =
            new Date();


        return this.formatDate(
            date
        );

    }


    getDateOffset(days) {

        const date =
            new Date();


        date.setDate(
            date.getDate() + days
        );


        return this.formatDate(
            date
        );

    }


    formatDate(date) {

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


    formatDueDate(task) {

        if (!task.dueDate) {

            return "";

        }


        const date =
            new Date(
                `${task.dueDate}T${
                    task.dueTime ||
                    "00:00"
                }`
            );


        const today =
            this.getToday();


        if (
            task.dueDate ===
            today
        ) {

            return task.dueTime
                ? `Today ${task.dueTime}`
                : "Today";

        }


        return date.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short"
            }
        );

    }


    isOverdue(task) {

        if (
            !task.dueDate ||
            task.completed
        ) {

            return false;

        }


        const due =
            new Date(
                `${task.dueDate}T${
                    task.dueTime ||
                    "23:59"
                }`
            );


        return due < new Date();

    }


    /* ================= SORT ================= */

    compareTasks(a, b) {

        switch (this.sortBy) {

            case "created-asc":

                return (
                    new Date(a.created) -
                    new Date(b.created)
                );


            case "due-asc":

                return (
                    this.getTaskDate(a) -
                    this.getTaskDate(b)
                );


            case "priority": {

                const order = {

                    high: 1,

                    medium: 2,

                    low: 3

                };


                return (
                    (order[a.priority] || 99) -
                    (order[b.priority] || 99)
                );

            }


            case "title":

                return a.title.localeCompare(
                    b.title
                );


            case "created-desc":

            default:

                return (
                    new Date(b.created) -
                    new Date(a.created)
                );

        }

    }


    getTaskDate(task) {

        if (!task.dueDate) {

            return new Date(
                "2999-12-31"
            );

        }


        return new Date(
            `${task.dueDate}T${
                task.dueTime ||
                "23:59"
            }`
        );

    }


    /* ================= REMINDERS ================= */

    requestNotificationPermission() {

        if (
            !("Notification" in window)
        ) {

            this.showToast(
                "Your browser does not support notifications.",
                "warning"
            );

            return;

        }


        if (
            Notification.permission ===
            "default"
        ) {

            Notification.requestPermission()
                .then(permission => {

                    if (
                        permission ===
                        "granted"
                    ) {

                        this.showToast(
                            "Reminders enabled 🔔",
                            "success"
                        );

                    } else {

                        this.showToast(
                            "Notification permission was denied.",
                            "warning"
                        );

                    }

                })
                .catch(error => {

                    console.error(
                        "Notification permission error:",
                        error
                    );

                });

        }

    }


    getReminderMinutes(reminder) {

        if (!reminder) {
            return 0;
        }


        const value =
            String(reminder)
                .trim()
                .toLowerCase();


        if (
            value === "none" ||
            value === "off" ||
            value === "0"
        ) {

            return 0;

        }


        /*
            Numeric values are interpreted
            as minutes.
        */

        if (
            !isNaN(value)
        ) {

            return Number(value);

        }


        /*
            Examples:
            15min
            30min
            1hour
            2hours
            1day
        */

        if (
            value.includes("day") ||
            value.includes("24h")
        ) {

            const number =
                parseFloat(value) || 1;

            return number * 24 * 60;

        }


        if (
            value.includes("hour") ||
            value.includes("hr")
        ) {

            const number =
                parseFloat(value) || 1;

            return number * 60;

        }


        if (
            value.includes("minute") ||
            value.includes("min")
        ) {

            return (
                parseFloat(value) || 0
            );

        }


        return 0;

    }


    getReminderTime(task) {

        if (
            !task.dueDate ||
            !task.reminder ||
            task.reminder === "none"
        ) {

            return null;

        }


        const dueTime =
            task.dueTime ||
            "23:59";


        const dueDate =
            new Date(
                `${task.dueDate}T${dueTime}`
            );


        if (
            isNaN(
                dueDate.getTime()
            )
        ) {

            return null;

        }


        const reminderMinutes =
            this.getReminderMinutes(
                task.reminder
            );


        if (
            reminderMinutes <= 0
        ) {

            return null;

        }


        return new Date(
            dueDate.getTime() -
            reminderMinutes *
            60 *
            1000
        );

    }


    checkReminders() {

        if (!this.currentUser) {
            return;
        }


        const now =
            new Date();


        let changed = false;


        this.tasks.forEach(task => {

            /*
                Completed tasks should never
                receive a reminder.
            */

            if (
                task.completed === true
            ) {

                return;

            }


            /*
                No reminder selected.
            */

            if (
                !task.reminder ||
                task.reminder === "none"
            ) {

                return;

            }


            /*
                Already sent.
            */

            if (
                task.reminderSent === true
            ) {

                return;

            }


            const reminderTime =
                this.getReminderTime(task);


            if (!reminderTime) {

                return;

            }


            /*
                Reminder time reached.
            */

            if (
                now >= reminderTime
            ) {

                this.sendReminderNotification(
                    task
                );


                task.reminderSent =
                    true;


                changed = true;

            }

        });


        if (changed) {

            this.saveData();

        }

    }


    sendReminderNotification(task) {

        const dueText =
            task.dueTime
                ? `Due at ${task.dueTime}`
                : "Due today";


        /*
            Browser notification.
        */

        if (
            "Notification" in window &&
            Notification.permission ===
                "granted"
        ) {

            try {

                new Notification(
                    "⏰ WorkFlow Pro Reminder",
                    {
                        body:
                            `${task.title}\n${dueText}`,
                        icon:
                            "favicon.ico"
                    }
                );

            } catch (error) {

                console.error(
                    "Notification error:",
                    error
                );

            }

        }


        /*
            In-app notification.
        */

        this.showToast(
            `⏰ Reminder: ${task.title}`,
            "warning"
        );

    }


    startReminderChecker() {

        /*
            Prevent duplicate intervals.
        */

        if (
            this.reminderInterval
        ) {

            clearInterval(
                this.reminderInterval
            );

        }


        /*
            Check immediately.
        */

        this.checkReminders();


        /*
            Check every 10 seconds.
        */

        this.reminderInterval =
            setInterval(
                () => {

                    /*
                        Only check while a user
                        is logged in.
                    */

                    if (
                        this.currentUser
                    ) {

                        this.checkReminders();

                    }

                },
                10000
            );

    }


    /* ================= UTILITIES ================= */

    generateId() {

        return (
            Date.now().toString(36) +
            Math.random()
                .toString(36)
                .substring(2, 9)
        );

    }


    categoryIcon(category) {

        const icons = {

            personal: "👤",

            work: "💼",

            study: "📚",

            health: "❤️",

            others: "📌"

        };


        return (
            icons[category] ||
            "📌"
        );

    }


    capitalize(value) {

        if (!value) {
            return "";
        }


        return (
            value.charAt(0).toUpperCase() +
            value.slice(1)
        );

    }


    escapeHtml(value) {

        return String(value || "")

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


    showToast(
        message,
        type = "success"
    ) {

        if (!this.toastContainer) {
            return;
        }


        const toast =
            document.createElement("div");


        toast.className =
            `toast ${type}`;


        toast.textContent =
            message;


        this.toastContainer
            .appendChild(toast);


        setTimeout(
            () => {

                toast.style.opacity =
                    "0";

                toast.style.transform =
                    "translateX(30px)";


                setTimeout(
                    () => {

                        toast.remove();

                    },
                    250
                );

            },
            2800
        );

    }

}


/* ================= START APP ================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        window.workflowPro =
            new WorkFlowPro();

    }
);
