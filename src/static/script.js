let token = null;

// Signup
document.getElementById("signup-btn").onclick = async () => {
  const username = document.getElementById("signup-username").value;
  const password = document.getElementById("signup-password").value;

  const res = await fetch("/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  document.getElementById("signup-status").innerText = data.message || data.error;
};

// Login
document.getElementById("login-btn").onclick = async () => {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  const res = await fetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (data.token) {
    token = data.token;
    document.getElementById("login-status").innerText = "Logged in!";
    document.getElementById("upload-section").style.display = "block";
    document.getElementById("process-section").style.display = "block";
    document.getElementById("images-section").style.display = "block";
    loadImages();
  } else {
    document.getElementById("login-status").innerText = data.error;
  }
};

// Upload
document.getElementById("upload-btn").onclick = async () => {
  const fileInput = document.getElementById("image-file");
  if (!fileInput.files.length) return alert("Select a file!");

  const formData = new FormData();
  formData.append("image", fileInput.files[0]);

  const res = await fetch("/upload", {
    method: "POST",
    headers: { Authorization: "Bearer " + token },
    body: formData
  });

  const data = await res.json();
  alert("Uploaded: " + data.filename);
  loadImages();
};

// Process
document.getElementById("process-btn").onclick = async () => {
  const filename = document.getElementById("filename").value;
  const filter = document.getElementById("filter-select").value;

  if (!filename) return alert("Enter filename!");

  const res = await fetch("/process/" + filename, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ filter })
  });

  const data = await res.json();
  alert("Processed: " + data.filename);
  loadImages();
};

// Load and display images
async function loadImages() {
  const ul = document.getElementById("images-list");
  ul.innerHTML = "";

  // Uploaded images
  const uploadsRes = await fetch("/upload", {
    headers: { Authorization: "Bearer " + token }
  });
  const uploads = await uploadsRes.json();
  uploads.forEach(img => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>Uploaded:</strong> ${img.filename} <br><img src="/uploads/${img.filename}" width="150">`;
    ul.appendChild(li);
  });

  // Processed images
  const processedRes = await fetch("/process", {
    headers: { Authorization: "Bearer " + token }
  });
  const processed = await processedRes.json();
  processed.forEach(img => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>Processed:</strong> ${img.filename} <br><img src="/processed/${img.filename}" width="150">`;
    ul.appendChild(li);
  });
}
