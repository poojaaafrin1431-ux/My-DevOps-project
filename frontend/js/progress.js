// ---------- Module: Weight Progress Graph + Crash Diet Alert (backend-connected) ----------

const userId = getUserId();

let weightLog = [];
let targetWeight = null;

// 1. Fetch profile (for target weight) and weight logs from backend
async function fetchData() {
  const [profileRes, logsRes] = await Promise.all([
    fetch(`/api/profile/${userId}`),
    fetch(`/api/weight/${userId}`),
  ]);
  const profile = await profileRes.json();
  targetWeight = profile ? profile.target_weight : null;

  const logs = await logsRes.json();
  weightLog = logs.map(l => ({ id: l.id, date: l.entry_date, weight: l.weight }));
}

// 2. Add new weight entry
document.getElementById("weightForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const date = document.getElementById("entryDate").value;
  const weight = Number(document.getElementById("entryWeight").value);

  await fetch("/api/weight", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, entry_date: date, weight }),
  });

  document.getElementById("weightForm").reset();
  await fetchData();
  renderAll();
});

// 3. Render entry history table
function renderHistoryTable() {
  const body = document.getElementById("historyBody");
  body.innerHTML = "";
  weightLog.forEach(entry => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.date}</td>
      <td>${entry.weight} kg</td>
      <td><button class="removeBtn" data-id="${entry.id}">✕</button></td>
    `;
    body.appendChild(row);
  });

  body.querySelectorAll(".removeBtn").forEach(btn => {
    btn.addEventListener("click", async () => {
      await fetch(`/api/weight/${btn.dataset.id}`, { method: "DELETE" });
      await fetchData();
      renderAll();
    });
  });
}

// 4. Draw line chart on canvas
function drawChart() {
  const canvas = document.getElementById("weightChart");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (weightLog.length === 0) {
    ctx.fillStyle = "#94a3b8";
    ctx.font = "14px Arial";
    ctx.fillText("No entries yet — add your weight to see the graph.", 20, 40);
    return;
  }

  const padding = 50;
  const w = canvas.width - padding * 2;
  const h = canvas.height - padding * 2;

  const weights = weightLog.map(e => e.weight);
  let minW = Math.min(...weights);
  let maxW = Math.max(...weights);
  if (targetWeight) {
    minW = Math.min(minW, targetWeight);
    maxW = Math.max(maxW, targetWeight);
  }
  minW -= 2;
  maxW += 2;

  function xPos(i) {
    return padding + (i / Math.max(weightLog.length - 1, 1)) * w;
  }
  function yPos(weight) {
    return padding + h - ((weight - minW) / (maxW - minW)) * h;
  }

  ctx.strokeStyle = "#cbd5e0";
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, padding + h);
  ctx.lineTo(padding + w, padding + h);
  ctx.stroke();

  if (targetWeight) {
    ctx.strokeStyle = "#27ae60";
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(padding, yPos(targetWeight));
    ctx.lineTo(padding + w, yPos(targetWeight));
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#27ae60";
    ctx.font = "12px Arial";
    ctx.fillText("Target: " + targetWeight + " kg", padding + w - 110, yPos(targetWeight) - 6);
  }

  ctx.strokeStyle = "#2e5395";
  ctx.lineWidth = 2;
  ctx.beginPath();
  weightLog.forEach((entry, i) => {
    const x = xPos(i);
    const y = yPos(entry.weight);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  ctx.fillStyle = "#2e5395";
  weightLog.forEach((entry, i) => {
    const x = xPos(i);
    const y = yPos(entry.weight);
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#64748b";
    ctx.font = "10px Arial";
    ctx.save();
    ctx.translate(x, padding + h + 15);
    ctx.rotate(-0.4);
    ctx.fillText(entry.date, 0, 0);
    ctx.restore();
    ctx.fillStyle = "#2e5395";
  });
}

// 5. Crash diet alert check (based on last two entries)
function renderAlert() {
  const section = document.getElementById("alertSection");
  const alertBox = document.getElementById("alertBox");

  if (weightLog.length < 2) {
    section.style.display = "none";
    return;
  }

  const last = weightLog[weightLog.length - 1];
  const prev = weightLog[weightLog.length - 2];

  const daysDiff = (new Date(last.date) - new Date(prev.date)) / (1000 * 60 * 60 * 24);
  const weightDiff = prev.weight - last.weight;

  if (daysDiff <= 0) {
    section.style.display = "none";
    return;
  }

  const weeklyRate = (weightDiff / daysDiff) * 7;
  section.style.display = "block";

  if (weeklyRate > 1) {
    alertBox.className = "alert red";
    alertBox.innerHTML = `⚠ Crash Diet Warning: You are losing about ${weeklyRate.toFixed(2)} kg/week — this is faster than the safe limit (1 kg/week). Avoid crash dieting; please eat enough and consult a healthcare professional.`;
  } else if (weeklyRate >= 0.3) {
    alertBox.className = "alert green";
    alertBox.innerHTML = `✔ Healthy pace: You are losing about ${weeklyRate.toFixed(2)} kg/week. This is within the safe range (0.5–1 kg/week). Keep it steady!`;
  } else if (weeklyRate > 0) {
    alertBox.className = "alert green";
    alertBox.innerHTML = `Slow and steady: ${weeklyRate.toFixed(2)} kg/week loss. Safe, but you can slightly increase your calorie deficit if needed.`;
  } else {
    alertBox.className = "alert";
    alertBox.innerHTML = `Your weight has increased or stayed the same by ${Math.abs(weeklyRate).toFixed(2)} kg/week between the last two entries.`;
  }
}

// 6. Render everything
function renderAll() {
  renderHistoryTable();
  drawChart();
  renderAlert();
}

(async function init() {
  await fetchData();
  renderAll();
})();
