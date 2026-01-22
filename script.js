let mode = "pricing";
let round = 0;
let score = 0;
let history = [];

// AI competitor
let ai = { price: 22 };

// explanations
const explanations = {
  pricing: "Price elasticity: higher prices reduce quantity demanded.",
  competition: "Competition reduces margins and market power.",
  government: "Taxes and regulation discourage consumption.",
  central: "Interest rates slow borrowing and investment.",
  shock: "External shocks create unpredictable outcomes."
};

// Chart
const ctx = document.getElementById("chart").getContext("2d");
const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "You",
        data: [],
        borderColor: "#22d3ee",
        backgroundColor: "rgba(34,211,238,0.25)",
        borderWidth: 4,
        fill: true,
        tension: 0.35
      },
      {
        label: "AI Competitor",
        data: [],
        borderColor: "#f43f5e",
        borderWidth: 3,
        fill: false,
        tension: 0.35
      }
    ]
  },
  options: {
    scales: {
      x: { ticks: { color: "white" }},
      y: { ticks: { color: "white" }, beginAtZero: true }
    },
    plugins: {
      legend: { labels: { color: "white" }}
    }
  }
});

function setMode(m, btn) {
  mode = m;
  document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById("explanation").innerText = explanations[m];
}

function runRound() {
  if (round >= 12) return endGame();
  round++;

  const decision = +document.getElementById("decision").value;
  const policy = +document.getElementById("policy").value;

  // Player demand
  let demand = 100;
  if (mode === "pricing") demand = 120 - decision * 2;
  if (mode === "competition") demand = 110 - decision * 1.5 - policy;
  if (mode === "government") demand = 100 - policy * 3;
  if (mode === "central") demand = 100 - policy * 4;
  if (mode === "shock") demand = 100 + (Math.random() > 0.5 ? 30 : -30);

  demand = Math.max(0, Math.round(demand));
  const profit = decision * demand;

  // AI logic
  if (decision < ai.price) ai.price -= 1;
  else ai.price += Math.random() > 0.5 ? 1 : -1;

  const aiDemand = Math.max(0, 120 - ai.price * 1.8);
  const aiProfit = ai.price * aiDemand;

  history.push({ decision, profit });
  score += profit > aiProfit ? 2 : 1;

  // Update UI
  document.getElementById("round").innerText = round;
  document.getElementById("demand").innerText = demand;
  document.getElementById("profit").innerText = profit;
  document.getElementById("aiProfit").innerText = aiProfit;
  document.getElementById("score").innerText = score;

  document.getElementById("analysis").innerText = analyzeStrategy();

  chart.data.labels.push("R" + round);
  chart.data.datasets[0].data.push(profit);
  chart.data.datasets[1].data.push(aiProfit);
  chart.update();
}

function analyzeStrategy() {
  if (history.length < 4) return "AI Tutor: Observing strategy…";

  const prices = history.map(h => h.decision);
  const volatility = Math.max(...prices) - Math.min(...prices);

  if (volatility > 25)
    return "AI Tutor: Highly volatile pricing. Markets punish instability.";

  if (volatility < 6)
    return "AI Tutor: Stable optimization detected. Long-term viable.";

  return "AI Tutor: Adaptive strategy. Watch regulatory risk.";
}

function endGame() {
  const end = document.getElementById("end");
  end.classList.remove("hidden");

  let title = "Strategic Thinker";
  if (score > 20) title = "Economic Architect";
  if (score > 30) title = "Master of Markets";

  end.innerHTML = `
    <div class="panel">
      <h2>Simulation Complete</h2>
      <p>Final Score: ${score}</p>
      <p>Strategy Profile: <strong>${title}</strong></p>
      <button onclick="location.reload()">Run Again</button>
    </div>
  `;
}
