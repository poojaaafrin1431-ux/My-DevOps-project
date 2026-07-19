// ---------- Module: Skin Type Quiz + Tips (backend-connected) ----------

const userId = getUserId();

const tipsData = {
  oily: {
    label: "Oily Skin",
    tips: [
      "Wash your face twice a day with a gentle, oil-free cleanser — do not over-wash as it can trigger more oil.",
      "Use oil-free, non-comedogenic (won't clog pores) moisturizers and sunscreen.",
      "Avoid heavy, greasy creams and touching your face frequently.",
      "Use blotting paper during the day instead of repeatedly washing your face.",
      "Include a gentle exfoliation (1-2 times a week) to prevent clogged pores."
    ]
  },
  dry: {
    label: "Dry Skin",
    tips: [
      "Use a creamy, hydrating cleanser instead of foaming/gel cleansers.",
      "Apply moisturizer immediately after washing your face while skin is still damp.",
      "Drink enough water daily and avoid long hot showers which strip natural oils.",
      "Use a humidifier in dry weather and avoid harsh soaps.",
      "Choose sunscreen and makeup products labeled 'hydrating' or 'for dry skin'."
    ]
  },
  combination: {
    label: "Combination Skin",
    tips: [
      "Use a mild cleanser suited for normal-to-oily skin on the T-zone.",
      "Apply lightweight moisturizer on cheeks and oil-free gel on the T-zone if needed.",
      "Avoid using the same heavy product all over the face — treat zones differently.",
      "Use a gentle exfoliant once a week to balance oily areas.",
      "Always use a broad-spectrum sunscreen daily."
    ]
  },
  normal: {
    label: "Normal Skin",
    tips: [
      "Maintain your routine with a gentle cleanser and light moisturizer.",
      "Do not skip sunscreen even though your skin feels balanced.",
      "Exfoliate gently once a week to keep skin fresh.",
      "Stay hydrated and maintain a balanced diet to keep skin healthy long-term.",
      "Avoid switching products too often — consistency keeps normal skin balanced."
    ]
  }
};

document.getElementById("skinForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  // 1. Collect answers from all 4 questions
  const answers = [
    document.querySelector('input[name="q1"]:checked').value,
    document.querySelector('input[name="q2"]:checked').value,
    document.querySelector('input[name="q3"]:checked').value,
    document.querySelector('input[name="q4"]:checked').value,
  ];

  // 2. Count occurrences of each skin type
  const count = { oily: 0, dry: 0, combination: 0, normal: 0 };
  answers.forEach(ans => count[ans]++);

  // 3. Find the type with the highest count
  let resultType = "normal";
  let maxCount = 0;
  for (const type in count) {
    if (count[type] > maxCount) {
      maxCount = count[type];
      resultType = type;
    }
  }

  // 4. Display result
  const result = tipsData[resultType];
  document.getElementById("resultCard").style.display = "block";
  document.getElementById("skinTypeValue").textContent = result.label;

  const tipsList = document.getElementById("tipsList");
  tipsList.innerHTML = "";
  result.tips.forEach(tip => {
    const li = document.createElement("li");
    li.textContent = tip;
    tipsList.appendChild(li);
  });

  // 5. Save result to the database
  await fetch("/api/skin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, skin_type: resultType }),
  });

  // 6. Scroll down to result
  document.getElementById("resultCard").scrollIntoView({ behavior: "smooth" });
});

// Load the most recent saved result, if any
window.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch(`/api/skin/${userId}`);
  const saved = await res.json();
  if (saved) {
    const result = tipsData[saved.skin_type];
    document.getElementById("resultCard").style.display = "block";
    document.getElementById("skinTypeValue").textContent = result.label;
    const tipsList = document.getElementById("tipsList");
    tipsList.innerHTML = "";
    result.tips.forEach(tip => {
      const li = document.createElement("li");
      li.textContent = tip;
      tipsList.appendChild(li);
    });
  }
});
