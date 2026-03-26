// --- State ---
let correct = 0,
  wrong = 0,
  streak = 0;
let tolerance = 0.01;
let currentNumer = 1,
  currentDenom = 4;
let answered = false;

// Fraction pools by denominator
const DENOM_POOLS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 16, 20, 25];

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function newQuestion() {
  answered = false;
  const denom = DENOM_POOLS[Math.floor(Math.random() * DENOM_POOLS.length)];
  let numer = Math.floor(Math.random() * (denom - 1)) + 1;
  // Reduce fraction
  const g = gcd(numer, denom);
  currentNumer = numer / g;
  currentDenom = denom / g;

  document.getElementById("numerator").textContent = currentNumer;
  document.getElementById("denominator").textContent = currentDenom;

  const input = document.getElementById("answer-input");
  input.value = "";
  input.className = "";
  input.disabled = false;
  input.focus();

  document.getElementById("feedback").className = "feedback";
  document.getElementById("feedback").textContent = "";
}

function checkAnswer() {
  if (answered) {
    newQuestion();
    return;
  }

  const input = document.getElementById("answer-input");
  const raw = input.value.trim();
  const val = parseFloat(raw);
  const fb = document.getElementById("feedback");

  if (isNaN(val)) {
    fb.className = "feedback wrong";
    fb.textContent = "Enter a valid number.";
    return;
  }

  const exact = currentNumer / currentDenom;
  answered = true;
  input.disabled = true;

  if (Math.abs(val - exact) <= tolerance) {
    correct++;
    streak++;
    input.className = "correct";
    fb.className = "feedback correct";
    fb.textContent = `✓ Correct! ${currentNumer}/${currentDenom} = ${exact.toFixed(6).replace(/0+$/, "")}`;
  } else {
    wrong++;
    streak = 0;
    input.className = "wrong";
    fb.className = "feedback wrong";
    fb.textContent = `✗ The answer is ${exact.toFixed(6).replace(/0+$/, "")} — you entered ${val}`;
  }

  document.getElementById("correct-count").textContent = correct;
  document.getElementById("wrong-count").textContent = wrong;
  document.getElementById("streak").textContent = streak;

  document.getElementById("submit-btn").textContent = "Next →";
}

// Tolerance chips
document.querySelectorAll(".chip[data-tol]").forEach((chip) => {
  chip.addEventListener("click", () => {
    tolerance = parseFloat(chip.dataset.tol);
    document
      .querySelectorAll(".chip[data-tol]")
      .forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    document.getElementById("tol-display").textContent = `±${chip.dataset.tol}`;
    document.getElementById("tol-hint").textContent =
      `Answer within ±${chip.dataset.tol} accepted`;
  });
});

document.getElementById("submit-btn").addEventListener("click", checkAnswer);
document.getElementById("skip-btn").addEventListener("click", () => {
  if (
    !answered &&
    document.getElementById("answer-input").value.trim() !== ""
  ) {
    wrong++;
    streak = 0;
    document.getElementById("wrong-count").textContent = wrong;
    document.getElementById("streak").textContent = streak;
  }
  document.getElementById("submit-btn").textContent = "Check";
  newQuestion();
});

document.getElementById("answer-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") checkAnswer();
});

newQuestion();
