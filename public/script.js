const canvas = document.getElementById("grid");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// ===== STATIC GRID WITH WAVE EFFECT =====
let time = 0;

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(138, 43, 226, 0.25)";
  ctx.lineWidth = 1;

  const gridSize = 40;
  time += 0.02;

  // Vertical lines with wave effect
  for (let x = -gridSize; x < canvas.width + gridSize; x += gridSize) {
    ctx.beginPath();
    for (let y = 0; y < canvas.height; y += 5) {
      const wave = Math.sin((y / 50) + time) * 3;
      const xPos = x + wave;
      if (y === 0) {
        ctx.moveTo(xPos, y);
      } else {
        ctx.lineTo(xPos, y);
      }
    }
    ctx.stroke();
  }

  // Horizontal lines (static)
  for (let y = -gridSize; y < canvas.height + gridSize; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  requestAnimationFrame(drawGrid);
}

drawGrid();

// ===== SEARCH BAR & BROWSER FUNCTIONALITY =====

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const searchResults = document.getElementById("searchResults");
const browserModal = document.getElementById("browserModal");
const browserFrame = document.getElementById("browserFrame");
const browserUrl = document.getElementById("browserUrl");
const closeModal = document.getElementById("closeModal");
const browserReload = document.getElementById("browserReload");
const browserLoading = document.getElementById("browserLoading");
const browserContent = document.getElementById("browserContent");

// Sample search suggestions
const searchData = [
  { title: "Home", type: "internal", url: "#hero" },
  { title: "Apps Section", type: "internal", url: "#apps" },
  { title: "Games Section", type: "internal", url: "#games" },
  { title: "Tools Section", type: "internal", url: "#tools" },
];

// Format URL for proxy - FIXED VERSION
function formatUrl(input) {
  input = input.trim();

  // Remove /service/ if already there
  if (input.startsWith("/service/")) {
    input = input.substring(9);
  }

  // If already has protocol, return with /service/ prefix
  if (input.includes("://")) {
    return input;
  }

  // If looks like a domain
  if (input.includes(".")) {
    return "https://" + input;
  }

  // Fallback
  return "https://" + input;
}

// Validate if string is URL-like
function isUrlLike(string) {
  return string.includes(".") || string.includes("://") || string.includes("/");
}

// Show search results
searchInput.addEventListener("input", function () {
  const query = this.value.toLowerCase().trim();

  if (query.length === 0) {
    searchResults.classList.remove("active");
    searchResults.innerHTML = "";
    return;
  }

  let resultsHtml = "";

  // Filter internal search items
  const filtered = searchData.filter(item =>
    item.title.toLowerCase().includes(query)
  );

  filtered.forEach(item => {
    resultsHtml += `
      <div class="search-result-item" onclick="navigateTo('${item.url}')">
        <span class="result-type">${item.type === 'internal' ? '📍' : '🌐'}</span>
        ${item.title}
      </div>
    `;
  });

  // Add "Browse URL" option if input looks like a URL
  if (isUrlLike(query)) {
    resultsHtml += `
      <div class="search-result-item browse-item" onclick="browseTo('${query}')">
        <span class="result-type">🌐</span>
        Browse: ${query}
      </div>
    `;
  }

  // Add Google search fallback
  if (!isUrlLike(query)) {
    resultsHtml += `
      <div class="search-result-item" onclick="searchGoogle('${query}')">
        <span class="result-type">🔍</span>
        Search: "${query}" on Google
      </div>
    `;
  }

  searchResults.innerHTML = resultsHtml;
  searchResults.classList.add("active");
});

// Navigate to internal section
function navigateTo(url) {
  searchInput.value = "";
  searchResults.classList.remove("active");
  window.location.hash = url;
}

// Browse URL in modal - FIXED
function browseTo(urlInput) {
  const formattedUrl = formatUrl(urlInput);
  const proxyUrl = "/service/" + formattedUrl;
  loadInBrowser(proxyUrl, urlInput);
  searchInput.value = "";
  searchResults.classList.remove("active");
}

// Search on Google - FIXED
function searchGoogle(query) {
  const googleUrl = "/service/https://www.google.com/search?q=" + encodeURIComponent(query);
  loadInBrowser(googleUrl, "Google: " + query);
  searchInput.value = "";
  searchResults.classList.remove("active");
}

// Load URL in browser modal - FIXED
function loadInBrowser(url, displayUrl) {
  browserModal.classList.add("active");
  browserUrl.value = displayUrl || url;
  
  // Clear previous iframe
  browserFrame.src = "";
  browserLoading.style.display = "flex";
  
  // Set new source
  setTimeout(() => {
    browserFrame.src = url;
  }, 100);
  
  // Hide loading indicator when iframe loads
  browserFrame.onload = () => {
    browserLoading.style.display = "none";
  };
  
  browserFrame.onerror = () => {
    browserLoading.innerHTML = "⚠️ Failed to load";
  };
}

// Handle Enter key
searchInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    const query = this.value.trim();

    if (isUrlLike(query)) {
      browseTo(query);
    } else if (query.length > 0) {
      searchGoogle(query);
    }
  }
});

// Search button click
searchBtn.addEventListener("click", function () {
  const query = searchInput.value.trim();

  if (isUrlLike(query)) {
    browseTo(query);
  } else if (query.length > 0) {
    searchGoogle(query);
  }
});

// Close browser modal
closeModal.addEventListener("click", function () {
  browserModal.classList.remove("active");
  browserFrame.src = "";
  browserLoading.style.display = "none";
});

// Reload page in browser
browserReload.addEventListener("click", function () {
  browserFrame.src = browserFrame.src;
  browserLoading.style.display = "flex";
});

// Load URL from address bar
browserUrl.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    const url = formatUrl(this.value);
    const proxyUrl = "/service/" + url;
    browserFrame.src = proxyUrl;
    browserLoading.style.display = "flex";
  }
});

// Close modal on Escape key
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    browserModal.classList.remove("active");
    browserFrame.src = "";
    browserLoading.style.display = "none";
  }
});

// Close search results when clicking outside
document.addEventListener("click", function (event) {
  if (!event.target.closest(".search-container")) {
    searchResults.classList.remove("active");
  }
});
