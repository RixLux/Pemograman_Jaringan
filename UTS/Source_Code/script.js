const content = document.getElementById("content");
const apiWeatherKey = "c3adb61bf87750fc29748e5658482325";
const apiNewsKey = "e018795657ba3f83c9fdd61e0c33adac";

// --- CACHE HELPER ---
function setCache(key, data) {
    const cacheData = {
        timestamp: Date.now(),
        data
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
}

function getCache(key, maxAge = 600000) { // default 10 menit
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const parsed = JSON.parse(cached);
    const age = Date.now() - parsed.timestamp;

    if (age > maxAge) {
        localStorage.removeItem(key); // kadaluarsa
        return null;
    }

    return parsed.data;
}

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
    switch (page) {
        case "home":
            loadHome();
            break;
        case "berita":
            loadBerita();
            break;
        case "tentang":
            loadTentang();
            break;
        case "bantuan":
            loadBantuan();
            break;
        default:
            loadHome();
    }
}

// --- HOME (Cek Cuaca) ---
function loadHome() {
    content.innerHTML = `
      <h2>Cek Cuaca</h2>
      <input type="text" id="city" placeholder="Masukkan nama kota" />
      <button id="cek">Cek Cuaca</button>
      <div id="hasil"></div>
    `;

    document.getElementById("cek").addEventListener("click", async () => {
        const city = document.getElementById("city").value.trim();
        const hasil = document.getElementById("hasil");

        if (!city) return alert("Masukkan nama kota dulu ya!");

        // Cek cache dulu
        const cached = getCache(`weather_${city}`);
        if (cached) {
            hasil.innerHTML = cached;
            console.log(" Data cuaca diambil dari cache");
            return;
        }

        hasil.innerHTML = `<p>Sedang mengambil data cuaca...</p>`;

        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},id&appid=${apiWeatherKey}&units=metric&lang=id`;
            const res = await fetch(url);
            if (!res.ok) throw new Error("Gagal mengambil data cuaca");
            const data = await res.json();

            if (data.cod === 200) {
                const html = `
                <h3>${data.name}, ${data.sys.country}</h3>
                <p><img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="icon cuaca" /></p>
                <p><b>Deskripsi:</b> ${data.weather[0].description}</p>
                <p><b>Suhu:</b> ${data.main.temp} °C</p>
                <p><b>Suhu Terendah:</b> ${data.main.temp_min} °C</p>
                <p><b>Suhu Tertinggi:</b> ${data.main.temp_max} °C</p>
                <p><b>Terasa Seperti:</b> ${data.main.feels_like} °C</p>
                <p><b>Kelembapan:</b> ${data.main.humidity}%</p>
                <p><b>Tekanan Udara:</b> ${data.main.pressure} hPa</p>
                <p><b>Kecepatan Angin:</b> ${data.wind.speed} m/s</p>
                <p><b>Arah Angin:</b> ${data.wind.deg}°</p>
                <p><b>Tingkat Awan:</b> ${data.clouds.all}%</p>
                <p><b>Visibilitas:</b> ${data.visibility} m</p>
                <p><b>Koordinat:</b> [${data.coord.lat}, ${data.coord.lon}]</p>
                <p><b>Zona Waktu:</b> UTC${data.timezone / 3600 >= 0 ? "+" : ""}${data.timezone / 3600}</p>
                <p><b>Matahari Terbit:</b> ${new Date(data.sys.sunrise * 1000).toLocaleTimeString("id-ID")}</p>
                <p><b>Matahari Terbenam:</b> ${new Date(data.sys.sunset * 1000).toLocaleTimeString("id-ID")}</p>
            `;
                hasil.innerHTML = html;

                // Simpan ke cache
                setCache(`weather_${city}`, html);
            } else {
                hasil.innerHTML = `<p>Kota tidak ditemukan!</p>`;
            }
        } catch (err) {
            hasil.innerHTML = `<p>Terjadi kesalahan saat memuat data <br>${err.message}</p>`;
        }
    });
}

// --- BERITA (API Mediastack) ---
async function loadBerita() {
    content.innerHTML = `<h2>Berita Terbaru</h2><div id="news"><p>Mengambil berita...</p></div>`;
    const newsDiv = document.getElementById("news");

    // cek cache dulu
    const cached = getCache("news_cache");
    if (cached) {
        newsDiv.innerHTML = cached;
        console.log(" Berita diambil dari cache");
        return;
    }


    //optional parameters untuk mediastack:
    //
    //     & sources = cnn,bbc
    //     & categories = business,sports
    //     & countries = us,au
    //     & languages = en,-de
    //     & keywords = virus,-corona
    //     & sort = published_desc
    //     & offset = 0
    //     & limit = 100
    //  Contoh `https://api.mediastack.com/v1/news?access_key=${apiNewsKey}&countries=us&limit=2`
    //  artinya sumber berita us dan limit yang di load hanya 2
    try {
        const url = `https://api.mediastack.com/v1/news?access_key=${apiNewsKey}&limit=2`;
        const res = await fetch(url);

        if (!res.ok) throw new Error("Gagal memuat berita");

        const data = await res.json();

        if (!data.data || data.data.length === 0) {
            newsDiv.innerHTML = `<p>Tidak ada berita ditemukan.</p>`;
            return;
        }

        const newsHTML = data.data.map(n => `
            <div class="news-item">
                <h3>${n.title}</h3>
                <p>${n.description || "Tidak ada deskripsi."}</p>
                <a href="${n.url}" target="_blank">Baca Selengkapnya</a>
            </div>
        `).join("");

        newsDiv.innerHTML = newsHTML;

        // simpan ke cache
        setCache("news_cache", newsHTML);

    } catch (err) {
        newsDiv.innerHTML = `<p>Terjadi kesalahan saat mengambil berita <br>${err.message}</p>`;
    }
}

// --- TENTANG SAYA (CV) ---
// No account yet for Linkedin, had to put it for placeholder just in case you know:)
function loadTentang() {
    content.innerHTML = `
    <section class="tentang-container">
      <div class="profile-card">
        <img src="https://i.imgur.com/dkfbSuC.jpeg" alt="Foto Profil" class="profile-photo">
        <h2 class="nama">Nobel</h2>
        <h4 class="jabatan">Web Developer | API Integration</h4>
        <p class="deskripsi">
         Halo semuanya!
            Perkenalkan, saya Afif Irham Nobel, mahasiswa semester 5 dari Program Studi Informatika. Sejak awal masuk dunia perkuliahan, saya selalu tertarik dengan dunia teknologi, terutama di bidang Jaringan walau susah sih hehehe:).
            Saya percaya bahwa teknologi bukan hanya tentang kode, tapi tentang bagaimana kita bisa menciptakan solusi nyata untuk kehidupan sehari-hari. Saat ini, saya aktif mengikuti berbagai proyek dan kegiatan yang dapat mengasah kemampuan saya, baik di bidang pemrograman maupun pengembangan sistem.
            Dengan semangat belajar yang tinggi dan rasa ingin tahu yang besar, saya ingin terus berkembang, berkolaborasi, dan berkontribusi di dunia teknologi. Harapannya, saya bisa menjadi seseorang yang tidak hanya memahami teknologi, tetapi juga mampu menghadirkan dampak positif lewat inovasi.
            Terima kasih sudah membaca sejauh ini, senang bisa berkenalan dengan kalian semua!
        </p>
        <div class="kontak">
          <p><b>Email:</b> <a href="mailto:irhamnobel@student.unp.ac.id">irhamnobel@student.unp.ac.id</a></p>
          <p><b>LinkedIn:</b> <a href="#">linkedin.com/in/nobel</a></p> 
          <p><b>GitHub:</b> <a href="https://github.com/RixLux">github.com/RixLux</a></p>
        </div>
      </div>
    </section>
  `;
}


// --- BANTUAN (FAQ) ---
function loadBantuan() {
    content.innerHTML = `
    <h2>Bantuan / FAQ</h2>
    <ol>
        <li><b>Halaman ini digunakan untuk apa?</b><br>
            Halaman ini membantu pengguna memahami fungsi aplikasi cek cuaca.</li>
        <li><b>Apa itu API?</b><br>
            API (Application Programming Interface) adalah antarmuka yang memungkinkan aplikasi saling berkomunikasi.</li>
        <li><b>API apa yang digunakan?</b><br>
            Aplikasi ini memakai <b>OpenWeatherMap</b> untuk cuaca dan <b>Mediastack</b> untuk berita.</li>
        <li><b>Apa itu RESTful?</b><br>
            RESTful memakai metode HTTP (GET, POST, PUT, DELETE) untuk pertukaran data yang efisien.</li>
    </ol>
  `;
}

// Load default page
loadHome();
