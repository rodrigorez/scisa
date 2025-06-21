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

    const params = new URLSearchParams(window.location.search);
    const hash = params.get('hash'); // Captura o hash da URL

    if (!hash) {
        document.getElementById('status').innerHTML = '<p>❌ Erro: Hash do QR Code ausente.</p>';
        return;
    }

    const formData = new FormData(this);
    const dados = Object.fromEntries(formData);

    // **ADICIONE O HASH AQUI**
    dados.hash = hash;

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
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
        document.getElementById('status').innerHTML = `<p>❌ Erro de comunicação: ${error.message}</p>`;
    });
});

window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    const hash = params.get('hash');

    if (!hash) {
        document.getElementById('status').innerHTML = '<p>❌ Erro: QR Code inválido ou expirado. Tente escanear novamente.</p>';
        // alert("QR Code inválido."); // Substituído por mensagem na div
        return;
    }

    document.getElementById('turma').value = "INFO3A";
};document.getElementById('form-presenca').addEventListener('submit', function(e) {
    e.preventDefault();

    const params = new URLSearchParams(window.location.search);
    const hash = params.get('hash'); // Captura o hash da URL

    if (!hash) {
        document.getElementById('status').innerHTML = '<p>❌ Erro: Hash do QR Code ausente.</p>';
        return;
    }

    const formData = new FormData(this);
    const dados = Object.fromEntries(formData);

    // **ADICIONE O HASH AQUI**
    dados.hash = hash;

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
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
        document.getElementById('status').innerHTML = `<p>❌ Erro de comunicação: ${error.message}</p>`;
    });
});

window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    const hash = params.get('hash');

    if (!hash) {
        document.getElementById('status').innerHTML = '<p>❌ Erro: QR Code inválido ou expirado. Tente escanear novamente.</p>';
        // alert("QR Code inválido."); // Substituído por mensagem na div
        return;
    }

    document.getElementById('turma').value = "INFO3A";
};
