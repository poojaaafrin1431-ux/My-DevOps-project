// ---------- Module 1: BMI + Calorie Calculator (backend-connected) ----------

const userId = getUserId();

document.getElementById("profileForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  // 1. Read inputs
  const age = Number(document.getElementById("age").value);
  const gender = document.getElementById("gender").value;
  const height = Number(document.getElementById("height").value); // cm
  const weight = Number(document.getElementById("weight").value); // kg
  const activity_level = Number(document.getElementById("activity").value);
  const target_weight = Number(document.getElementById("targetWeight").value);

  // 2. BMI calculation -> weight(kg) / height(m)^2
  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);

  let bmiCategory = "";
  if (bmi < 18.5) bmiCategory = "Underweight";
  else if (bmi < 25) bmiCategory = "Normal";
  else if (bmi < 30) bmiCategory = "Overweight";
  else bmiCategory = "Obese";

  // 3. BMR calculation -> Mifflin-St Jeor equation
  let bmr;
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // 4. TDEE = BMR * activity factor
  const tdee = bmr * activity_level;

  // 5. Safe calorie target to lose weight (500 kcal deficit = ~0.5kg/week loss)
  const loseCalories = tdee - 500;

  // 6. Crash diet check / ETA text
  const weightToLose = weight - target_weight; // kg
  let alertHTML = "";
  let etaText = "";

  if (weightToLose > 0) {
    const weeksNeededSafe = weightToLose / 0.5;
    const daysNeededSafe = Math.round(weeksNeededSafe * 7);
    etaText = `At a safe pace (0.5 kg/week), reaching ${target_weight} kg will take approximately ${daysNeededSafe} days (~${Math.round(weeksNeededSafe)} weeks).`;
    alertHTML = `<div class="alert green">✔ Recommended safe deficit: ${Math.round(loseCalories)} kcal/day. Follow this steadily — do not go below 1200 kcal/day.</div>`;
  } else if (weightToLose < 0) {
    etaText = `You want to gain ${Math.abs(weightToLose)} kg. A surplus of 300-500 kcal/day above TDEE is recommended.`;
  } else {
    etaText = `You are already at your target weight. Maintain with ${Math.round(tdee)} kcal/day.`;
  }

  // 7. Display results
  document.getElementById("resultCard").style.display = "block";
  document.getElementById("bmiValue").textContent = bmi.toFixed(1);
  document.getElementById("bmiCategory").textContent = bmiCategory;
  document.getElementById("bmrValue").textContent = Math.round(bmr);
  document.getElementById("tdeeValue").textContent = Math.round(tdee);
  document.getElementById("loseValue").textContent = Math.round(loseCalories);

  const alertBox = document.getElementById("alertBox");
  alertBox.style.display = "block";
  alertBox.innerHTML = alertHTML;
  document.getElementById("etaText").textContent = etaText;

  // 8. Save profile to the database (via backend API)
  await fetch("/api/profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId, age, gender, height, weight, activity_level, target_weight, bmi, bmr, tdee,
    }),
  });
});

// Load previous profile from the database if it exists
window.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("welcomeText").textContent = `Hi, ${getUserName()}`;

  const res = await fetch(`/api/profile/${userId}`);
  const p = await res.json();
  if (p) {
    document.getElementById("age").value = p.age || "";
    document.getElementById("gender").value = p.gender || "male";
    document.getElementById("height").value = p.height || "";
    document.getElementById("weight").value = p.weight || "";
    document.getElementById("activity").value = p.activity_level || "1.2";
    document.getElementById("targetWeight").value = p.target_weight || "";
  }
});
