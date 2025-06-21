function gerarQRCode() {
  fetch('https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=criarHash')
    .then(res => res.json())
    .then(data => {
      const url = `https://seu-dominio.com/form.html?hash=${data.hash}`;
      document.getElementById('qrcode-container').innerHTML = `
        <img src="https://quickchart.io/qr?text=${url}&size=200x200" />
      `;
      iniciarContagemAutomatica();
    });
}

function atualizarDashboard() {
  fetch('https://script.google.com/macros/s/AKfycbxQLCKf--3hqTRrLrRhM887tBCKCs8H5J0x2BhAO0cJpsbJjs3-3P9SIEsO6Ua7F4QPyA/exec?action=listarPresencas')
    .then(res => res.json())
    .then(data => {
      const lista = document.getElementById('lista-presencas');
      lista.innerHTML = '';
      data.forEach(presenca => {
        const li = document.createElement('li');
        li.textContent = `${presenca.nome} (${presenca.ra})`;
        lista.appendChild(li);
      });
    });
}

function iniciarContagemAutomatica() {
  let tempo = 20;
  const timerElement = document.getElementById('tempo-restante');
  const interval = setInterval(() => {
    tempo--;
    timerElement.innerText = `Próximo QR Code em: ${tempo}s`;

    if (tempo <= 0) {
      clearInterval(interval);
      gerarQRCode();
    }
  }, 1000);
}

setInterval(atualizarDashboard, 5000); // Atualiza dashboard a cada 5 segundos
