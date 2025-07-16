class TaskManager {
  constructor() {
    this.tasks = []
    this.selectedCategory = "Personal"
    this.taskIdCounter = 1

    this.initializeApp()
    this.loadInitialTasks()
    this.setupEventListeners()
    this.updateGreeting()
    this.startTimeUpdater()
  }

  initializeApp() {
    const savedTasks = localStorage.getItem("mindmate-tasks")
    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks)
      this.taskIdCounter = Math.max(...this.tasks.map((t) => Number.parseInt(t.id)), 0) + 1
    }
  }

  loadInitialTasks() {
    if (this.tasks.length === 0) {
      const initialTasks = [
        {
          id: "1",
          title: "Morning Meditation",
          category: "Wellness",
          dueDate: "Today",
          completed: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          title: "Review Project Proposal",
          category: "Work",
          dueDate: "Today",
          completed: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: "3",
          title: "Grocery Shopping",
          category: "Personal",
          dueDate: "Today",
          completed: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: "4",
          title: "Team Meeting",
          category: "Work",
          dueDate: "Tomorrow",
          completed: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: "5",
          title: "Submit Report",
          category: "Work",
          dueDate: "In 2 days",
          completed: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: "6",
          title: "Plan Weekend Trip",
          category: "Personal",
          dueDate: "In 3 days",
          completed: false,
          createdAt: new Date().toISOString(),
        },
      ]

      this.tasks = initialTasks
      this.saveTasks()
    }

    this.renderTasks()
  }

  setupEventListeners() {
    const taskInput = document.getElementById("taskInput")
    const addTaskBtn = document.getElementById("addTaskBtn")

    taskInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.addTask()
      }
    })

    addTaskBtn.addEventListener("click", () => this.addTask())

    const categoryButtons = document.querySelectorAll(".category-btn")
    categoryButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.selectCategory(e.target.dataset.category)
      })
    })

    const mobileMenuToggle = document.getElementById("mobileMenuToggle")
    const sidebar = document.getElementById("sidebar")

    mobileMenuToggle.addEventListener("click", () => {
      sidebar.classList.toggle("open")
    })

    document.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
          sidebar.classList.remove("open")
        }
      }
    })

    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        sidebar.classList.remove("open")
      }
    })
  }

  addTask() {
    const taskInput = document.getElementById("taskInput")
    const taskTitle = taskInput.value.trim()

    if (!taskTitle) {
      this.showNotification("Please enter a task title!", "error")
      return
    }

    const newTask = {
      id: this.taskIdCounter.toString(),
      title: taskTitle,
      category: this.selectedCategory,
      dueDate: "Today",
      completed: false,
      createdAt: new Date().toISOString(),
    }

    this.tasks.push(newTask)
    this.taskIdCounter++
    taskInput.value = ""

    this.saveTasks()
    this.renderTasks()
    this.showNotification(`Task "${taskTitle}" added successfully!`)
  }

  selectCategory(category) {
    this.selectedCategory = category

    document.querySelectorAll(".category-btn").forEach((btn) => {
      btn.classList.remove("active")
    })

    document.querySelector(`[data-category="${category}"]`).classList.add("active")
  }

  toggleTask(taskId) {
    const task = this.tasks.find((t) => t.id === taskId)
    if (task) {
      task.completed = !task.completed
      this.saveTasks()
      this.renderTasks()

      const status = task.completed ? "completed" : "reopened"
      this.showNotification(`Task "${task.title}" ${status}!`)
    }
  }

  deleteTask(taskId) {
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`)
    const task = this.tasks.find((t) => t.id === taskId)

    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      taskElement.classList.add("removing")

      setTimeout(() => {
        this.tasks = this.tasks.filter((t) => t.id !== taskId)
        this.saveTasks()
        this.renderTasks()
        this.showNotification("Task deleted successfully!")
      }, 300)
    }
  }

  editTask(taskId) {
    const task = this.tasks.find((t) => t.id === taskId)
    if (!task) return

    const newTitle = prompt("Edit task:", task.title)
    if (newTitle && newTitle.trim() && newTitle.trim() !== task.title) {
      task.title = newTitle.trim()
      this.saveTasks()
      this.renderTasks()
      this.showNotification("Task updated successfully!")
    }
  }

  renderTasks() {
    const todayTasksContainer = document.getElementById("todayTasks")
    const upcomingTasksContainer = document.getElementById("upcomingTasks")

    todayTasksContainer.innerHTML = ""
    upcomingTasksContainer.innerHTML = ""

    const todayTasks = this.tasks.filter((task) => task.dueDate === "Today")
    const upcomingTasks = this.tasks.filter((task) => task.dueDate !== "Today")

    if (todayTasks.length === 0) {
      todayTasksContainer.innerHTML = '<div class="empty-state">No tasks for today. Add one above!</div>'
    } else {
      todayTasks.forEach((task) => {
        todayTasksContainer.appendChild(this.createTaskElement(task))
      })
    }

    if (upcomingTasks.length === 0) {
      upcomingTasksContainer.innerHTML = '<div class="empty-state">No upcoming tasks.</div>'
    } else {
      upcomingTasks.forEach((task) => {
        upcomingTasksContainer.appendChild(this.createTaskElement(task))
      })
    }
  }

  createTaskElement(task) {
    const template = document.getElementById("taskTemplate")
    const taskElement = template.content.cloneNode(true)

    const taskItem = taskElement.querySelector(".task-item")
    const checkbox = taskElement.querySelector(".task-checkbox")
    const title = taskElement.querySelector(".task-title")
    const dueDate = taskElement.querySelector(".task-due-date")
    const editBtn = taskElement.querySelector(".edit-btn")
    const deleteBtn = taskElement.querySelector(".delete-btn")

    taskItem.setAttribute("data-task-id", task.id)
    checkbox.checked = task.completed
    title.textContent = task.title
    dueDate.textContent = `Due: ${task.dueDate}`

    if (task.completed) {
      taskItem.classList.add("completed")
    }

    checkbox.addEventListener("change", () => this.toggleTask(task.id))
    editBtn.addEventListener("click", () => this.editTask(task.id))
    deleteBtn.addEventListener("click", () => this.deleteTask(task.id))

    return taskElement
  }

  updateGreeting() {
    const now = new Date()
    const hour = now.getHours()
    let greeting

    if (hour < 6) {
      greeting = "Ready for a restful night?"
    } else if (hour < 12) {
      greeting = "Ready for a productive morning?"
    } else if (hour < 18) {
      greeting = "Ready for a productive day?"
    } else {
      greeting = "Ready for a peaceful evening?"
    }

    document.getElementById("greetingText").textContent = `Hi Clara 😊 ${greeting}`
  }

  updateTime() {
    const now = new Date()
    const timeString = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })

    const offset = now.getTimezoneOffset()
    const offsetHours = Math.abs(Math.floor(offset / 60))
    const offsetMinutes = Math.abs(offset % 60)
    const offsetSign = offset <= 0 ? "+" : "-"
    const offsetString = `${offsetSign}${offsetHours.toString().padStart(2, "0")}:${offsetMinutes.toString().padStart(2, "0")}`

    document.getElementById("currentTime").textContent = `${timeString} ${offsetString}`
  }

  startTimeUpdater() {
    this.updateTime()
    setInterval(() => {
      this.updateTime()
      const now = new Date()
      if (now.getSeconds() === 0) {
        this.updateGreeting()
      }
    }, 1000)
  }

  saveTasks() {
    localStorage.setItem("mindmate-tasks", JSON.stringify(this.tasks))
  }

  showNotification(message, type = "success") {
    const notification = document.createElement("div")
    const bgColor = type === "error" ? "#ef4444" : "#10b981"

    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            font-weight: 500;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
        `
    notification.textContent = message

    const style = document.createElement("style")
    style.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `
    document.head.appendChild(style)

    document.body.appendChild(notification)

    setTimeout(() => {
      notification.style.animation = "slideOutRight 0.3s ease forwards"
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
        if (document.head.contains(style)) {
          document.head.removeChild(style)
        }
      }, 300)
    }, 3000)
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new TaskManager()
})
