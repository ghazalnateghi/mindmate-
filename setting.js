class Settings {
  constructor() {
    this.settings = {
      userName: "Clara",
      userEmail: "clara@example.com",
      theme: "light",
      taskReminders: true,
      dailyQuotes: true,
    }

    this.setupMobileMenu()
    this.loadSettings()
    this.setupEventListeners()
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

  setupEventListeners() {
    const saveSettingsBtn = document.getElementById("saveSettingsBtn")
    saveSettingsBtn.addEventListener("click", () => this.saveSettings())

    const themeButtons = document.querySelectorAll(".theme-btn")
    themeButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.selectTheme(e.currentTarget.dataset.theme)
      })
    })

    const clearDataBtn = document.getElementById("clearDataBtn")
    clearDataBtn.addEventListener("click", () => this.clearAllData())
  }

  loadSettings() {
    const savedSettings = localStorage.getItem("mindmate-settings")
    if (savedSettings) {
      this.settings = { ...this.settings, ...JSON.parse(savedSettings) }
    }

    // Update form fields
    document.getElementById("userName").value = this.settings.userName
    document.getElementById("userEmail").value = this.settings.userEmail
    document.getElementById("taskReminders").checked = this.settings.taskReminders
    document.getElementById("dailyQuotes").checked = this.settings.dailyQuotes

    // Update theme selection
    document.querySelectorAll(".theme-btn").forEach((btn) => {
      btn.classList.remove("active")
    })
    document.querySelector(`[data-theme="${this.settings.theme}"]`).classList.add("active")
  }

  selectTheme(theme) {
    this.settings.theme = theme

    document.querySelectorAll(".theme-btn").forEach((btn) => {
      btn.classList.remove("active")
    })
    document.querySelector(`[data-theme="${theme}"]`).classList.add("active")

    // Apply theme immediately
    if (theme === "dark") {
      document.body.classList.add("dark-theme")
    } else {
      document.body.classList.remove("dark-theme")
    }
  }

  saveSettings() {
    // Get form values
    this.settings.userName = document.getElementById("userName").value
    this.settings.userEmail = document.getElementById("userEmail").value
    this.settings.taskReminders = document.getElementById("taskReminders").checked
    this.settings.dailyQuotes = document.getElementById("dailyQuotes").checked

    // Save to localStorage
    localStorage.setItem("mindmate-settings", JSON.stringify(this.settings))

    this.showNotification("Settings saved successfully!")
  }

  clearAllData() {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      localStorage.removeItem("mindmate-tasks")
      localStorage.removeItem("mindmate-moods")
      localStorage.removeItem("mindmate-favorite-quotes")
      localStorage.removeItem("mindmate-settings")

      this.showNotification("All data cleared successfully!")

      setTimeout(() => {
        window.location.href = "index.html"
      }, 2000)
    }
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
      max-width: 300px;
    `
    notification.textContent = message

    document.body.appendChild(notification)

    setTimeout(() => {
      document.body.removeChild(notification)
    }, 3000)
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Settings()
})
