// ---- Global state ----
let apiData = null;

// Fetch JSON (Task 6)
async function loadApiData() {
  try {
    const res = await fetch("travel_recommendation_api.json");
    apiData = await res.json();
    console.log("Loaded API data:", apiData);
  } catch (err) {
    console.error("Failed to load JSON:", err);
  }
}

// Utility: normalize keyword (Task 7)
function normalizeKeyword(value) {
  return value.trim().toLowerCase();
}

// Get recommendations by keyword (Task 8)
// Supports variations: beach/beaches, temple/temples, country/countries
function getRecommendations(keyword) {
  if (!apiData) return [];

  const k = normalizeKeyword(keyword);

  const isBeach = (k === "beach" || k === "beaches");
  const isTemple = (k === "temple" || k === "temples");
  const isCountry = (k === "country" || k === "countries");

  if (isBeach) return apiData.beaches || [];
  if (isTemple) return apiData.temples || [];
  if (isCountry) return apiData.countries || [];

  return [];
}

// Render results to grid (Task 8)
function renderResults(items) {
  const section = document.getElementById("resultsSection");
  const grid = document.getElementById("resultsGrid");
  const msg = document.getElementById("statusMessage");

  grid.innerHTML = "";
  msg.textContent = "";

  if (!items || items.length === 0) {
    section.style.display = "block";
    msg.textContent = "No recommendations found. Try: beach, temple, or country.";
    return;
  }

  section.style.display = "block";

  // show at least two (but render all if more)
  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = item.imageUrl;       // you must replace with your own images in /images
    img.alt = item.name;

    const content = document.createElement("div");
    content.className = "content";

    const h3 = document.createElement("h3");
    h3.textContent = item.name;

    const p = document.createElement("p");
    p.textContent = item.description;

    content.appendChild(h3);
    content.appendChild(p);

    card.appendChild(img);
    card.appendChild(content);

    grid.appendChild(card);
  });
}

// Clear results (Task 9)
function clearResults() {
  document.getElementById("resultsGrid").innerHTML = "";
  document.getElementById("statusMessage").textContent = "";
  document.getElementById("resultsSection").style.display = "none";
  document.getElementById("searchInput").value = "";
}

// --- Navbar navigation (SPA style) ---
function setActivePage(pageId) {
  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");

  // About/Contact navbar should not show search area (Task 4)
  const searchArea = document.getElementById("navSearchArea");
  searchArea.style.display = (pageId === "home") ? "flex" : "none";
}

function setupNavigation() {
  document.getElementById("navHome").addEventListener("click", () => setActivePage("home"));
  document.getElementById("navAbout").addEventListener("click", () => setActivePage("about"));
  document.getElementById("navContact").addEventListener("click", () => setActivePage("contact"));
}

// Search button (Task 7)
function setupSearch() {
  const searchBtn = document.getElementById("searchBtn");
  const resetBtn = document.getElementById("resetBtn");

  searchBtn.addEventListener("click", () => {
    const keyword = document.getElementById("searchInput").value;
    const results = getRecommendations(keyword);
    renderResults(results);
  });

  resetBtn.addEventListener("click", clearResults);
}

// Contact form (simple demo)
function setupContactForm() {
  const form = document.getElementById("contactForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Thanks! We received your message.");
    form.reset();
  });
}

// ---- Init ----
window.addEventListener("DOMContentLoaded", async () => {
  setupNavigation();
  setupSearch();
  setupContactForm();
  await loadApiData();
});