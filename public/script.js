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

// Sample search suggestions
const searchData = [
  { title: "Home", type: "internal", url: "#hero" },
  { title: "Apps Section", type: "internal", url: "#apps" },
  { title: "Games Section", type: "internal", url: "#games" },
  { title: "Tools Section", type: "internal", url: "#tools" },
];

let currentBrowsingUrl = null;

// Format URL for proxy
function formatUrl(input) {
  input = input.trim();

  // If already has protocol, return as-is
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

// Browse URL in modal
function browseTo(urlInput) {
  const formattedUrl = formatUrl(urlInput);
  loadInBrowser(formattedUrl, urlInput);
  searchInput.value = "";
  searchResults.classList.remove("active");
}

// Search on Google
function searchGoogle(query) {
  const googleUrl = "https://www.google.com/search?q=" + encodeURIComponent(query);
  loadInBrowser(googleUrl, "Google: " + query);
  searchInput.value = "";
  searchResults.classList.remove("active");
}

// Load URL in browser modal - SIMPLE APPROACH
function loadInBrowser(url, displayUrl) {
  browserModal.classList.add("active");
  browserUrl.value = displayUrl || url;
  currentBrowsingUrl = url;
  
  browserLoading.style.display = "flex";
  browserLoading.innerHTML = "Loading...";
  
  // Build proxy URL - simple and direct
  const proxyUrl = "/service/" + url;
  
  console.log("Loading proxy URL:", proxyUrl);
  
  // Set iframe src directly to the proxy URL
  browserFrame.src = proxyUrl;
  
  // Wait for iframe to load
  browserFrame.onload = () => {
    browserLoading.style.display = "none";
    console.log("Iframe loaded successfully");
  };
  
  browserFrame.onerror = () => {
    browserLoading.innerHTML = "⚠️ Failed to load page";
    console.error("Iframe failed to load");
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
  if (currentBrowsingUrl) {
    loadInBrowser(currentBrowsingUrl, browserUrl.value);
  }
});

// Load URL from address bar
browserUrl.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    const url = formatUrl(this.value);
    loadInBrowser(url, this.value);
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
