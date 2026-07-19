// ---------- Module: Body Fat Area + Exercise Recommendation ----------

const EXERCISE_DB = {
  belly: {
    label: "Belly / Abdomen",
    beginner: [
      { name: "Crunches", sets: "3 sets x 15 reps", desc: "Lie down, bend knees, lift shoulders off the floor slowly." },
      { name: "Plank", sets: "3 sets x 20-30 sec hold", desc: "Hold body straight on forearms and toes." },
      { name: "Walking (brisk)", sets: "20-30 min daily", desc: "Simple cardio to burn overall belly fat." },
    ],
    intermediate: [
      { name: "Bicycle Crunches", sets: "3 sets x 20 reps", desc: "Alternate elbow to opposite knee while pedaling legs." },
      { name: "Mountain Climbers", sets: "3 sets x 30 sec", desc: "Fast alternating knee drives in plank position." },
      { name: "Russian Twists", sets: "3 sets x 20 reps", desc: "Seated twist side to side holding hands together." },
    ],
    advanced: [
      { name: "Hanging Leg Raises", sets: "3 sets x 12 reps", desc: "Hang from a bar, raise legs to hip level." },
      { name: "Burpees", sets: "3 sets x 15 reps", desc: "Full-body squat-thrust-jump combo for fat burn." },
      { name: "Weighted Sit-ups", sets: "3 sets x 15 reps", desc: "Sit-ups holding light weight on chest." },
    ],
  },
  arms: {
    label: "Arms",
    beginner: [
      { name: "Wall Push-ups", sets: "3 sets x 12 reps", desc: "Push-ups against a wall to build initial strength." },
      { name: "Arm Circles", sets: "2 sets x 30 sec", desc: "Extend arms and rotate in small then large circles." },
      { name: "Bicep Curls (light weight)", sets: "3 sets x 12 reps", desc: "Use light dumbbells or water bottles." },
    ],
    intermediate: [
      { name: "Push-ups (knee or full)", sets: "3 sets x 12 reps", desc: "Standard push-up form, knees down if needed." },
      { name: "Tricep Dips", sets: "3 sets x 12 reps", desc: "Using a chair, lower and raise body using triceps." },
      { name: "Dumbbell Shoulder Press", sets: "3 sets x 12 reps", desc: "Press dumbbells overhead from shoulder height." },
    ],
    advanced: [
      { name: "Diamond Push-ups", sets: "3 sets x 12 reps", desc: "Hands close together forming a diamond shape." },
      { name: "Pull-ups", sets: "3 sets x 8 reps", desc: "Full body-weight pull using a bar." },
      { name: "Weighted Tricep Extensions", sets: "3 sets x 12 reps", desc: "Overhead extension using a dumbbell." },
    ],
  },
  thighs: {
    label: "Thighs / Legs",
    beginner: [
      { name: "Bodyweight Squats", sets: "3 sets x 15 reps", desc: "Lower hips back and down, keep knees behind toes." },
      { name: "Standing Calf Raises", sets: "3 sets x 15 reps", desc: "Rise onto toes and lower slowly." },
      { name: "Walking Lunges", sets: "3 sets x 10 reps each leg", desc: "Step forward and lower back knee toward floor." },
    ],
    intermediate: [
      { name: "Jump Squats", sets: "3 sets x 15 reps", desc: "Explosive squat with a jump at the top." },
      { name: "Step-ups", sets: "3 sets x 12 reps each leg", desc: "Step onto a sturdy platform and back down." },
      { name: "Wall Sit", sets: "3 sets x 30-40 sec", desc: "Hold sitting position against a wall." },
    ],
    advanced: [
      { name: "Bulgarian Split Squats", sets: "3 sets x 12 reps each leg", desc: "Rear foot elevated, lower into a lunge." },
      { name: "Pistol Squats", sets: "3 sets x 8 reps each leg", desc: "Single-leg squat, advanced balance required." },
      { name: "Weighted Lunges", sets: "3 sets x 12 reps each leg", desc: "Hold dumbbells while lunging." },
    ],
  },
  back: {
    label: "Back",
    beginner: [
      { name: "Superman Hold", sets: "3 sets x 20 sec", desc: "Lie face down, lift arms and legs off the floor together." },
      { name: "Cat-Cow Stretch", sets: "2 sets x 10 reps", desc: "Alternate arching and rounding the back on hands and knees." },
      { name: "Bird Dog", sets: "3 sets x 10 reps each side", desc: "Extend opposite arm and leg while on hands and knees." },
    ],
    intermediate: [
      { name: "Resistance Band Rows", sets: "3 sets x 15 reps", desc: "Pull band toward torso, squeeze shoulder blades." },
      { name: "Reverse Snow Angels", sets: "3 sets x 12 reps", desc: "Lie face down, sweep arms overhead and back." },
      { name: "Good Mornings (bodyweight)", sets: "3 sets x 12 reps", desc: "Hinge at hips keeping back straight." },
    ],
    advanced: [
      { name: "Pull-ups", sets: "3 sets x 8 reps", desc: "Full body-weight pull using a bar." },
      { name: "Deadlifts (light weight)", sets: "3 sets x 10 reps", desc: "Hinge and lift weight keeping back straight — use correct form." },
      { name: "T-Bar Rows", sets: "3 sets x 12 reps", desc: "Bent-over row targeting the mid-back." },
    ],
  },
  fullbody: {
    label: "Full Body",
    beginner: [
      { name: "Brisk Walking", sets: "30 min daily", desc: "Simple full-body cardio, low impact." },
      { name: "Bodyweight Squats", sets: "3 sets x 15 reps", desc: "Targets legs and core together." },
      { name: "Push-ups (knee)", sets: "3 sets x 10 reps", desc: "Upper body and core engagement." },
    ],
    intermediate: [
      { name: "Jumping Jacks", sets: "3 sets x 30 sec", desc: "Full-body cardio movement." },
      { name: "Burpees", sets: "3 sets x 12 reps", desc: "Combines squat, plank, and jump." },
      { name: "Mountain Climbers", sets: "3 sets x 30 sec", desc: "Core and cardio combined." },
    ],
    advanced: [
      { name: "Circuit Training", sets: "5 exercises x 3 rounds", desc: "Combine squats, push-ups, burpees, lunges, plank with minimal rest." },
      { name: "Jump Rope", sets: "3 sets x 1 min", desc: "High-intensity full-body cardio." },
      { name: "Kettlebell Swings", sets: "3 sets x 15 reps", desc: "Hip-hinge power movement for full body." },
    ],
  },
};

let selectedPart = null;
let selectedLevel = "beginner";

// 1. Render body part selection buttons
function renderBodyPartButtons() {
  const container = document.getElementById("bodyPartButtons");
  container.innerHTML = "";
  Object.keys(EXERCISE_DB).forEach(partKey => {
    const btn = document.createElement("button");
    btn.className = "bodypart-btn";
    btn.textContent = EXERCISE_DB[partKey].label;
    btn.addEventListener("click", () => {
      selectedPart = partKey;
      selectedLevel = "beginner";
      document.querySelectorAll(".bodypart-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderResult();
    });
    container.appendChild(btn);
  });
}

// 2. Render level tabs (beginner/intermediate/advanced)
function renderLevelTabs() {
  const levelTabs = document.getElementById("levelTabs");
  const levels = [
    { key: "beginner", label: "Beginner" },
    { key: "intermediate", label: "Intermediate" },
    { key: "advanced", label: "Advanced" },
  ];
  levelTabs.innerHTML = "";
  levels.forEach(level => {
    const btn = document.createElement("button");
    btn.className = "level-tab" + (level.key === selectedLevel ? " active" : "");
    btn.textContent = level.label;
    btn.addEventListener("click", () => {
      selectedLevel = level.key;
      renderResult();
    });
    levelTabs.appendChild(btn);
  });
}

// 3. Render exercise list for the selected part + level
function renderExerciseList() {
  const list = document.getElementById("exerciseList");
  list.innerHTML = "";
  const exercises = EXERCISE_DB[selectedPart][selectedLevel];

  exercises.forEach(ex => {
    const card = document.createElement("div");
    card.className = "exercise-card";
    card.innerHTML = `
      <h4>${ex.name}</h4>
      <span class="ex-sets">${ex.sets}</span>
      <p>${ex.desc}</p>
    `;
    list.appendChild(card);
  });
}

// 4. Render everything for the result section
function renderResult() {
  document.getElementById("resultCard").style.display = "block";
  document.getElementById("selectedPartTitle").textContent =
    "Exercises for " + EXERCISE_DB[selectedPart].label;
  renderLevelTabs();
  renderExerciseList();
  document.getElementById("resultCard").scrollIntoView({ behavior: "smooth" });
}

// 5. Initial load
renderBodyPartButtons();

