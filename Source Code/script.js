const content = document.getElementById("content");
const apiWeatherKey = G092;
const apiNewsKey = e018795657ba3f83c9fdd61e0c33adac;

// --- NAVIGATION ---
document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const page = link.dataset.page;
    loadPage(page);
  });
});

// --- PAGE LOADER ---
function loadPage(page) {
  if (page === "home") showHome();
  else if (page === "berita") showBerita();
  else if (page === "tentang") showTentang();
  else if (page === "bantuan") showBantuan();
}

// --- HOME PAGE (Cek Cuaca) ---
function showHome() {
  content.innerHTML = `
    <h2>Cek Cuaca</h2>
    <input type="text" id="city" placeholder="Masukkan nama kota">
    <button id="cekBtn">Cek</button>
    <div id="result"></div>
  `;

  document.getElementById("cekBtn").addEventListener("click", () => {
    const city = document.getElementById("city").value;
    const url = 'https://api.openweathermap.org/data/2.5/weather?q=\${city}&appid=\${apiWeatherKey}&units=metric&lang=id';

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.cod === 200) {
          document.getElementById("result").innerHTML = `
            <h3>\${data.name}</h3>
            <p>Suhu: \${data.main.temp}°C</p>
            <p>Cuaca: \${data.weather[0].description}</p>
          `;
        } else {
          document.getElementById("result").innerHTML = "Kota tidak ditemukan!";
        }
      })
      .catch(() => {
        document.getElementById("result").innerHTML = "Terjadi kesalahan!";
      });
  });
}

// --- BERITA PAGE (Mediastack API) ---
function showBerita() {
  content.innerHTML = `<h2>Berita Terbaru</h2><div id="news">Memuat berita...</div>`;

  const url = `http://api.mediastack.com/v1/news?access_key=\${apiNewsKey}&countries=id&limit=5`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.data) {
        const html = data.data.map(article => `
          <div class="berita">
            <h3>${article.title}</h3>
            <p>${article.description || "Tidak ada deskripsi."}</p>
            <a href="${article.url}" target="_blank">Baca selengkapnya</a>
          </div>
        `).join("");
        document.getElementById("news").innerHTML = html;
      } else {
        document.getElementById("news").innerHTML = "Tidak bisa memuat berita.";
      }
    })
    .catch(() => {
      document.getElementById("news").innerHTML = "Gagal memuat berita!";
    });
}

// --- TENTANG SAYA PAGE ---
function showTentang() {
  content.innerHTML = `
    <h2>Tentang Saya</h2>
    <p><b>Nama:</b> Nii-san</p>
    <p><b>Status:</b> Mahasiswa</p>
    <p><b>Email:</b> email@kampus.ac.id</p>
    <p><b>Deskripsi:</b> Mahasiswa yang sedang belajar membuat website menggunakan API untuk cuaca dan berita.</p>
  `;
}

// --- BANTUAN PAGE (FAQ) ---
function showBantuan() {
  content.innerHTML = `
    <h2>Bantuan (FAQ)</h2>
    <ol>
      <li><b>Halaman ini digunakan untuk apa?</b><br>
      Halaman ini digunakan untuk membantu pengguna memahami fungsi aplikasi dan cara kerjanya.</li>

      <li><b>Apa itu API?</b><br>
      API (Application Programming Interface) adalah jembatan yang memungkinkan aplikasi berkomunikasi dengan sistem lain untuk mengambil atau mengirim data.</li>

      <li><b>API apa yang digunakan dalam aplikasi ini?</b><br>
      Aplikasi ini menggunakan dua API: 
      <ul>
        <li>OpenWeatherMap API untuk data cuaca</li>
        <li>Mediastack API untuk berita terkini</li>
      </ul></li>

      <li><b>Salah satu pola arsitektur API adalah RESTful.</b><br>
      RESTful API menggunakan protokol HTTP untuk mengirim permintaan (GET, POST, PUT, DELETE) dan mengembalikan data dalam format JSON yang mudah dibaca.</li>
    </ol>
  `;
}

// --- Load halaman awal ---
loadPage("home");
