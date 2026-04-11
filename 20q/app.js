const QUESTIONS = [
  { key: "living", text: "Is it alive?" },
  { key: "animal", text: "Is it an animal?" },
  { key: "plant", text: "Is it a plant?" },
  { key: "food", text: "Can people eat it?" },
  { key: "manmade", text: "Was it made by people?" },
  { key: "electronic", text: "Does it need electricity or batteries?" },
  { key: "portable", text: "Can you carry it in your arms?" },
  { key: "large", text: "Is it bigger than a person?" },
  { key: "hasScreen", text: "Does it have a screen?" },
  { key: "hasWheels", text: "Does it have wheels?" },
  { key: "canFly", text: "Can it fly?" },
  { key: "canSwim", text: "Can it swim?" },
  { key: "wearable", text: "Do people wear it?" },
  { key: "musical", text: "Is it a musical instrument?" },
  { key: "hasPages", text: "Does it have pages?" },
  { key: "tool", text: "Is it mainly used as a tool?" },
  { key: "soft", text: "Is it soft?" },
  { key: "vehicle", text: "Is it a vehicle?" }
];

const ITEMS = [
  item("dog", "animal", { living: true, animal: true, portable: true, soft: true }, 5),
  item("cat", "animal", { living: true, animal: true, portable: true, soft: true }, 5),
  item("horse", "animal", { living: true, animal: true, large: true }, 4),
  item("elephant", "animal", { living: true, animal: true, large: true }, 3),
  item("shark", "animal", { living: true, animal: true, canSwim: true, large: true }, 4),
  item("eagle", "animal", { living: true, animal: true, canFly: true }, 4),
  item("penguin", "animal", { living: true, animal: true, canSwim: true }, 4),
  item("spider", "animal", { living: true, animal: true, portable: true }, 3),
  item("frog", "animal", { living: true, animal: true, canSwim: true, portable: true }, 4),
  item("dolphin", "animal", { living: true, animal: true, canSwim: true, large: true }, 4),
  item("apple", "food", { food: true, living: true }, 5),
  item("banana", "food", { food: true, living: true }, 4),
  item("pizza", "food", { food: true, manmade: true, soft: true, portable: true }, 5),
  item("sandwich", "food", { food: true, manmade: true, portable: true, soft: true }, 4),
  item("ice cream", "food", { food: true, manmade: true, soft: true }, 4),
  item("chocolate", "food", { food: true, manmade: true, portable: true, soft: true }, 5),
  item("smartphone", "device", { manmade: true, electronic: true, portable: true, hasScreen: true }, 5),
  item("laptop", "device", { manmade: true, electronic: true, portable: true, hasScreen: true }, 4),
  item("bicycle", "vehicle", { manmade: true, vehicle: true, hasWheels: true, portable: false }, 4),
  item("car", "vehicle", { manmade: true, vehicle: true, hasWheels: true, large: true }, 5),
  item("airplane", "vehicle", { manmade: true, vehicle: true, canFly: true, large: true }, 4),
  item("boat", "vehicle", { manmade: true, vehicle: true, canSwim: true, large: true }, 4),
  item("guitar", "instrument", { manmade: true, musical: true, portable: true }, 5),
  item("piano", "instrument", { manmade: true, musical: true, large: true }, 3),
  item("book", "object", { manmade: true, hasPages: true, portable: true }, 5),
  item("chair", "object", { manmade: true, large: true }, 4),
  item("backpack", "object", { manmade: true, portable: true }, 4),
  item("hammer", "tool", { manmade: true, tool: true, portable: true }, 5),
  item("watch", "wearable", { manmade: true, electronic: true, wearable: true, portable: true, hasScreen: true }, 4),
  item("teddy bear", "toy", { manmade: true, portable: true, soft: true }, 4),
  item("soccer ball", "toy", { manmade: true, portable: true, soft: true }, 4),
  item("candle", "object", { manmade: true, portable: true, soft: true }, 3),
  item("umbrella", "object", { manmade: true, portable: true }, 4),
  item("keys", "object", { manmade: true, portable: true, tool: true }, 4),
  item("telescope", "tool", { manmade: true, electronic: false, portable: true, tool: true }, 3),
  item("camera", "device", { manmade: true, electronic: true, portable: true, hasScreen: true }, 4),
  item("keyboard", "device", { manmade: true, electronic: true, portable: true, hasScreen: false }, 3),
  item("skateboard", "vehicle", { manmade: true, vehicle: true, hasWheels: true, portable: true }, 4),
  item("tree", "plant", { living: true, plant: true, large: true }, 5),
  item("cactus", "plant", { living: true, plant: true, portable: true }, 4),
  item("sunflower", "plant", { living: true, plant: true }, 3)
];

const MAX_QUESTIONS = 20;

const state = {
  started: false,
  questionCount: 0,
  askedKeys: new Set(),
  answers: [],
  remaining: [...ITEMS],
  currentQuestion: null,
  currentGuess: null,
  finished: false
};

const elements = {};

document.addEventListener("DOMContentLoaded", () => {
  cacheElements();
  bindEvents();
  startGame();
});

function cacheElements() {
  elements.questionsUsed = document.getElementById("questions-used");
  elements.remainingCount = document.getElementById("remaining-count");
  elements.confidenceValue = document.getElementById("confidence-value");
  elements.questionTitle = document.getElementById("question-title");
  elements.questionHelp = document.getElementById("question-help");
  elements.roundChip = document.getElementById("round-chip");
  elements.historySummary = document.getElementById("history-summary");
  elements.historyLog = document.getElementById("history-log");
  elements.shortlist = document.getElementById("shortlist");
  elements.newGameBtn = document.getElementById("new-game-btn");
  elements.skipBtn = document.getElementById("skip-btn");
  elements.answerButtons = document.querySelectorAll("[data-answer]");
}

function bindEvents() {
  elements.newGameBtn.addEventListener("click", startGame);
  elements.skipBtn.addEventListener("click", () => answerCurrent("unsure"));

  elements.answerButtons.forEach((button) => {
    button.addEventListener("click", () => answerCurrent(button.dataset.answer));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "1") {
      answerCurrent("yes");
    } else if (event.key === "2") {
      answerCurrent("no");
    } else if (event.key === "3") {
      answerCurrent("unsure");
    } else if (event.key === "Enter" && state.finished) {
      startGame();
    }
  });
}

function startGame() {
  state.started = true;
  state.questionCount = 0;
  state.askedKeys = new Set();
  state.answers = [];
  state.remaining = [...ITEMS];
  state.currentQuestion = null;
  state.currentGuess = null;
  state.finished = false;

  clearBanner();
  renderConversation([{ role: "ai", text: "Think of one of the common items on the list, then answer my questions." }]);
  askNext();
}

function askNext() {
  if (state.finished) {
    return;
  }

  if (state.remaining.length === 0) {
    finishWithMiss();
    return;
  }

  if (shouldGuess()) {
    makeGuess();
    return;
  }

  const question = pickBestQuestion();
  if (!question) {
    makeGuess();
    return;
  }

  state.currentQuestion = question;
  updateQuestionCard(question.text);
  updateStats();
  updateShortlist();
}

function answerCurrent(response) {
  if (state.finished) {
    return;
  }

  if (state.currentGuess) {
    handleGuessResponse(response);
    return;
  }

  if (!state.currentQuestion) {
    return;
  }

  state.questionCount += 1;
  state.askedKeys.add(state.currentQuestion.key);
  state.answers.push({
    kind: "question",
    role: "you",
    question: state.currentQuestion.text,
    response
  });

  if (response === "yes" || response === "no") {
    const expected = response === "yes";
    state.remaining = state.remaining.filter((item) => item.facts[state.currentQuestion.key] === expected);
  }

  renderConversation();
  state.currentQuestion = null;
  updateStats();

  if (state.questionCount >= MAX_QUESTIONS) {
    makeGuess();
    return;
  }

  askNext();
}

function handleGuessResponse(response) {
  const guess = state.currentGuess;

  if (response === "yes") {
    state.answers.push({
      kind: "guess",
      role: "ai",
      question: `My guess is ${guess.name}.`,
      response: "correct"
    });
    state.finished = true;
    state.currentGuess = null;
    renderConversation();
    updateStats();
    showBanner(`I got it. Your secret item was ${guess.name}.`, false);
    updateQuestionCard("I'm done.");
    return;
  }

  state.answers.push({
    kind: "guess",
    role: "you",
    question: `My guess was ${guess.name}.`,
    response: "wrong"
  });
  state.remaining = state.remaining.filter((item) => item.name !== guess.name);
  state.currentGuess = null;
  renderConversation();
  updateStats();
  askNext();
}

function makeGuess() {
  const guess = pickBestGuess();

  if (!guess) {
    finishWithMiss();
    return;
  }

  state.currentGuess = guess;
  updateQuestionCard(`Is it ${guess.name}?`);
  elements.questionHelp.textContent = "I'm making a guess. Tell me whether I'm right.";
  elements.roundChip.textContent = "Guess time";
  updateStats();
  updateShortlist();

  state.answers.push({
    kind: "guess",
    role: "ai",
    question: `Is it ${guess.name}?`,
    response: "guess"
  });

  renderConversation();
}

function finishWithMiss() {
  state.finished = true;
  state.currentGuess = null;
  updateQuestionCard("I'm stumped.");
  elements.questionHelp.textContent = "I ran out of useful candidates. Start over and try a different item.";
  elements.roundChip.textContent = "No match";
  updateStats();
  showBanner("I couldn't match that item with my current knowledge base.", true);
}

function shouldGuess() {
  if (state.remaining.length <= 3) {
    return true;
  }

  if (state.questionCount >= 12) {
    return true;
  }

  return state.askedKeys.size >= QUESTIONS.length;
}

function pickBestQuestion() {
  const options = QUESTIONS.filter((question) => !state.askedKeys.has(question.key));

  if (!options.length) {
    return null;
  }

  let best = null;

  for (const question of options) {
    let yesCount = 0;
    let noCount = 0;

    for (const item of state.remaining) {
      if (item.facts[question.key]) {
        yesCount += 1;
      } else {
        noCount += 1;
      }
    }

    const total = yesCount + noCount;
    if (total === 0) {
      continue;
    }

    const balance = 1 - Math.abs(yesCount - noCount) / total;
    const coverage = total / Math.max(state.remaining.length, 1);
    const score = balance * 0.85 + coverage * 0.15;

    if (!best || score > best.score) {
      best = { ...question, score };
    }
  }

  return best;
}

function pickBestGuess() {
  const scored = state.remaining
    .map((item) => ({
      ...item,
      score: scoreItem(item)
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.weight !== a.weight) return b.weight - a.weight;
      return a.name.localeCompare(b.name);
    });

  return scored[0] || null;
}

function scoreItem(item) {
  let score = item.weight;

  for (const answer of state.answers) {
    if (answer.kind !== "question") {
      continue;
    }

    const key = QUESTIONS.find((question) => question.text === answer.question)?.key;
    if (!key) {
      continue;
    }

    const actual = item.facts[key];
    if (answer.response === "yes" && actual) {
      score += 2;
    } else if (answer.response === "no" && !actual) {
      score += 2;
    } else if (answer.response === "unsure") {
      score += 0.5;
    }
  }

  return score;
}

function updateQuestionCard(text) {
  elements.questionTitle.textContent = text;

  if (!state.started) {
    elements.roundChip.textContent = "Ready";
    return;
  }

  if (state.finished) {
    elements.roundChip.textContent = state.remaining.length === 0 ? "No match" : "Solved";
    return;
  }

  if (state.currentGuess) {
    elements.roundChip.textContent = "Guess";
  } else {
    elements.roundChip.textContent = `Question ${Math.min(state.questionCount + 1, MAX_QUESTIONS)} of ${MAX_QUESTIONS}`;
  }
}

function updateStats() {
  elements.questionsUsed.textContent = String(state.questionCount);
  elements.remainingCount.textContent = String(state.remaining.length);

  const bestGuess = pickBestGuess();
  const confidence = bestGuess ? Math.min(98, Math.round((bestGuess.score / 20) * 100)) : 0;
  elements.confidenceValue.textContent = `${confidence}%`;

  if (state.finished) {
    elements.historySummary.textContent = "Game complete.";
  } else if (state.currentGuess) {
    elements.historySummary.textContent = `I'm asking about ${state.remaining.length} possible answers.`;
  } else {
    elements.historySummary.textContent = `${state.remaining.length} possibilities left.`;
  }
}

function updateShortlist() {
  const shortlist = state.remaining
    .map((item) => ({
      ...item,
      score: scoreItem(item)
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.weight !== a.weight) return b.weight - a.weight;
      return a.name.localeCompare(b.name);
    })
    .slice(0, 5);

  if (!shortlist.length) {
    elements.shortlist.innerHTML = `<div class="guess-card"><strong>No candidates left</strong><small>Start a new game to try again.</small></div>`;
    return;
  }

  elements.shortlist.innerHTML = shortlist
    .map((item, index) => {
      const confidence = Math.min(99, Math.max(35, Math.round((item.score / Math.max(shortlist[0].score, 1)) * 100)));
      return `
        <article class="guess-card">
          <strong>${index + 1}. ${escapeHtml(item.name)}</strong>
          <small>${escapeHtml(item.category)} - ${confidence}% match</small>
        </article>
      `;
    })
    .join("");
}

function renderConversation(extra = []) {
  const rendered = [];

  for (const entry of state.answers) {
    if (entry.kind === "question") {
      rendered.push({
        role: "ai",
        text: entry.question
      });
      rendered.push({
        role: entry.response === "unsure" ? "you" : "you",
        text: formatResponse(entry.response)
      });
    } else if (entry.kind === "guess" && entry.response === "guess") {
      rendered.push({
        role: "guess",
        text: entry.question
      });
    } else if (entry.kind === "guess" && entry.response === "correct") {
      rendered.push({
        role: "guess",
        text: entry.question
      });
    } else if (entry.kind === "guess" && entry.response === "wrong") {
      rendered.push({
        role: "you",
        text: "No, that is not it."
      });
    }
  }

  rendered.push(...extra);

  elements.historyLog.innerHTML = rendered
    .slice(-16)
    .map((entry) => `
      <li>
        <span class="role ${entry.role}">${entry.role === "ai" ? "AI" : entry.role === "guess" ? "Guess" : "You"}</span>
        <p>${escapeHtml(entry.text)}</p>
      </li>
    `)
    .join("");

  updateShortlist();
}

function formatResponse(response) {
  if (response === "yes") return "Yes.";
  if (response === "no") return "No.";
  return "Not sure.";
}

function showBanner(message, failure) {
  clearBanner();

  const banner = document.createElement("div");
  banner.className = `status-banner${failure ? " fail" : ""}`;
  banner.innerHTML = `<strong>${failure ? "Need another round." : "Solved."}</strong><span>${escapeHtml(message)}</span>`;

  elements.shortlist.parentElement.appendChild(banner);
}

function clearBanner() {
  const existing = elements.shortlist.parentElement.querySelector(".status-banner");
  if (existing) {
    existing.remove();
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function item(name, category, facts, weight) {
  return {
    name,
    category,
    facts: {
      living: false,
      animal: false,
      plant: false,
      food: false,
      manmade: false,
      electronic: false,
      portable: false,
      large: false,
      hasScreen: false,
      hasWheels: false,
      canFly: false,
      canSwim: false,
      wearable: false,
      musical: false,
      hasPages: false,
      tool: false,
      soft: false,
      vehicle: false,
      ...facts
    },
    weight
  };
}
