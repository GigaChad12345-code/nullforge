const canvas = document.getElementById("grid");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

let offset = 0;

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(138, 43, 226, 0.25)";
  ctx.lineWidth = 1;

  const gridSize = 40;
  offset += 0.3;

  for (let x = -gridSize; x < canvas.width + gridSize; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x + offset, 0);
    ctx.lineTo(x + offset, canvas.height);
    ctx.stroke();
  }

  for (let y = -gridSize; y < canvas.height + gridSize; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y + offset);
    ctx.lineTo(canvas.width, y + offset);
    ctx.stroke();
  }

  requestAnimationFrame(drawGrid);
}

drawGrid();

// ===== SEARCH BAR FUNCTIONALITY =====

const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

// Sample search data - customize with your own content
const searchData = [
  { title: "Home", url: "#hero" },
  { title: "Apps Section", url: "#apps" },
  { title: "Games Section", url: "#games" },
  { title: "Tools Section", url: "#tools" },
  { title: "App One", url: "#apps" },
  { title: "App Two", url: "#apps" },
  { title: "Game One", url: "#games" },
  { title: "Game Two", url: "#games" },
  { title: "Tool One", url: "#tools" },
  { title: "Tool Two", url: "#tools" },
];

// Detect if input is a URL
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Format URL for proxy if needed
function formatUrl(input) {
  // If it's already a valid URL, use it directly
  if (isValidUrl(input)) {
    return "/service/" + input;
  }

  // If it doesn't have a protocol, add https://
  if (!input.includes("://")) {
    return "/service/https://" + input;
  }

  return "/service/" + input;
}

// Search functionality
searchInput.addEventListener("input", function () {
  const query = this.value.toLowerCase().trim();

  if (query.length === 0) {
    searchResults.classList.remove("active");
    searchResults.innerHTML = "";
    return;
  }

  // Filter search results
  const filtered = searchData.filter(item =>
    item.title.toLowerCase().includes(query)
  );

  // Build results HTML
  if (filtered.length > 0 || isValidUrl(query) || query.includes(".")) {
    let resultsHtml = "";

    // Show matching items first
    filtered.forEach(item => {
      resultsHtml += `
        <div class="search-result-item" onclick="navigateTo('${item.url}')">
          ${item.title}
        </div>
      `;
    });

    // If query looks like a URL, add option to browse it
    if (query.includes(".") || isValidUrl(query)) {
      const urlToBrowse = formatUrl(query);
      resultsHtml += `
        <div class="search-result-item" onclick="browseUrl('${urlToBrowse}')">
          🌐 Browse: ${query}
        </div>
      `;
    }

    searchResults.innerHTML = resultsHtml;
    searchResults.classList.add("active");
  } else {
    searchResults.innerHTML = '<div class="search-result-item no-results">No results found</div>';
    searchResults.classList.add("active");
  }
});

// Navigate to section
function navigateTo(url) {
  searchInput.value = "";
  searchResults.classList.remove("active");
  window.location.hash = url;
}

// Browse URL through proxy
function browseUrl(url) {
  searchInput.value = "";
  searchResults.classList.remove("active");
  window.open(url, "_blank");
}

// Handle Enter key in search
searchInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    const query = this.value.trim();

    // If it's a URL-like input, browse it
    if (query.includes(".") || isValidUrl(query)) {
      browseUrl(formatUrl(query));
    } else {
      // Otherwise, search and navigate to first result
      const filtered = searchData.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      if (filtered.length > 0) {
        navigateTo(filtered[0].url);
      }
    }
  }
});

// Close search results when clicking outside
document.addEventListener("click", function (event) {
  if (!event.target.closest(".search-container")) {
    searchResults.classList.remove("active");
  }
});
