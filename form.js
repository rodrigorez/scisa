window.onload = function () {
  const params = new URLSearchParams(window.location.search);
  const hash = params.get('hash');

  if (!hash) {
    alert("QR Code inválido.");
    return;
  }

  document.getElementById('turma').value = "INFO3A"; // Turma pode vir dinamicamente depois
};

document.getElementById('form-presenca').addEventListener('submit', function(e) {
  e.preventDefault();

  const formData = new FormData(this);
  const dados = Object.fromEntries(formData);

  fetch('https://script.google.com/macros/s/AKfycbxQLCKf--3hqTRrLrRhM887tBCKCs8H5J0x2BhAO0cJpsbJjs3-3P9SIEsO6Ua7F4QPyA/exec?action=registrarPresenca', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  })
  .then(res => res.json())
  .then(response => {
    const statusDiv = document.getElementById('status');
    if (response.sucesso) {
      statusDiv.innerHTML = '<p>✅ Sua presença foi registrada!</p>';
    } else {
      statusDiv.innerHTML = `<p>❌ Erro: ${response.mensagem}</p>`;
    }
  });
});
