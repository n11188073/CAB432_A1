let token = "";

// Popup function
function showPopup(message, success = true) {
  const popup = document.createElement("div");
  popup.textContent = message;
  popup.style.position = "fixed";
  popup.style.top = "20px";
  popup.style.right = "20px";
  popup.style.padding = "10px 20px";
  popup.style.backgroundColor = success ? "green" : "red";
  popup.style.color = "white";
  popup.style.fontWeight = "bold";
  popup.style.borderRadius = "5px";
  popup.style.zIndex = 1000;
  document.body.appendChild(popup);
  setTimeout(() => document.body.removeChild(popup), 3000);
}

// Show user sections after login/signup
function showUserSections() {
  document.getElementById("upload-section").style.display = "block";
  document.getElementById("process-section").style.display = "block";
  document.getElementById("images-section").style.display = "block";
  document.getElementById("login-section").style.display = "none";
  document.getElementById("signup-section").style.display = "none";
  loadImages();
}

// Sign up
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
    } else {
      showPopup(data.error || "Sign up failed.", false);
    }
  } catch (err) {
    showPopup("Sign up failed.", false);
  }
});

// Login
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
    } else {
      showPopup(data.error || "Login failed.", false);
    }
  } catch (err) {
    showPopup("Login failed.", false);
  }
});

// Upload images
document.getElementById("upload-btn").addEventListener("click", async () => {
  const files = document.getElementById("image-file").files;
  if (!files.length) return showPopup("Select at least one file.", false);

  const formData = new FormData();
  for (let file of files) {
    formData.append("images", file);
  }

  try {
    const res = await fetch("/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    if (res.ok) {
      showPopup("Upload successful!", true);
      loadImages();
    } else {
      showPopup(data.error || "Upload failed.", false);
    }
  } catch (err) {
    showPopup("Upload failed.", false);
  }
});

// Load images gallery
async function loadImages() {
  try {
    const res = await fetch("/images", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    const gallery = document.getElementById("images-gallery");
    gallery.innerHTML = "";

    data.forEach(img => {
      const imgEl = document.createElement("img");
      imgEl.src = `/images/uploads/${img.filename}`;
      imgEl.title = img.filename;
      imgEl.addEventListener("click", () => processImage(img.filename));
      gallery.appendChild(imgEl);

      // Also show processed images
      if (img.processed) {
        img.processed.forEach(pImg => {
          const pEl = document.createElement("img");
          pEl.src = `/images/processed/${pImg.filename}`;
          pEl.title = pImg.filename;
          gallery.appendChild(pEl);
        });
      }
    });
  } catch (err) {
    console.error(err);
  }
}

// Process image
async function processImage(filename) {
  const filter = document.getElementById("filter-select").value;
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
      showPopup(`Image processed (${filter})!`, true);
      loadImages();
    } else {
      showPopup(data.error || "Processing failed.", false);
    }
  } catch (err) {
    showPopup("Processing failed.", false);
  }
}
