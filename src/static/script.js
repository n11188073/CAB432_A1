let token = null;

// Helper: show popup messages
function showPopup(msg, success) {
  const popup = document.createElement("div");
  popup.textContent = msg;
  popup.style.position = "fixed";
  popup.style.top = "20px";
  popup.style.right = "20px";
  popup.style.padding = "10px 20px";
  popup.style.backgroundColor = success ? "green" : "red";
  popup.style.color = "white";
  popup.style.borderRadius = "5px";
  popup.style.zIndex = "1000";
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 3000);
}

// Show sections after login/signup
function showUserSections() {
  document.getElementById("upload-section").style.display = "block";
  document.getElementById("process-section").style.display = "block";
  document.getElementById("images-section").style.display = "block";
  document.getElementById("login-section").style.display = "none";
  document.getElementById("signup-section").style.display = "none";
}

// Load images from server
async function loadImages() {
  const res = await fetch("/images");
  const images = await res.json();
  const gallery = document.getElementById("images-gallery");
  gallery.innerHTML = "";

  images.forEach(img => {
    const imgEl = document.createElement("img");
    imgEl.src = img.url;
    imgEl.alt = img.filename;
    imgEl.style.width = "150px";
    imgEl.style.height = "150px";
    imgEl.style.objectFit = "cover";
    imgEl.style.cursor = "pointer";

    // Click to auto-fill processing
    imgEl.addEventListener("click", () => {
      document.getElementById("filename").value = img.filename;
    });

    gallery.appendChild(imgEl);
  });
}

// SIGNUP
document.getElementById("signup-btn").addEventListener("click", async () => {
  const username = document.getElementById("signup-username").value;
  const password = document.getElementById("signup-password").value;

  try {
    const res = await fetch("/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok) {
      token = data.token;
      showPopup("Sign up successful!", true);
      showUserSections();
      loadImages();
    } else showPopup(data.error || "Sign up failed", false);
  } catch {
    showPopup("Sign up failed", false);
  }
});

// LOGIN
document.getElementById("login-btn").addEventListener("click", async () => {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  try {
    const res = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok) {
      token = data.token;
      showPopup("Login successful!", true);
      showUserSections();
      loadImages();
    } else showPopup(data.error || "Login failed", false);
  } catch {
    showPopup("Login failed", false);
  }
});

// UPLOAD
document.getElementById("upload-btn").addEventListener("click", async () => {
  const fileInput = document.getElementById("image-file");
  if (!fileInput.files.length) return showPopup("Select a file first!", false);

  const formData = new FormData();
  formData.append("image", fileInput.files[0]);

  try {
    const res = await fetch("/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    if (res.ok || res.status === 200) {
      showPopup("Upload successful!", true);
      loadImages();
    } else showPopup(data.error || "Upload failed", false);
  } catch {
    showPopup("Upload failed", false);
  }
});

// PROCESS
document.getElementById("process-btn").addEventListener("click", async () => {
  const filename = document.getElementById("filename").value;
  const filter = document.getElementById("filter-select").value;
  if (!filename) return showPopup("Select an image first!", false);

  try {
    const res = await fetch(`/process/${filename}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ filter }),
    });
    const data = await res.json();
    if (res.ok) {
      showPopup("Processing successful!", true);
      loadImages();
    } else showPopup(data.error || "Processing failed", false);
  } catch {
    showPopup("Processing failed", false);
  }
});
