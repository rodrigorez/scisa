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

  fetch('https://script.google.com/macros/s/AKfycbxnexm6mi-5emwkICwwO_EEnxJrbhEhYItJNf26g66BeF2USNlHbYFI3_bOWM4IIWJb-w/exec?action=registrarPresenca', {
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
