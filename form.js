// URL base do seu Google Apps Script (ATUALIZE COM A SUA URL DE IMPLANTAÇÃO DO GAS!)
const gasWebAppUrl = 'https://script.google.com/macros/s/AKfycbxnexm6mi-5emwkICwwO_EEnxJrbhEhYItJNf26g66BeF2USNlHbYFI3_bOWM4IIWJb-w/exec';

window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    const hash = params.get('hash');
    const statusDiv = document.getElementById('status');

    if (!hash) {
        statusDiv.innerHTML = '<p style="color: red;">❌ Erro: QR Code inválido ou hash ausente na URL. Tente escanear novamente.</p>';
        return;
    }

    // Pré-preenche a turma. Pode ser buscado dinamicamente do GAS no futuro.
    document.getElementById('turma').value = "INFO3A";
    console.log('Formulário carregado com hash:', hash);
};

document.getElementById('form-presenca').addEventListener('submit', function(e) {
    e.preventDefault(); // Impede o envio padrão do formulário

    const statusDiv = document.getElementById('status');
    statusDiv.innerHTML = '<p style="color: blue;">⌛ Enviando presença...</p>'; // Feedback visual imediato

    const params = new URLSearchParams(window.location.search);
    const hash = params.get('hash'); // Captura o hash da URL

    if (!hash) {
        statusDiv.innerHTML = '<p style="color: red;">❌ Erro: Hash do QR Code ausente. Não foi possível registrar a presença.</p>';
        console.error('Erro: Hash ausente na URL ao tentar enviar formulário.');
        return;
    }

    const formData = new FormData(this);
    const dados = Object.fromEntries(formData); // Converte os dados do formulário para um objeto

    // **ADICIONA O HASH AOS DADOS A SEREM ENVIADOS**
    dados.hash = hash; 
    console.log('Dados a serem enviados:', dados);

    fetch(`${gasWebAppUrl}?action=registrarPresenca`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados) // Converte o objeto para JSON
    })
    .then(res => {
        if (!res.ok) {
            // Tenta ler o erro do corpo da resposta JSON se disponível
            return res.json().then(errorData => {
                throw new Error(errorData.mensagem || `HTTP error! status: ${res.status}`);
            }).catch(() => {
                // Se não for JSON, lança um erro genérico
                throw new Error(`HTTP error! status: ${res.status}`);
            });
        }
        return res.json();
    })
    .then(response => {
        if (response.sucesso) {
            statusDiv.innerHTML = '<p style="color: green;">✅ Sua presença foi registrada com sucesso!</p>';
            // Opcional: Limpar formulário ou redirecionar
            // document.getElementById('form-presenca').reset(); 
        } else {
            statusDiv.innerHTML = `<p style="color: red;">❌ Erro: ${response.mensagem || 'Ocorreu um erro ao registrar a presença.'}</p>`;
            console.error('Erro do servidor ao registrar presença:', response.mensagem);
        }
    })
    .catch(error => {
        statusDiv.innerHTML = `<p style="color: red;">❌ Erro de comunicação: ${error.message}. Tente novamente.</p>`;
        console.error('Erro na requisição fetch para registrarPresenca:', error);
    });
});
