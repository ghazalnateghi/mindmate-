class MoodTracker {
  constructor() {
    this.moods = []
    this.selectedMood = null

    this.setupMobileMenu()
    this.updateTime()
    this.startTimeUpdater()
    this.setupEventListeners()
    this.loadMoodHistory()
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
    const moodButtons = document.querySelectorAll(".mood-btn")
    moodButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.selectMood(e.currentTarget.dataset.mood)
      })
    })

    const saveMoodBtn = document.getElementById("saveMoodBtn")
    saveMoodBtn.addEventListener("click", () => this.saveMoodEntry())
  }

  selectMood(mood) {
    this.selectedMood = mood

    document.querySelectorAll(".mood-btn").forEach((btn) => {
      btn.classList.remove("selected")
    })

    document.querySelector(`[data-mood="${mood}"]`).classList.add("selected")
  }

  saveMoodEntry() {
    if (!this.selectedMood) {
      this.showNotification("Please select a mood first!", "error")
      return
    }

    const note = document.getElementById("moodNote").value.trim()
    const moodEntry = {
      id: Date.now().toString(),
      mood: this.selectedMood,
      note: note,
      date: new Date().toISOString(),
      dateString: new Date().toLocaleDateString(),
    }

    this.moods.push(moodEntry)
    this.saveMoods()
    this.loadMoodHistory()

    // Reset form
    this.selectedMood = null
    document.querySelectorAll(".mood-btn").forEach((btn) => {
      btn.classList.remove("selected")
    })
    document.getElementById("moodNote").value = ""

    this.showNotification("Mood entry saved successfully!")
  }

  loadMoodHistory() {
    const savedMoods = localStorage.getItem("mindmate-moods")
    if (savedMoods) {
      this.moods = JSON.parse(savedMoods)
    }

    const moodEntries = document.getElementById("moodEntries")

    if (this.moods.length === 0) {
      moodEntries.innerHTML = '<div class="empty-state">No mood entries yet. Track your first mood above!</div>'
      return
    }

    moodEntries.innerHTML = ""
    this.moods
      .slice()
      .reverse()
      .forEach((mood) => {
        const moodElement = document.createElement("div")
        moodElement.className = "mood-entry"

        const moodEmojis = {
          excellent: "😄",
          good: "😊",
          okay: "😐",
          sad: "😢",
          stressed: "😰",
        }

        moodElement.innerHTML = `
        <div class="mood-entry-header">
          <span class="mood-emoji">${moodEmojis[mood.mood]}</span>
          <div class="mood-info">
            <span class="mood-label">${mood.mood.charAt(0).toUpperCase() + mood.mood.slice(1)}</span>
            <span class="mood-date">${mood.dateString}</span>
          </div>
        </div>
        ${mood.note ? `<div class="mood-note">${mood.note}</div>` : ""}
      `
        moodEntries.appendChild(moodElement)
      })
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
    setInterval(() => {
      this.updateTime()
    }, 1000)
  }

  saveMoods() {
    localStorage.setItem("mindmate-moods", JSON.stringify(this.moods))
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
  new MoodTracker()
})
