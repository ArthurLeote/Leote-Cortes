
const BUSINESS_PHONE = "5585982221133";
const SERVICES = [
    { id: 1, name: "Corte Social", price: 35, duration: "30 min" },
    { id: 2, name: "Corte Degradê", price: 40, duration: "40 min" },
    { id: 3, name: "Corte na Tesoura", price: 40, duration: "40 min" },
    { id: 4, name: "Barba", price: 20, duration: "10 min" },
    { id: 5, name: "Sobrancelha", price: 5, duration: "5 min" }
];

let state = {
    service: null,
    date: new Date().toISOString().split('T')[0],
    time: null,
    location: null
};

const steps = {
    1: document.getElementById('step-1'),
    2: document.getElementById('step-2'),
    3: document.getElementById('step-3'),
    4: document.getElementById('step-4')
};

const servicesList = document.getElementById('services-list');
const timeList = document.getElementById('time-list');
const dateInput = document.getElementById('date-input');
const summaryService = document.getElementById('summary-service');
const summaryDate = document.getElementById('summary-date');
const summaryTime = document.getElementById('summary-time');
const summaryLocation = document.getElementById('summary-location');
const summaryPrice = document.getElementById('summary-price');
const whatsappBtn = document.getElementById('whatsapp-btn');


function init() {
    renderServices();
    dateInput.value = state.date;
    dateInput.min = new Date().toISOString().split('T')[0];

    dateInput.addEventListener('change', (e) => {
        state.date = e.target.value;
        renderTimeSlots();
    });
    whatsappBtn.addEventListener('click', sendToWhatsApp);
}


function goToStep(stepNumber) {
   Object.values(steps).forEach(step => {
        step.classList.remove('active');
        step.classList.add('hidden');
    });
    steps[stepNumber].classList.remove('hidden');
    steps[stepNumber].classList.add('active');

    if (stepNumber === 2) {
        renderTimeSlots();
    }
    if (stepNumber === 4) {
        updateSummary();
    }
}


function renderServices() {
    servicesList.innerHTML = SERVICES.map(service => `
        <div class="service-card" onclick="selectService(${service.id})">
            <div class="service-info">
                <h3>${service.name}</h3>
                <p>${service.duration}</p>
            </div>
            <div class="service-price">R$ ${service.price},00</div>
        </div>
    `).join('');
}

function selectService(id) {
    state.service = SERVICES.find(s => s.id === id);
    goToStep(2);
}


function renderTimeSlots() {
    const dateObj = new Date(state.date);
    const userTimezoneOffset = dateObj.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(dateObj.getTime() + userTimezoneOffset);
    const dayOfWeek = adjustedDate.getDay(); 

    let times = [];

   
    if (dayOfWeek === 2) { 
        times = ["18:00", "19:00", "20:00", "21:00"];
    } else if (dayOfWeek === 0 || dayOfWeek === 6) { 
        times = [
            "08:00", "09:00", "10:00", "11:00", "12:00",
            "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
        ];
    } else {
       
        times = [];
    }

    if (times.length === 0) {
        timeList.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #ef4444;">Fechado neste dia.</p>`;
        return;
    }

    timeList.innerHTML = times.map(time => `
        <div class="time-slot ${state.time === time ? 'selected' : ''}" 
             onclick="selectTime('${time}')">
            ${time}
        </div>
    `).join('');
}

function selectTime(time) {
    state.time = time;

    renderTimeSlots();
    setTimeout(() => goToStep(3), 300);
}


function selectLocation(type) {
    if (type === 'residencia') {
        state.location = "Na Sua Residência";
    } else {
        state.location = "A Domicílio ('-seu endereço aqui-')";
    }
    goToStep(4);
}


function updateSummary() {
    if (!state.service) return;

    summaryService.textContent = state.service.name;
    const dateObj = new Date(state.date);
    const userTimezoneOffset = dateObj.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(dateObj.getTime() + userTimezoneOffset);
    summaryDate.textContent = adjustedDate.toLocaleDateString('pt-BR');
    summaryTime.textContent = state.time;
    summaryLocation.textContent = state.location;
    summaryPrice.textContent = `R$ ${state.service.price},00`;
}
function sendToWhatsApp() {
    if (!state.service || !state.date || !state.time || !state.location) return;

    const dateObj = new Date(state.date);
    const userTimezoneOffset = dateObj.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(dateObj.getTime() + userTimezoneOffset);
    const formattedDate = adjustedDate.toLocaleDateString('pt-BR');

    const message = `Olá! Gostaria de agendar um horário.
    
*Serviço:* ${state.service.name}
*Data:* ${formattedDate}
*Horário:* ${state.time}
*Local:* ${state.location}
*Valor:* R$ ${state.service.price},00`;

    const encodedMessage = encodeURIComponent(message);
    const url = `https://api.whatsapp.com/send?phone=${BUSINESS_PHONE}&text=${encodedMessage}`;

    window.open(url, '_blank');
}


init();
