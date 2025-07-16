class Dashboard {
  constructor() {
    this.setupMobileMenu()
    this.updateGreeting()
    this.startTimeUpdater()
    this.loadDashboardStats()
  }

  setupMobileMenu() {
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

  loadDashboardStats() {
    const savedTasks = localStorage.getItem("mindmate-tasks")
    let tasks = []

    if (savedTasks) {
      tasks = JSON.parse(savedTasks)
    }

    const totalTasks = tasks.length
    const completedTasks = tasks.filter((task) => task.completed).length
    const pendingTasks = totalTasks - completedTasks
    const todayTasks = tasks.filter((task) => task.dueDate === "Today").length

    document.getElementById("totalTasks").textContent = totalTasks
    document.getElementById("completedTasks").textContent = completedTasks
    document.getElementById("pendingTasks").textContent = pendingTasks
    document.getElementById("todayTasks").textContent = todayTasks

    // Load recent tasks
    this.loadRecentTasks(tasks)
  }

  loadRecentTasks(tasks) {
    const recentTasksList = document.getElementById("recentTasksList")
    const recentTasks = tasks.slice(-5).reverse() // Get last 5 tasks

    if (recentTasks.length === 0) {
      recentTasksList.innerHTML =
        '<div class="empty-state">No tasks yet. <a href="index.html">Create your first task!</a></div>'
      return
    }

    recentTasksList.innerHTML = ""
    recentTasks.forEach((task) => {
      const taskElement = document.createElement("div")
      taskElement.className = `task-item ${task.completed ? "completed" : ""}`
      taskElement.innerHTML = `
        <div class="task-checkbox-container">
          <span class="custom-checkbox ${task.completed ? "checked" : ""}">
            ${task.completed ? "✓" : ""}
          </span>
        </div>
        <div class="task-content">
          <div class="task-title">${task.title}</div>
          <div class="task-due-date">Due: ${task.dueDate}</div>
        </div>
        <div class="task-indicator"></div>
      `
      recentTasksList.appendChild(taskElement)
    })
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Dashboard()
})
