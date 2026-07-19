// ---------- Module: Food Tracker (Day-wise Calendar + Protein, backend-connected) ----------

const userId = getUserId();

// 1. Food-calorie-protein database (values per typical single serving)
const FOOD_DB = [
  { name: "Idli (2 pcs)", calories: 78, protein: 2.6 },
  { name: "Dosa (1 pc)", calories: 133, protein: 3.9 },
  { name: "Sambar (1 bowl)", calories: 120, protein: 6 },
  { name: "White Rice (1 cup)", calories: 205, protein: 4.3 },
  { name: "Chapati (1 pc)", calories: 104, protein: 3.1 },
  { name: "Curd Rice (1 bowl)", calories: 226, protein: 7.5 },
  { name: "Boiled Egg (1 pc)", calories: 78, protein: 6.3 },
  { name: "Banana (1 pc)", calories: 105, protein: 1.3 },
  { name: "Apple (1 pc)", calories: 95, protein: 0.5 },
  { name: "Chicken Curry (1 bowl)", calories: 260, protein: 25 },
  { name: "Fish Fry (1 piece)", calories: 200, protein: 22 },
  { name: "Paneer Curry (1 bowl)", calories: 280, protein: 14 },
  { name: "Milk (1 glass)", calories: 150, protein: 8 },
  { name: "Tea with sugar (1 cup)", calories: 60, protein: 1.5 },
  { name: "Coffee with sugar (1 cup)", calories: 65, protein: 1.5 },
  { name: "Biscuits (2 pcs)", calories: 90, protein: 1.5 },
  { name: "Pongal (1 bowl)", calories: 250, protein: 6.5 },
  { name: "Poori (2 pcs)", calories: 180, protein: 4 },
  { name: "Vegetable Salad (1 bowl)", calories: 50, protein: 2 },
  { name: "Fried Rice (1 plate)", calories: 350, protein: 8 },
  { name: "Biryani (1 plate)", calories: 450, protein: 18 },
  { name: "Samosa (1 pc)", calories: 150, protein: 3.5 },
  { name: "Peanuts (handful)", calories: 170, protein: 7 },
  { name: "Yogurt (1 cup)", calories: 100, protein: 5.5 },
  { name: "Orange (1 pc)", calories: 62, protein: 1.2 },
];

const SLOTS = [
  { key: "morning", label: "Morning" },
  { key: "lunch", label: "Lunch" },
  { key: "evening", label: "Evening Snacks" },
  { key: "dinner", label: "Dinner" },
];

let allFoodLogs = [];               // flat list of logs from the server for this user
let dayList = JSON.parse(localStorage.getItem("dayList_" + userId)) || [1];
let currentDay = dayList[0];

// 2. Populate datalist with food names for autocomplete
function populateFoodOptions() {
  const datalist = document.getElementById("foodOptions");
  datalist.innerHTML = "";
  FOOD_DB.forEach(food => {
    const option = document.createElement("option");
    option.value = food.name;
    datalist.appendChild(option);
  });
}

function saveDayList() {
  localStorage.setItem("dayList_" + userId, JSON.stringify(dayList));
}

// 3. Fetch all food logs for this user from the backend
async function fetchLogs() {
  const res = await fetch(`/api/food/${userId}`);
  allFoodLogs = await res.json();

  // Make sure every day that has logged data is also in dayList
  allFoodLogs.forEach(log => {
    if (!dayList.includes(log.day_number)) dayList.push(log.day_number);
  });
  dayList.sort((a, b) => a - b);
  saveDayList();
}

function getItemsFor(day, slotKey) {
  return allFoodLogs.filter(l => l.day_number === day && l.meal_slot === slotKey);
}

// 4. Render Day Tabs (Day 1, Day 2, Day 3...)
function renderDayTabs() {
  const dayTabs = document.getElementById("dayTabs");
  dayTabs.innerHTML = "";
  dayList.forEach(day => {
    const btn = document.createElement("button");
    btn.textContent = "Day " + day;
    btn.className = "day-tab" + (day === currentDay ? " active" : "");
    btn.addEventListener("click", () => {
      currentDay = day;
      renderAll();
    });
    dayTabs.appendChild(btn);
  });
}

// 5. Render the 4 meal slots for the current day
function renderSlots() {
  document.getElementById("currentDayTitle").textContent = "Day " + currentDay;
  const container = document.getElementById("slotsContainer");
  container.innerHTML = "";

  let dayTotalCal = 0;
  let dayTotalProtein = 0;

  SLOTS.forEach(slot => {
    const items = getItemsFor(currentDay, slot.key);
    const slotCal = items.reduce((sum, item) => sum + item.calories, 0);
    const slotProtein = items.reduce((sum, item) => sum + (item.protein || 0), 0);
    dayTotalCal += slotCal;
    dayTotalProtein += slotProtein;

    const block = document.createElement("div");
    block.className = "slot-block";

    block.innerHTML = `
      <div class="slot-header">
        <label class="checkbox-row">
          <input type="checkbox" disabled ${items.length > 0 ? "checked" : ""}>
          <strong>${slot.label}</strong>
        </label>
        <span class="slot-calories">${slotCal} kcal &nbsp;•&nbsp; ${slotProtein.toFixed(1)} g protein</span>
      </div>

      <div class="slot-input-row">
        <input type="text" list="foodOptions" placeholder="Type or select food" class="foodNameInput">
        <input type="number" min="1" value="1" step="1" class="servingsInput" title="Servings">
        <button class="addFoodBtn">Add</button>
      </div>
      <p class="food-preview" style="display:none;"></p>

      <ul class="food-list">
        ${items.map(item => `
          <li>
            <span>${item.food_name} — ${item.calories} kcal, ${(item.protein || 0).toFixed(1)}g protein</span>
            <button class="removeBtn" data-id="${item.id}">✕</button>
          </li>
        `).join("")}
      </ul>
    `;

    container.appendChild(block);

    const addBtn = block.querySelector(".addFoodBtn");
    const nameInput = block.querySelector(".foodNameInput");
    const servingsInput = block.querySelector(".servingsInput");
    const preview = block.querySelector(".food-preview");

    // 5a. Auto-fill preview: as soon as a food name matches the database
    // (typed or picked from the dropdown), show its calories/protein live.
    function updatePreview() {
      const foodName = nameInput.value.trim();
      const servings = Number(servingsInput.value) || 1;
      const match = FOOD_DB.find(f => f.name.toLowerCase() === foodName.toLowerCase());
      if (match) {
        preview.style.display = "block";
        preview.textContent = `≈ ${Math.round(match.calories * servings)} kcal, ${(match.protein * servings).toFixed(1)}g protein for ${servings} serving(s)`;
      } else {
        preview.style.display = "none";
      }
    }
    nameInput.addEventListener("input", updatePreview);
    servingsInput.addEventListener("input", updatePreview);

    // 5b. Add food -> saves to backend
    addBtn.addEventListener("click", async () => {
      const foodName = nameInput.value.trim();
      const servings = Number(servingsInput.value) || 1;
      if (!foodName) return;

      const match = FOOD_DB.find(f => f.name.toLowerCase() === foodName.toLowerCase());
      const calories = Math.round(match ? match.calories * servings : 100 * servings);
      const protein = Number(((match ? match.protein : 3) * servings).toFixed(1));

      await fetch("/api/food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId, day_number: currentDay, meal_slot: slot.key,
          food_name: foodName, calories, protein,
        }),
      });

      await fetchLogs();
      renderAll();
    });

    // 5c. Remove food -> deletes from backend
    block.querySelectorAll(".removeBtn").forEach(btn => {
      btn.addEventListener("click", async () => {
        await fetch(`/api/food/${btn.dataset.id}`, { method: "DELETE" });
        await fetchLogs();
        renderAll();
      });
    });
  });

  document.getElementById("dayTotalCalories").textContent = dayTotalCal + " kcal";
  document.getElementById("dayTotalProtein").textContent = dayTotalProtein.toFixed(1) + " g protein";
}

// 6. Render Calendar Overview Table
function renderOverviewTable() {
  const tbody = document.getElementById("overviewBody");
  tbody.innerHTML = "";

  dayList.forEach(day => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>Day ${day}</td>
      <td>${getItemsFor(day, "morning").length > 0 ? "✅" : "—"}</td>
      <td>${getItemsFor(day, "lunch").length > 0 ? "✅" : "—"}</td>
      <td>${getItemsFor(day, "evening").length > 0 ? "✅" : "—"}</td>
      <td>${getItemsFor(day, "dinner").length > 0 ? "✅" : "—"}</td>
    `;
    tbody.appendChild(row);
  });
}

// 7. Add New Day button
document.getElementById("addDayBtn").addEventListener("click", () => {
  const nextDay = Math.max(...dayList) + 1;
  dayList.push(nextDay);
  currentDay = nextDay;
  saveDayList();
  renderAll();
});

// 8. Render everything together
function renderAll() {
  renderDayTabs();
  renderSlots();
  renderOverviewTable();
}

// 9. Initial load
(async function init() {
  populateFoodOptions();
  await fetchLogs();
  renderAll();
})();
