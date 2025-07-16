class DailyQuotes {
  constructor() {
    this.quotes = {
      motivation: [
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
        { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
      ],
      success: [
        {
          text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
          author: "Winston Churchill",
        },
        { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
        { text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller" },
      ],
      wisdom: [
        { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates" },
        { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
        { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
      ],
      happiness: [
        { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama" },
        { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
        { text: "Life is what happens to you while you're busy making other plans.", author: "John Lennon" },
      ],
    }

    this.favorites = []
    this.currentQuote = null

    this.setupMobileMenu()
    this.updateTime()
    this.startTimeUpdater()
    this.setupEventListeners()
    this.loadDailyQuote()
    this.loadFavorites()
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
    const newQuoteBtn = document.getElementById("newQuoteBtn")
    newQuoteBtn.addEventListener("click", () => this.getNewQuote())

    const categoryCards = document.querySelectorAll(".category-card")
    categoryCards.forEach((card) => {
      card.addEventListener("click", (e) => {
        const category = e.currentTarget.dataset.category
        this.getQuoteByCategory(category)
      })
    })
  }

  loadDailyQuote() {
    const allQuotes = Object.values(this.quotes).flat()
    const randomQuote = allQuotes[Math.floor(Math.random() * allQuotes.length)]
    this.displayQuote(randomQuote)
  }

  getNewQuote() {
    const allQuotes = Object.values(this.quotes).flat()
    let randomQuote

    do {
      randomQuote = allQuotes[Math.floor(Math.random() * allQuotes.length)]
    } while (randomQuote === this.currentQuote && allQuotes.length > 1)

    this.displayQuote(randomQuote)
  }

  getQuoteByCategory(category) {
    const categoryQuotes = this.quotes[category]
    const randomQuote = categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)]
    this.displayQuote(randomQuote)
  }

  displayQuote(quote) {
    this.currentQuote = quote
    document.getElementById("dailyQuote").textContent = `"${quote.text}"`
    document.getElementById("quoteAuthor").textContent = `- ${quote.author}`
  }

  loadFavorites() {
    const savedFavorites = localStorage.getItem("mindmate-favorite-quotes")
    if (savedFavorites) {
      this.favorites = JSON.parse(savedFavorites)
    }

    const favoritesList = document.getElementById("favoritesList")

    if (this.favorites.length === 0) {
      favoritesList.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-star"></i>
          <p>No favorite quotes yet. Click the heart icon on quotes to save them!</p>
        </div>
      `
      return
    }

    favoritesList.innerHTML = ""
    this.favorites.forEach((quote) => {
      const quoteElement = document.createElement("div")
      quoteElement.className = "favorite-quote"
      quoteElement.innerHTML = `
        <blockquote>"${quote.text}"</blockquote>
        <cite>- ${quote.author}</cite>
      `
      favoritesList.appendChild(quoteElement)
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
}

document.addEventListener("DOMContentLoaded", () => {
  new DailyQuotes()
})
