let token = "";

// Login
document.getElementById("login-btn").onclick = async () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("http://localhost:5000/auth/login", {
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
    document.getElementById("login-status").innerText = "Login failed!";
  }
};

// Upload image
document.getElementById("upload-btn").onclick = async () => {
  const fileInput = document.getElementById("image-file");
  if (!fileInput.files[0]) return alert("Select a file!");

  const formData = new FormData();
  formData.append("image", fileInput.files[0]);

  const res = await fetch("http://localhost:5000/upload", {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}` },
    body: formData
  });

  const data = await res.json();
  alert("Uploaded: " + data.filename);
  loadImages();
};

// Process image
document.getElementById("process-btn").onclick = async () => {
  const filename = document.getElementById("filename").value;
  const filter = document.getElementById("filter-select").value;
  if (!filename) return alert("Enter a filename!");

  const res = await fetch(`http://localhost:5000/process/${filename}`, {
    method: "POST",
    headers: { 
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ filter })
  });

  const data = await res.json();
  if (data.error) alert(data.error);
  else alert("Processed: " + data.filename);
  loadImages();
};

// List images
async function loadImages() {
  const res = await fetch("http://localhost:5000/images", {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const images = await res.json();
  const ul = document.getElementById("images-list");
  ul.innerHTML = "";
  images.forEach(img => {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = `http://localhost:5000/images/${img.filename}`;
    link.innerText = img.filename;
    link.target = "_blank";
    li.appendChild(link);
    li.innerText += ` (filter: ${img.filter || "none"})`;
    ul.appendChild(li);
  });
}
