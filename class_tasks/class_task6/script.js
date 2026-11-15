// Global state
let students = JSON.parse(localStorage.getItem("students")) || [];
let sortDesc = false;

const subjectIds = ["programming", "mathematics", "english", "database", "networks"];
const subjectNames = {
  programming: "Programming",
  mathematics: "Mathematics",
  english: "English",
  database: "Database",
  networks: "Computer Networks"
};

/* ---------- Theme Switching ---------- */
function changeTheme(theme) {
  document.body.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

/* ---------- Task 3 & 4: Form Validation ---------- */
function validateForm() {
  const nameInput = document.getElementById("name");
  const regNoInput = document.getElementById("regNo");
  const name = nameInput.value.trim();
  const regNo = regNoInput.value.trim();

  // Validate Name and Registration Number
  if (!name || !regNo) {
    alert("Please enter both Student Name and Registration Number.");
    if (!name) nameInput.focus();
    else regNoInput.focus();
    return false;
  }

  // Validate Marks for each subject
  for (const id of subjectIds) {
    const input = document.getElementById(id);
    const value = input.value.trim();

    if (value === "") {
      alert("Please fill in marks for all five subjects (" + subjectNames[id] + " is missing).");
      input.focus();
      return false;
    }

    const marks = Number(value);
    if (isNaN(marks) || marks < 0 || marks > 100) {
      alert("Marks must be between 0 and 100! (Check: " + subjectNames[id] + ")");
      input.focus();
      return false;
    }
  }

  // Prevent duplicate registration numbers (case-insensitive)
  const isDuplicate = students.some(
    s => s.regNo.trim().toLowerCase() === regNo.toLowerCase()
  );

  if (isDuplicate) {
    alert("Registration number '" + regNo + "' already exists! Please enter a unique registration number.");
    regNoInput.focus();
    return false;
  }

  return true;
}

/* ---------- Task 3: Calculations ---------- */

/**
 * Calculates total marks obtained across 5 subjects.
 * Accepts either an array of numbers, individual numeric arguments, or reads from inputs if omitted.
 */
function calculateTotal(...args) {
  let marks;
  if (args.length === 0) {
    marks = subjectIds.map(id => Number(document.getElementById(id).value) || 0);
  } else if (args.length === 1 && Array.isArray(args[0])) {
    marks = args[0];
  } else {
    marks = args;
  }
  return marks.reduce((sum, m) => sum + Number(m), 0);
}

/**
 * Calculates the percentage out of 500.
 */
function calculatePercentage(total) {
  if (total === undefined) {
    total = calculateTotal();
  }
  return (Number(total) / 500) * 100;
}

/**
 * Assigns a grade based on percentage:
 * 90–100%: A | 80–89%: B | 70–79%: C | 60–69%: D | Below 60%: F
 */
function calculateGrade(percentage) {
  if (percentage === undefined) {
    percentage = calculatePercentage();
  }
  const p = Number(percentage);
  if (p >= 90) return "A";
  if (p >= 80) return "B";
  if (p >= 70) return "C";
  if (p >= 60) return "D";
  return "F";
}

/**
 * Pass/Fail Rule:
 * A student must obtain at least 40 marks in each subject to pass.
 * If the student scores below 40 in any subject, status is Fail.
 */
function checkStatus(...args) {
  let marks;
  if (args.length === 0) {
    marks = subjectIds.map(id => Number(document.getElementById(id).value));
  } else if (args.length === 1 && Array.isArray(args[0])) {
    marks = args[0];
  } else {
    marks = args;
  }
  return marks.every(m => Number(m) >= 40) ? "Pass" : "Fail";
}

/**
 * Calculates the average percentage of all students in the class.
 */
function calculateClassAverage() {
  if (!students || students.length === 0) return 0;
  const sum = students.reduce((total, s) => total + Number(s.percentage), 0);
  return sum / students.length;
}

/* ---------- Student Management: Add, Delete, Clear ---------- */

function addStudent() {
  if (!validateForm()) return;

  const marks = subjectIds.map(id => Number(document.getElementById(id).value.trim()));
  const total = calculateTotal(marks);
  const percentage = calculatePercentage(total);
  const grade = calculateGrade(percentage);
  const status = checkStatus(marks);

  const student = {
    name: document.getElementById("name").value.trim(),
    regNo: document.getElementById("regNo").value.trim(),
    marks: {
      programming: marks[0],
      mathematics: marks[1],
      english: marks[2],
      database: marks[3],
      networks: marks[4]
    },
    total: total,
    percentage: percentage,
    grade: grade,
    status: status
  };

  students.push(student);
  saveData();
  clearForm();
  renderTable();
}

function deleteStudent(regNo) {
  if (confirm("Are you sure you want to delete student record '" + regNo + "'?")) {
    students = students.filter(s => s.regNo.toLowerCase() !== regNo.toLowerCase());
    saveData();
    renderTable();
  }
}

function clearAll() {
  if (students.length === 0) {
    alert("No student records to clear.");
    return;
  }
  if (confirm("Are you sure you want to delete all student records? This action cannot be undone.")) {
    students = [];
    saveData();
    renderTable();
  }
}

function toggleSort() {
  sortDesc = !sortDesc;
  const sortBtn = document.getElementById("sortBtn");
  if (sortBtn) {
    sortBtn.textContent = sortDesc ? "Sort: High to Low \u2193" : "Sort by %";
  }
  renderTable();
}

/* ---------- Rendering & DOM Manipulation ---------- */

function renderTable() {
  const tbody = document.getElementById("resultsBody");
  const emptyMsg = document.getElementById("emptyMsg");
  const searchBox = document.getElementById("searchBox");
  const query = searchBox ? searchBox.value.trim().toLowerCase() : "";

  // Search filter (Bonus Challenge)
  let list = students.filter(s =>
    s.regNo.toLowerCase().includes(query) || s.name.toLowerCase().includes(query)
  );

  // Sort by percentage (Bonus Challenge)
  if (sortDesc) {
    list = [...list].sort((a, b) => b.percentage - a.percentage);
  }

  tbody.innerHTML = "";

  if (list.length === 0) {
    emptyMsg.style.display = "block";
    emptyMsg.textContent = students.length === 0
      ? "No students added yet."
      : "No students matching '" + query + "' found.";
  } else {
    emptyMsg.style.display = "none";
    list.forEach(s => {
      const row = document.createElement("tr");

      const formattedPercentage = Number.isInteger(s.percentage)
        ? s.percentage + "%"
        : s.percentage.toFixed(1) + "%";

      row.innerHTML = `
        <td><strong>${escapeHtml(s.regNo)}</strong></td>
        <td>${escapeHtml(s.name)}</td>
        <td>${s.total}</td>
        <td>${formattedPercentage}</td>
        <td><span class="grade grade-${s.grade}">${s.grade}</span></td>
        <td><span class="status-badge ${s.status.toLowerCase()}">${s.status}</span></td>
        <td><button class="del-btn" onclick="deleteStudent('${escapeJs(s.regNo)}')">Delete</button></td>
      `;
      tbody.appendChild(row);
    });
  }

  updateSummary();
}

function updateSummary() {
  const totalStudentsEl = document.getElementById("totalStudents");
  const classAverageEl = document.getElementById("classAverage");
  const topStudentEl = document.getElementById("topStudent");

  totalStudentsEl.textContent = students.length;

  if (students.length === 0) {
    classAverageEl.textContent = "0%";
    topStudentEl.textContent = "-";
    return;
  }

  const avg = calculateClassAverage();
  classAverageEl.textContent = (Number.isInteger(avg) ? avg : avg.toFixed(1)) + "%";

  const top = students.reduce((best, s) => (s.percentage > best.percentage ? s : best));
  const topPct = Number.isInteger(top.percentage) ? top.percentage + "%" : top.percentage.toFixed(1) + "%";
  topStudentEl.textContent = `${top.name} (${topPct})`;
}

/* ---------- Helpers ---------- */

function clearForm() {
  document.getElementById("name").value = "";
  document.getElementById("regNo").value = "";
  subjectIds.forEach(id => {
    const input = document.getElementById(id);
    if (input) input.value = "";
  });
  document.getElementById("name").focus();
}

function saveData() {
  localStorage.setItem("students", JSON.stringify(students));
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeJs(str) {
  return String(str).replace(/'/g, "\\'");
}

/* ---------- Initialization ---------- */
changeTheme(localStorage.getItem("theme") || "ocean");
renderTable();