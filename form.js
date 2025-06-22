// form.js

// URL base do seu Google Apps Script
// **ESTA URL DEVE SER A URL ATIVA DE IMPLANTAÇÃO DO SEU GAS**
const gasWebAppUrl = 'https://script.google.com/macros/s/AKfycbw8QD_J5BWdFOseGOOvQji4FBKgrgGSpvd9m16ozvJR-NJFMSrhsy3bTev2UOhAkcQCMg/exec';

window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    const hash = params.get('hash');
    const statusDiv = document.getElementById('status');

    if (!hash) {
        statusDiv.innerHTML = '<p style="color: red;">❌ Erro: QR Code inválido ou hash ausente na URL. Tente escanear novamente.</p>';
        console.error('form.js (onload): Hash ausente na URL.');
        return;
    }

    // Pré-preenche a turma. Pode ser buscado dinamicamente do GAS no futuro.
    document.getElementById('turma').value = "INFO3A";
    console.log('form.js (onload): Formulário carregado com hash:', hash);
};

document.getElementById('form-presenca').addEventListener('submit', function(e) {
    e.preventDefault(); // Impede o envio padrão do formulário

    const statusDiv = document.getElementById('status');
    statusDiv.innerHTML = '<p style="color: blue;">⌛ Enviando presença...</p>'; // Feedback visual imediato

    const params = new URLSearchParams(window.location.search);
    const hash = params.get('hash'); // Captura o hash da URL

    if (!hash) {
        statusDiv.innerHTML = '<p style="color: red;">❌ Erro: Hash do QR Code ausente. Não foi possível registrar a presença.</p>';
        console.error('form.js (submit): Hash ausente na URL ao tentar enviar formulário.');
        return;
    }

    const formData = new FormData(this); // Cria um objeto FormData a partir do formulário
    formData.append('hash', hash); // Adiciona o hash ao FormData

    console.log('form.js (submit): Dados a serem enviados (FormData):', Array.from(formData.entries()));
    
    // Constrói a URL completa para a requisição POST
    const requestUrl = `${gasWebAppUrl}?action=registrarPresenca`;
    console.log('form.js (submit): URL da requisição:', requestUrl);

    fetch(requestUrl, {
        method: 'POST',
        // NÃO definimos 'Content-Type' aqui. O navegador fará isso automaticamente para FormData
        body: formData // Envia o objeto FormData diretamente
    })
    .then(res => {
        console.log('form.js (fetch .then): Resposta recebida. Status HTTP:', res.status, res.statusText);
        if (!res.ok) {
            // Tenta ler o erro do corpo da resposta (pode não ser JSON se houver erro grave)
            return res.text().then(errorText => { 
                throw new Error(`HTTP error! status: ${res.status} - ${errorText}`);
            }).catch(() => {
                // Se a resposta não for texto ou houver outro erro na leitura
                throw new Error(`HTTP error! status: ${res.status}`);
            });
        }
        return res.json(); // Se o GAS responder JSON (esperado para sucesso/erro tratado)
    })
    .then(response => {
        console.log('form.js (fetch .then): Resposta JSON do servidor:', response);
        if (response.sucesso) {
            statusDiv.innerHTML = '<p style="color: green;">✅ Sua presença foi registrada com sucesso!</p>';
        } else {
            statusDiv.innerHTML = `<p style="color: red;">❌ Erro: ${response.mensagem || 'Ocorreu um erro ao registrar a presença.'}</p>`;
            console.error('form.js (fetch .then): Erro do servidor ao registrar presença:', response.mensagem);
        }
    })
    .catch(error => {
        statusDiv.innerHTML = `<p style="color: red;">❌ Erro de comunicação: ${error.message}. Tente novamente.</p>`;
        console.error('form.js (fetch .catch): Erro na requisição fetch para registrarPresenca:', error);
    });
});
