const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('capture-btn');
const pickBtn = document.getElementById('pick-btn');
const clearBtn = document.getElementById('clear-btn');
const fileInput = document.getElementById('file-input');
const overlayImage = document.getElementById('overlay-image');
const opacityBtn = document.getElementById('opacity-btn');

let currentOpacity = 0.5;

// 1. Mengaktifkan Kamera Depan/Belakang di Web
async function initCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }, // Menggunakan kamera belakang
            audio: false
        });
        video.srcObject = stream;
    } catch (err) {
        console.error("Gagal mengakses kamera: ", err);
        alert("Gagal membuka kamera. Pastikan memberikan izin akses kamera di browser.");
    }
}

initCamera();

// 2. Logika Pilih Foto Overlay dari Galeri
pickBtn.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const imageUrl = URL.createObjectURL(file);
        overlayImage.src = imageUrl;
        overlayImage.classList.remove('hidden');
        opacityBtn.classList.remove('hidden');
    }
});

// 3. Logika Mengubah Transparansi (Mirip fungsi di kode aslimu)
opacityBtn.addEventListener('click', () => {
    if (currentOpacity === 0.3) {
        currentOpacity = 0.6;
    } else if (currentOpacity === 0.6) {
        currentOpacity = 0.9;
    } else {
        currentOpacity = 0.3;
    }
    overlayImage.style.opacity = currentOpacity;
    opacityBtn.textContent = `Transparansi: ${Math.round(currentOpacity * 100)}%`;
});

// 4. Logika Hapus Foto Overlay
clearBtn.addEventListener('click', () => {
    overlayImage.src = '';
    overlayImage.classList.add('hidden');
    opacityBtn.classList.add('hidden');
    fileInput.value = '';
});

// 5. Logika Tombol Jepret (Menyimpan Hasil ke Galeri HP/PC)
captureBtn.addEventListener('click', () => {
    if (!video.videoWidth) {
        alert("Kamera belum siap.");
        return;
    }

    // Menyesuaikan ukuran canvas dengan video kamera
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');

    // Tangkap gambar dari video kamera
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Jika ada gambar overlay, gabungkan (cetak) langsung di atas hasil jepretan
    if (!overlayImage.classList.contains('hidden') && overlayImage.src) {
        ctx.globalAlpha = currentOpacity;
        ctx.drawImage(overlayImage, 0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1.0; // Kembalikan transparansi normal
    }

    // Ubah hasil canvas menjadi file gambar (Data URL)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

    // Otomatis mendownload / menyimpan foto ke perangkat pengguna
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `GhostCam_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
