
const bookingForm = document.getElementById("booking-form");
const originInput = document.getElementById("origin");
const destinationInput = document.getElementById("destination");
const dateInput = document.getElementById("travel-date");
const passengerInput = document.getElementById("passengers");

const scheduleSection = document.getElementById("schedule-section");
const trainList = document.getElementById("train-list");
const journeySummary = document.getElementById("journey-summary");

const passengerSection = document.getElementById("passenger-section");
const selectedJourney = document.getElementById("selected-journey");
const passengerName = document.getElementById("passenger-name");
const identityNumber = document.getElementById("identity-number");

const confirmationSection = document.getElementById("confirmation-section");
const confirmationDetails = document.getElementById("confirmation-details");
const confirmCheckbox = document.getElementById("confirm-checkbox");
const createTicketButton = document.getElementById("create-ticket");

const ticketSection = document.getElementById("ticket-section");
const ticketContent = document.getElementById("ticket-content");
const message = document.getElementById("message");

let selectedTrain = null;
let currentBooking = null;

// Jadwal kereta contoh untuk simulasi
const trains = [
  { name: "Argo Bromo Anggrek", departure: "08:00", arrival: "11:15", price: 250000 },
  { name: "Argo Semeru", departure: "10:30", arrival: "13:45", price: 220000 },
  { name: "Gajayana", departure: "13:00", arrival: "16:30", price: 200000 },
  { name: "Bima", departure: "16:00", arrival: "19:20", price: 180000 }
];

// Mengatur tanggal minimum ke hari ini
const today = new Date();
const localToday = new Date(
  today.getTime() - today.getTimezoneOffset() * 60000
).toISOString().split("T")[0];

dateInput.min = localToday;
dateInput.value = localToday;

// Menampilkan pesan
function showMessage(text, type = "error") {
  message.textContent = text;
  message.className = `message ${type}`;
  message.classList.remove("hidden");

  message.scrollIntoView({ behavior: "smooth", block: "center" });
}

function hideMessage() {
  message.textContent = "";
  message.className = "message hidden";
}

// Format harga menjadi Rupiah
function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(amount);
}

// Format tanggal agar mudah dibaca
function formatDate(dateString) {
  return new Date(`${dateString}T12:00:00`).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

// Kembali ke bagian pemesanan
function scrollToForm() {
  bookingForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Tombol tukar stasiun asal dan tujuan
document.getElementById("swap-button").addEventListener("click", () => {
  const temporaryOrigin = originInput.value;
  originInput.value = destinationInput.value;
  destinationInput.value = temporaryOrigin;
});

// Memproses pencarian jadwal
bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  hideMessage();

  const origin = originInput.value;
  const destination = destinationInput.value;
  const date = dateInput.value;
  const passengers = Number(passengerInput.value);

  if (!origin || !destination || !date || !passengers) {
    showMessage("Bro, lengkapi semua data perjalanan terlebih dahulu.");
    return;
  }

  if (origin === destination) {
    showMessage("Stasiun asal dan tujuan tidak boleh sama.");
    return;
  }

  if (date < localToday) {
    showMessage("Tanggal keberangkatan tidak boleh lewat.");
    return;
  }

  selectedTrain = null;
  currentBooking = null;
  confirmationSection.classList.add("hidden");
  passengerSection.classList.add("hidden");
  ticketSection.classList.add("hidden");

  journeySummary.textContent =
    `${origin} → ${destination} | ${formatDate(date)} | ${passengers} penumpang`;

  trainList.innerHTML = "";

  trains.forEach((train, index) => {
    const totalPrice = train.price * passengers;
    const card = document.createElement("div");

    card.className = "train-option";
    card.innerHTML = `
      <div>
        <h3>${train.name}</h3>
        <p>${train.departure} → ${train.arrival}</p>
        <p>${origin} ke ${destination}</p>
      </div>
      <div>
        <strong>${formatRupiah(totalPrice)}</strong>
        <button type="button" class="select-train-button">
          Pilih Kereta
        </button>
      </div>
    `;

    card.querySelector(".select-train-button").addEventListener("click", () => {
      selectedTrain = {
        ...train,
        origin,
        destination,
        date,
        passengers,
        totalPrice
      };

      document.querySelectorAll(".train-option").forEach((option) => {
        option.classList.remove("selected");
      });

      card.classList.add("selected");
      passengerSection.classList.remove("hidden");
      confirmationSection.classList.add("hidden");
      ticketSection.classList.add("hidden");

      selectedJourney.textContent =
        `${train.name} | ${origin} → ${destination} | ` +
        `${formatDate(date)} | ${train.departure}–${train.arrival} | ` +
        `${passengers} penumpang | ${formatRupiah(totalPrice)}`;

      passengerSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });

    trainList.appendChild(card);
  });

  scheduleSection.classList.remove("hidden");
  scheduleSection.scrollIntoView({ behavior: "smooth", block: "start" });
});

// Kembali ke formulir pencarian
document.getElementById("back-to-form").addEventListener("click", scrollToForm);

// Lanjut ke ringkasan pesanan
document.getElementById("continue-to-passenger").addEventListener("click", () => {
  if (!selectedTrain) {
    showMessage("Pilih salah satu kereta terlebih dahulu.");
    return;
  }

  passengerSection.scrollIntoView({ behavior: "smooth", block: "start" });
});

// Kembali ke daftar jadwal
document.getElementById("back-to-schedule").addEventListener("click", () => {
  scheduleSection.scrollIntoView({ behavior: "smooth", block: "start" });
});

// Menampilkan konfirmasi sebelum tiket dibuat
document.getElementById("review-booking").addEventListener("click", () => {
  hideMessage();

  if (!selectedTrain) {
    showMessage("Pilih jadwal kereta terlebih dahulu.");
    return;
  }

  const name = passengerName.value.trim();
  const identity = identityNumber.value.trim();

  if (name.length < 3) {
    showMessage("Nama penumpang minimal 3 karakter.");
    passengerName.focus();
    return;
  }

  if (identity.length < 5) {
    showMessage("Nomor identitas minimal 5 karakter untuk simulasi ini.");
    identityNumber.focus();
    return;
  }

  currentBooking = {
    ...selectedTrain,
    passengerName: name,
    identityNumber: identity
  };

  confirmationDetails.innerHTML = `
    <p><strong>Nama:</strong> ${escapeHTML(name)}</p>
    <p><strong>Nomor identitas:</strong> ${escapeHTML(identity)}</p>
    <p><strong>Kereta:</strong> ${escapeHTML(selectedTrain.name)}</p>
    <p><strong>Rute:</strong> ${escapeHTML(selectedTrain.origin)} → ${escapeHTML(selectedTrain.destination)}</p>
    <p><strong>Tanggal:</strong> ${formatDate(selectedTrain.date)}</p>
    <p><strong>Waktu:</strong> ${selectedTrain.departure}–${selectedTrain.arrival}</p>
    <p><strong>Jumlah penumpang:</strong> ${selectedTrain.passengers}</p>
    <p><strong>Total simulasi:</strong> ${formatRupiah(selectedTrain.totalPrice)}</p>
  `;

  confirmCheckbox.checked = false;
  createTicketButton.disabled = true;
  confirmationSection.classList.remove("hidden");
  confirmationSection.scrollIntoView({ behavior: "smooth", block: "start" });
});

// Pengguna wajib menyetujui ringkasan sebelum membuat tiket
confirmCheckbox.addEventListener("change", () => {
  createTicketButton.disabled = !confirmCheckbox.checked;
});

// Mengamankan teks yang dimasukkan pengguna saat ditampilkan sebagai HTML
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

// Membuat tiket digital simulasi
createTicketButton.addEventListener("click", () => {
  if (!currentBooking || !confirmCheckbox.checked) {
    showMessage("Periksa ringkasan dan centang konfirmasi terlebih dahulu.");
    return;
  }

  const bookingCode = "KAI" + Math.random().toString(36).slice(2, 8).toUpperCase();

  ticketContent.innerHTML = `
    <div class="ticket-heading">
      <p class="ticket-label">E-TICKET · SIMULASI</p>
      <h2>KAI Kiosk</h2>
      <p>Kode pemesanan: <strong>${bookingCode}</strong></p>
    </div>

    <div class="ticket-route">
      <div>
        <span>STASIUN ASAL</span>
        <h2>${escapeHTML(currentBooking.origin)}</h2>
        <p>${currentBooking.departure}</p>
      </div>
      <div class="route-arrow">→</div>
      <div>
        <span>STASIUN TUJUAN</span>
        <h2>${escapeHTML(currentBooking.destination)}</h2>
        <p>${currentBooking.arrival}</p>
      </div>
    </div>

    <hr>

    <div class="ticket-details">
      <p><strong>Nama penumpang</strong><br>${escapeHTML(currentBooking.passengerName)}</p>
      <p><strong>Nomor identitas</strong><br>${escapeHTML(currentBooking.identityNumber)}</p>
      <p><strong>Kereta</strong><br>${escapeHTML(currentBooking.name)}</p>
      <p><strong>Tanggal keberangkatan</strong><br>${formatDate(currentBooking.date)}</p>
      <p><strong>Jumlah penumpang</strong><br>${currentBooking.passengers}</p>
      <p><strong>Total simulasi</strong><br>${formatRupiah(currentBooking.totalPrice)}</p>
    </div>

    <p class="ticket-notice">
      Ini adalah tiket demonstrasi untuk tugas RPL, bukan tiket kereta resmi.
      Tidak ada pemesanan atau pembayaran sungguhan.
    </p>
  `;

  confirmationSection.classList.add("hidden");
  ticketSection.classList.remove("hidden");
  ticketSection.scrollIntoView({ behavior: "smooth", block: "start" });
  hideMessage();
});

// Cetak tiket atau simpan sebagai PDF melalui dialog browser
document.getElementById("print-ticket").addEventListener("click", () => {
  window.print();
});

// Memulai pemesanan baru
document.getElementById("new-booking").addEventListener("click", () => {
  bookingForm.reset();
  dateInput.value = localToday;

  trainList.innerHTML = "";
  journeySummary.textContent = "";
  passengerName.value = "";
  identityNumber.value = "";

  selectedTrain = null;
  currentBooking = null;

  scheduleSection.classList.add("hidden");
  passengerSection.classList.add("hidden");
  confirmationSection.classList.add("hidden");
  ticketSection.classList.add("hidden");

  hideMessage();
  scrollToForm();
});
