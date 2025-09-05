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

// Submit a question (max 20 per user)
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

  // Check current number of questions by this user
  db.ref("submissions").orderByChild("username").equalTo(username).once("value", snapshot => {
    if (snapshot.numChildren() >= 35) {
      alert("You have reached the maximum of 35 questions.");
      return;
    }

    // Save the question
    db.ref("submissions").push({ username, question });
    document.getElementById("questionInput").value = "";
    showResults();
  });
}

// Show progress/results
function showResults() {
  db.ref("submissions").once("value", snapshot => {
    const data = snapshot.val() || {};
    const counts = {};

    Object.values(data).forEach(sub => {
      counts[sub.question] = (counts[sub.question] || 0) + 1;
    });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = '';

    sorted.forEach(([question, count]) => {
      const div = document.createElement("div");
      div.className = "question-item";
      div.textContent = `${question} - (${count} votes)`; // small dash
      resultsDiv.appendChild(div);
    });

    document.getElementById("results-section").style.display = "block";
  });
}

// Show leaderboard
function showLeaderboard() {
  db.ref("submissions").once("value", snapshot => {
    const data = snapshot.val() || {};
    const counts = {};

    Object.values(data).forEach(sub => {
      counts[sub.question] = (counts[sub.question] || 0) + 1;
    });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const leaderboardDiv = document.getElementById("leaderboard");
    leaderboardDiv.innerHTML = '';

    sorted.forEach(([question, count], index) => {
      const div = document.createElement("div");
      div.className = "question-item";
      div.textContent = `#${index + 1}: ${question} - (${count} votes)`; // small dash
      leaderboardDiv.appendChild(div);
    });

    document.getElementById("form-section").style.display = "none";
    document.getElementById("results-section").style.display = "none";
    document.getElementById("leaderboard-section").style.display = "block";
  });
}

// Hide leaderboard and go back
function hideLeaderboard() {
  document.getElementById("leaderboard-section").style.display = "none";
  document.getElementById("form-section").style.display = "block";
  document.getElementById("results-section").style.display = "block";
}
