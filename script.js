/* Skrip Otomatis Menghapus Background Putih pada Gambar (.png/.jpg) */
function cleanLogoBackground(imgEl) {
    if (imgEl.dataset.cleaned === "true") return;
    try {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imgEl.src;
        img.onload = function () {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imgData.data;

            // Hapus piksel warna putih/hampir putih (R>195, G>195, B>195)
            for (let i = 0; i < data.length; i += 4) {
                if (data[i] > 195 && data[i + 1] > 195 && data[i + 2] > 195) {
                    data[i + 3] = 0; // Transparan
                }
            }

            ctx.putImageData(imgData, 0, 0);
            imgEl.dataset.cleaned = "true";
            imgEl.src = canvas.toDataURL("image/png");
        };
    } catch (err) {
        console.warn("Auto clean background logo:", err);
    }
}

function getSvgAvatar(name) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="180" viewBox="0 0 300 180" fill="none">
                    <rect width="300" height="180" fill="#040d04"/>
                    <circle cx="150" cy="70" r="35" fill="#0b1b0b" stroke="#00ff66" stroke-width="2"/>
                    <path d="M150 50 C140 50 135 60 135 70 C135 80 142 85 150 85 C158 85 165 80 165 70 C165 60 160 50 150 50 Z" fill="#00ff66" opacity="0.8"/>
                    <path d="M100 145 C100 115 120 105 150 105 C180 105 200 115 200 145 Z" fill="#0b1b0b" stroke="#00ff66" stroke-width="2"/>
                    <text x="150" y="165" font-family="monospace" font-size="12" fill="#00ff66" text-anchor="middle" font-weight="bold">${name}</text>
                </svg>`;
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

function getSvgCover(title, subtitle) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225" viewBox="0 0 400 225">
                    <rect width="400" height="225" fill="#060f06"/>
                    <path d="M0 0 L400 225 M400 0 L0 225" stroke="#102510" stroke-width="2"/>
                    <circle cx="200" cy="112" r="50" fill="#0b1b0b" stroke="#00ff66" stroke-width="2"/>
                    <text x="200" y="108" font-family="sans-serif" font-size="16" fill="#00ff66" font-weight="bold" text-anchor="middle">${title}</text>
                    <text x="200" y="128" font-family="monospace" font-size="11" fill="#94a3b8" text-anchor="middle">${subtitle}</text>
                </svg>`;
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

// Canvas Partikel Background
const canvas = document.getElementById("cyber-canvas");
if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    for (let i = 0; i < 45; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            radius: Math.random() * 2 + 1
        });
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            p1.x += p1.vx;
            p1.y += p1.vy;

            if (p1.x < 0 || p1.x > canvas.width) p1.vx *= -1;
            if (p1.y < 0 || p1.y > canvas.height) p1.vy *= -1;

            ctx.beginPath();
            ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
            ctx.fillStyle = "#00ff66";
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(0, 255, 102, ${0.18 - (dist / 120) * 0.18})`;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(drawParticles);
    }
    drawParticles();
}

function switchPage(pageId) {
    const sections = document.querySelectorAll(".page-section");
    sections.forEach(s => s.classList.add("hidden"));

    const target = document.getElementById(`page-${pageId}`);
    if (target) target.classList.remove("hidden");

    const navBtns = document.querySelectorAll(".nav-btn");
    navBtns.forEach(b => b.classList.remove("active"));

    const activeBtn = document.getElementById(`nav-${pageId}`);
    if (activeBtn) activeBtn.classList.add("active");

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleMobileMenu() {
    const menu = document.getElementById("mobile-menu");
    menu.classList.toggle("open");
}

// Interaktif ID Card (Physics Rig)
let cardState = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0
};

const cardEl = document.getElementById("id-card");
const strapEl = document.getElementById("lanyard-strap");

if (cardEl) {
    cardEl.addEventListener("mousedown", startDrag);
    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", endDrag);

    cardEl.addEventListener(
        "touchstart",
        e => {
            if (e.touches && e.touches[0]) startDrag(e.touches[0]);
        },
        { passive: true }
    );

    window.addEventListener(
        "touchmove",
        e => {
            if (cardState.isDragging && e.touches && e.touches[0])
                onDrag(e.touches[0]);
        },
        { passive: true }
    );

    window.addEventListener("touchend", endDrag);
}

function startDrag(e) {
    cardState.isDragging = true;
    cardState.dragStartX = e.clientX - cardState.x;
    cardState.dragStartY = e.clientY - cardState.y;
    cardState.vx = 0;
    cardState.vy = 0;
}

function onDrag(e) {
    if (!cardState.isDragging) return;
    const newX = e.clientX - cardState.dragStartX;
    const newY = e.clientY - cardState.dragStartY;
    const maxDist = 150;
    const dist = Math.sqrt(newX * newX + newY * newY);
    const clampedDist = Math.min(dist, maxDist);
    const angle = Math.atan2(newY, newX);

    cardState.x = Math.cos(angle) * clampedDist;
    cardState.y = Math.sin(angle) * clampedDist;
    updateCardTransform();
}

function endDrag() {
    cardState.isDragging = false;
}

function shakeCard() {
    cardState.vx = (Math.random() - 0.5) * 45;
    cardState.vy = -30;
}

function updateCardTransform() {
    if (!cardEl) return;
    cardState.rotZ = (cardState.x / 150) * 25;
    cardState.rotY = (cardState.x / 150) * 20;
    cardState.rotX = -(cardState.y / 150) * 15;
    cardEl.style.transform = `translate3d(${cardState.x}px, ${cardState.y}px, 0px) rotateX(${cardState.rotX}deg) rotateY(${cardState.rotY}deg) rotateZ(${cardState.rotZ}deg)`;

    if (strapEl) {
        const defaultOffset = 40;
        const dx = cardState.x;
        const dy = cardState.y + defaultOffset;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angleRad = Math.atan2(dx, dy);
        const angleDeg = angleRad * (180 / Math.PI);
        strapEl.style.height = `${distance}px`;
        strapEl.style.transform = `rotate(${-angleDeg}deg)`;
    }
}

function physicsLoop() {
    if (!cardState.isDragging) {
        const k = 0.12;
        const damping = 0.85;
        const ax = -k * cardState.x;
        const ay = -k * cardState.y;
        cardState.vx = (cardState.vx + ax) * damping;
        cardState.vy = (cardState.vy + ay) * damping;
        cardState.x += cardState.vx;
        cardState.y += cardState.vy;
        updateCardTransform();
    }
    requestAnimationFrame(physicsLoop);
}
physicsLoop();

function openAddProjectModal() {
    document.getElementById("add-project-modal").classList.remove("hidden");
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add("hidden");
        if (modalId === "project-detail-modal") {
            document.getElementById("pd-modal-media-container").innerHTML = "";
            const btnContainer = document.getElementById(
                "pd-modal-web-btn-container"
            );
            if (btnContainer) btnContainer.innerHTML = "";
        }
    }
}

function openProjectDetail(
    title,
    desc,
    mediaUrl,
    isVideo = false,
    ratio = "16-9",
    webUrl = null
) {
    document.getElementById("pd-modal-title").innerText =
        title || "Detail Project";
    document.getElementById("pd-modal-desc").innerText =
        desc || "Tidak ada deskripsi.";

    const container = document.getElementById("pd-modal-media-container");
    container.innerHTML = "";

    const btnContainer = document.getElementById("pd-modal-web-btn-container");
    if (btnContainer) {
        btnContainer.innerHTML = "";
        if (webUrl) {
            const webBtn = document.createElement("a");
            webBtn.href = webUrl;
            webBtn.target = "_blank";
            webBtn.className = "btn-primary";
            webBtn.style.padding = "0.4rem 0.8rem";
            webBtn.style.fontSize = "0.75rem";
            webBtn.style.textDecoration = "none";
            webBtn.innerHTML =
                '<i class="fa-solid fa-arrow-up-right-from-square"></i> Kunjungi Web';
            btnContainer.appendChild(webBtn);
        }
    }

    if (isVideo) {
        const videoClass = ratio === "9-16" ? "ratio-9-16" : "ratio-16-9";
        const video = document.createElement("video");
        video.controls = true;
        video.autoplay = true;
        video.loop = true;
        video.playsInline = true;
        video.className = videoClass;

        const source = document.createElement("source");
        source.src = mediaUrl;
        source.type = "video/mp4";
        video.appendChild(source);

        container.appendChild(video);
    } else {
        const img = document.createElement("img");
        img.src = mediaUrl;
        img.alt = title;
        container.appendChild(img);
    }

    document.getElementById("project-detail-modal").classList.remove("hidden");
}

function filterProjects(cat) {
    const cards = document.querySelectorAll("#project-grid .project-card");
    cards.forEach(card => {
        if (cat === "all" || card.dataset.category === cat) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });

    const btns = document.querySelectorAll(".filter-btn");
    btns.forEach(b => b.classList.remove("active"));
    const activeBtn = document.getElementById(`filter-${cat}`);
    if (activeBtn) activeBtn.classList.add("active");
}

// Fitur AI Chat (PinAI)
function handleChatSubmit(event) {
    event.preventDefault();
    sendAIChatMessage();
}

function useQuickQuestion(qText) {
    const inputEl = document.getElementById("chat-input");
    if (inputEl) {
        inputEl.value = qText;
        sendAIChatMessage();
    }
}

async function sendAIChatMessage() {
    const inputEl = document.getElementById("chat-input");
    const userText = inputEl.value.trim();
    if (!userText) return;

    let Key = localStorage.getItem("GROQ_API_KEY") || "";
    if (!Key) {
        Key = prompt("Masukkan API Key Groq Anda:");
        if (Key) {
            localStorage.setItem("GROQ_API_KEY", Key.trim());
        } else {
            alert("API Key diperlukan!");
            return;
        }
    }

    appendChatMessage("user", userText);
    inputEl.value = "";
    const loadingId = appendChatLoading();

    const systemPrompt =
        "Anda adalah PinAI, asisten AI portofolio Akhmad Davin A.P. Anda bisa bertanya seputar kelistrikan, elektronika, atau robotika.";
    const Url = "https://api.groq.com/openai/v1/chat/completions";

    const payload = {
        model: "openai/gpt-oss-120b",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userText }
        ],
        temperature: 0.7,
        max_tokens: 1024
    };

    try {
        const response = await fetch(Url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Key.trim()}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        removeChatMessage(loadingId);

        if (!response.ok) {
            appendChatMessage(
                "ai",
                `⚠️ Error: ${data.error?.message || response.status}`
            );
            return;
        }

        const aiReply =
            data.choices?.[0]?.message?.content || "Maaf, tidak ada respon.";
        appendChatMessage("ai", aiReply);
    } catch (err) {
        removeChatMessage(loadingId);
        appendChatMessage("ai", "Gagal terhubung ke server AI.");
    }
}

function appendChatMessage(sender, text) {
    const chatList = document.getElementById("chat-messages");
    const msgDiv = document.createElement("div");
    msgDiv.className = `chat-msg ${sender}`;
    const formattedText = text
        .replace(/\n/g, "<br>")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    if (sender === "ai") {
        msgDiv.innerHTML = `<i class="fa-solid fa-robot" style="color: var(--neon-green); margin-top: 0.2rem;"></i><div class="msg-bubble">${formattedText}</div>`;
    } else {
        msgDiv.innerHTML = `<div class="msg-bubble" style="margin-left: auto; background: var(--neon-green); color: #000;">${formattedText}</div>`;
    }
    chatList.appendChild(msgDiv);
    chatList.scrollTop = chatList.scrollHeight;
}

function appendChatLoading() {
    const chatList = document.getElementById("chat-messages");
    const id = "loading-" + Date.now();
    const msgDiv = document.createElement("div");
    msgDiv.id = id;
    msgDiv.className = "chat-msg ai";
    msgDiv.innerHTML = `<i class="fa-solid fa-robot" style="color: var(--neon-green); margin-top: 0.2rem;"></i><div class="msg-bubble">PinAI sedang berpikir... 🤖</div>`;
    chatList.appendChild(msgDiv);
    chatList.scrollTop = chatList.scrollHeight;
    return id;
}

function removeChatMessage(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

function clearChat() {
    document.getElementById("chat-messages").innerHTML = `
        <div class="chat-msg ai">
            <i class="fa-solid fa-robot" style="color: var(--neon-green); margin-top: 0.2rem;"></i>
            <div class="msg-bubble">Halo! Saya PinAI, asisten AI portofolio Akhmad Davin A.P.</div>
        </div>
    `;
}

// ==========================================
// KONEKSI GOOGLE SPREADSHEET (DATABASE PROJECT)
// ==========================================
const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyZoRhb6BnJy6lmEGGh0KPd2DqLNAzfVzEsuY52HL6MlRGeDz9iog9WPE3wCh7UQBBN/exec";

// 1. Memuat Data dari Spreadsheet ke #project-grid saat Website Dibuka
function loadProjects() {
    fetch(SCRIPT_URL)
        .then(response => response.json())
        .then(data => {
            const grid = document.getElementById("project-grid");
            if (!grid) return;

            // Jangan hapus project bawaan statis, tapi kita bisa menambahkan dari spreadsheet di atasnya
            data.forEach(project => {
                // Cek apakah project sudah ada berdasarkan judul agar tidak duplikat saat diload berkali-kali
                const existingCard = Array.from(grid.children).find(card => {
                    const titleEl = card.querySelector("h3");
                    return titleEl && titleEl.innerText === project.judul;
                });

                if (!existingCard) {
                    const card = document.createElement("div");
                    card.className = "project-card";
                    card.dataset.category = project.kategori || "robotik";

                    card.innerHTML = `
                        <div class="project-media">
                            <img src="${project.gambar || ""}" alt="${project.judul || ""}" class="project-img" onerror="this.onerror=null; this.src=getSvgCover('${project.judul || "Project"}', 'Database Cloud');">
                            <span class="project-tag-badge">${project.kategori || "Project"}</span>
                        </div>
                        <div class="project-info">
                            <h3>${project.judul || ""}</h3>
                            <p>${project.deskripsi || ""}</p>
                        </div>
                        <div class="project-footer">
                            <span style="font-size: 0.7rem; font-family: var(--font-mono); color: var(--neon-green);">${project.teknologi || "Google Sheets"}</span>
                            <button onclick="openProjectDetail('${(project.judul || "").replace(/'/g, "\\'")}', '${(project.deskripsi || "").replace(/'/g, "\\'")}', '${project.gambar || ""}', false)" class="btn-sm-neon">Detail</button>
                        </div>
                    `;
                    grid.prepend(card); // Menaruh project baru di urutan paling atas
                }
            });
        })
        .catch(error =>
            console.error("Gagal memuat project dari Spreadsheet:", error)
        );
}

window.addEventListener("DOMContentLoaded", loadProjects);

// 2. Menambah Project Baru (Form dari Modal HTML Anda)
// 2. Menambah Project Baru (Form dari Modal HTML Anda)
function addNewProject(e) {
    e.preventDefault();

    const title = document.getElementById("new-p-title").value.trim();
    const cat = document.getElementById("new-p-category").value;
    const techTag = document.getElementById("new-p-tech").value.trim(); // Mengambil teks dari input baru
    const desc = document.getElementById("new-p-desc").value.trim();
    const fileInput = document.getElementById("new-p-file");

    let mediaUrl = getSvgCover(title, cat);
    if (fileInput.files && fileInput.files[0]) {
        mediaUrl = URL.createObjectURL(fileInput.files[0]);
    }

    // Siapkan data untuk dikirim ke Google Spreadsheet via Parameter URL
    const judulEnc = encodeURIComponent(title);
    const kategoriEnc = encodeURIComponent(cat);
    const deskripsiEnc = encodeURIComponent(desc);
    const gambarEnc = encodeURIComponent(mediaUrl);
    const teknologiEnc = encodeURIComponent(techTag); // Mengirim teks bebas ke Spreadsheet

    const targetUrl = `${SCRIPT_URL}?action=add&judul=${judulEnc}&kategori=${kategoriEnc}&deskripsi=${deskripsiEnc}&gambar=${gambarEnc}&teknologi=${teknologiEnc}`;

    // Kirim data ke Google Apps Script
    fetch(targetUrl)
        .then(response => response.json())
        .then(res => {
            alert("Project berhasil disimpan permanen ke Google Spreadsheet!");

            // Tambahkan langsung ke tampilan grid tanpa perlu refresh halaman
            const grid = document.getElementById("project-grid");
            const card = document.createElement("div");
            card.className = "project-card";
            card.dataset.category = cat;

            card.innerHTML = `
                <div class="project-media">
                    <img src="${mediaUrl}" alt="${title}" class="project-img">
                    <span class="project-tag-badge">${cat}</span>
                </div>
                <div class="project-info">
                    <h3>${title}</h3>
                    <p>${desc}</p>
                </div>
                <div class="project-footer">
                    <span style="font-size: 0.7rem; font-family: var(--font-mono); color: var(--neon-green);">${techTag}</span>
                    <button onclick="openProjectDetail('${title.replace(/'/g, "\\'")}', '${desc.replace(/'/g, "\\'")}', '${mediaUrl}', false)" class="btn-sm-neon">Detail</button>
                </div>
            `;
            grid.prepend(card);

            closeModal("add-project-modal");
            e.target.reset();
        })
        .catch(err => {
            console.error("Error:", err);
            alert(
                "Gagal menyimpan ke Spreadsheet. Periksa koneksi internet Anda."
            );
        });
}
