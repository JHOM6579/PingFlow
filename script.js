const canvas = document.getElementById('speedometer');
const ctx = canvas.getContext('2d');
const speedElement = document.getElementById('speed');
const pingElement = document.getElementById('ping');
const uploadElement = document.getElementById('upload');
const downloadElement = document.getElementById('download');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const status = document.getElementById('status');


let currentSpeed = 0;
let targetSpeed = 0;

function drawZones() {
  const zones = [
    { color: '#2ecc71', start: Math.PI, end: Math.PI + Math.PI / 3 },
    { color: '#f1c40f', start: Math.PI + Math.PI / 3, end: Math.PI + 2 * Math.PI / 3 },
    { color: '#e74c3c', start: Math.PI + 2 * Math.PI / 3, end: 2 * Math.PI }
  ];

  zones.forEach(zone => {
    ctx.beginPath();
    ctx.lineWidth = 20;
    ctx.strokeStyle = zone.color;
    ctx.arc(150, 150, 100, zone.start, zone.end);
    ctx.stroke();
  });
}

function drawPointer(speed) {
  ctx.save();
  ctx.translate(150, 150);
  const angle = Math.PI + (speed / 500) * Math.PI;
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(80, 0);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.restore();
}

function drawCenter() {
  ctx.beginPath();
  ctx.arc(150, 150, 8, 0, 2 * Math.PI);
  ctx.fillStyle = '#000';
  ctx.fill();
}

function drawSpeedometer(speed) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawZones();
  drawPointer(speed);
  drawCenter();
}

function animate() {
  drawSpeedometer(currentSpeed);
  if (Math.abs(currentSpeed - targetSpeed) > 1) {
    currentSpeed += (targetSpeed - currentSpeed) * 0.1;
    requestAnimationFrame(animate);
  } else {
    currentSpeed = targetSpeed;
    drawSpeedometer(currentSpeed);
  }
  speedElement.textContent = Math.floor(currentSpeed);
}

async function simulatePing() {
  status.textContent = "Testando Ping...";
  await new Promise(res => setTimeout(res, 1000));
  const ping = Math.floor(Math.random() * 30 + 10);
  pingElement.textContent = ping + ' ms';
}

async function simulateDownload() {
  status.textContent = "Testando Download...";
  for (let i = 0; i < 20; i++) {
    await new Promise(res => setTimeout(res, 100));
    targetSpeed = Math.random() * 200 + 50;
    animate();
  }
  const finalDownload = Math.random() * 200 + 100;
  targetSpeed = finalDownload;
  downloadElement.textContent = finalDownload.toFixed(2) + ' Mbps';
  speedElement.textContent = finalDownload.toFixed(2);
}

async function simulateUpload() {
  status.textContent = "Testando Upload...";
  for (let i = 0; i < 15; i++) {
    await new Promise(res => setTimeout(res, 100));
    targetSpeed = Math.random() * 100 + 20;
    animate();
  }
  const finalUpload = Math.random() * 100 + 30;
  uploadElement.textContent = finalUpload.toFixed(2) + ' Mbps';
  targetSpeed = finalUpload;
  speedElement.textContent = finalUpload.toFixed(2);
}

startBtn.addEventListener('click', async () => {
  startBtn.classList.add('hidden');
  await new Promise(res => setTimeout(res, 500));

  status.textContent = "Iniciando teste...";
  drawSpeedometer(0);
  await simulatePing();
  await simulateDownload();
  await simulateUpload();
  status.textContent = "Teste concluído ✅";
});

// Mostra o botão resetar após o teste
startBtn.addEventListener('click', async () => {
  startBtn.classList.add('hidden');
  resetBtn.classList.add('hidden'); // Garante que o botão reset esteja escondido no início
  await new Promise(res => setTimeout(res, 500));

  status.textContent = "Iniciando teste...";
  drawSpeedometer(0);
  await simulatePing();
  await simulateDownload();
  await simulateUpload();
  status.textContent = "Teste concluído ✅";

  // Agora mostra o botão resetar
  resetBtn.classList.remove('hidden');
});

// Ação do botão resetar
resetBtn.addEventListener('click', () => {
  // Limpa os valores e estados
  currentSpeed = 0;
  targetSpeed = 0;
  drawSpeedometer(0);
  speedElement.textContent = '0';
  pingElement.textContent = '-- ms';
  downloadElement.textContent = '-- Mbps';
  uploadElement.textContent = '-- Mbps';
  status.textContent = 'Pronto para testar...';

  // Esconde o botão resetar e mostra o botão iniciar
  resetBtn.classList.add('hidden');
  startBtn.classList.remove('hidden');
});