// ==================== FIREBASE CONFIG ====================
const firebaseConfig = {
  apiKey: "AIzaSyAgTFTyKIPSYcL6kLCaO9PLdbR1CVl7CTE",
  authDomain: "exam-review-app.firebaseapp.com",
  databaseURL: "https://exam-review-app-default-rtdb.firebaseio.com",
  projectId: "exam-review-app",
  storageBucket: "exam-review-app.firebasestorage.app",
  messagingSenderId: "898679283898",
  appId: "1:898679283898:web:633bd915191b6aeebca283",
  measurementId: "G-8FVXZ4LBSQ"
};

// Initialise Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ==================== FUNCTIONS ====================
function submitSingleQuestion() {
  const username = document.getElementById("username").value.trim();
  const question = document.getElementById("questionInput").value.trim();

  if (!username) {
    alert("Please enter your name.");
    return;
  }
  if (!question) {
    alert("Please enter a question.");
    return;
  }

  // Save question to Firebase
  db.ref("submissions").push({ username, question });

  // Clear input
  document.getElementById("questionInput").value = "";
  showResults();
}

function showResults() {
  db.ref("submissions").once("value", (snapshot) => {
    const data = snapshot.val() || {};
    const counts = {};

    // Count votes
    Object.values(data).forEach((sub) => {
      counts[sub.question] = (counts[sub.question] || 0) + 1;
    });

    // Sort by most votes
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

    // Display results
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    sorted.forEach(([question, count]) => {
      const div = document.createElement("div");
      div.className = "question-item";
      div.textContent = `${question} — (${count} votes)`;
      resultsDiv.appendChild(div);
    });

    document.getElementById("results-section").style.display = "block";
  });
}

function showLeaderboard() {
  db.ref("submissions").once("value", (snapshot) => {
    const data = snapshot.val() || {};
    const counts = {};

    Object.values(data).forEach((sub) => {
      counts[sub.question] = (counts[sub.question] || 0) + 1;
    });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

    const leaderboardDiv = document.getElementById("leaderboard");
    leaderboardDiv.innerHTML = "";

    sorted.forEach(([question, count], index) => {
      const div = document.createElement("div");
      div.className = "question-item";
      div.textContent = `#${index + 1}: ${question} — (${count} votes)`;
      leaderboardDiv.appendChild(div);
    });

    document.getElementById("form-section").style.display = "none";
    document.getElementById("results-section").style.display = "none";
    document.getElementById("leaderboard-section").style.display = "block";
  });
}

function hideLeaderboard() {
  document.getElementById("leaderboard-section").style.display = "none";
  document.getElementById("form-section").style.display = "block";
  document.getElementById("results-section").style.display = "block";
}
