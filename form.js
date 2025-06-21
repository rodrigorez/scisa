// form.js - Implementação com CORS Anywhere Proxy

// URL base do seu Google Apps Script (MANTENHA A URL CORRETA QUE VOCÊ JÁ TEM)
const gasWebAppUrl = 'https://script.google.com/macros/s/AKfycbxnexm6mi-5emwkICwwO_EEnxJrbhEhYItJNf26g66BeF2USNlHbYFI3_bOWM4IIWJb-w/exec'; 

// URL do serviço CORS Anywhere. ATENÇÃO: Este é um serviço público e não é recomendado para produção com dados sensíveis.
// Para MVP e testes, é eficaz.
const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/'; 

window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    const hash = params.get('hash');
    const statusDiv = document.getElementById('status');

    if (!hash) {
        statusDiv.innerHTML = '<p style="color: red;">❌ Erro: QR Code inválido ou hash ausente na URL. Tente escanear novamente.</p>';
        console.error('form.js (onload): Hash ausente na URL.');
        return;
    }

    document.getElementById('turma').value = "INFO3A";
    console.log('form.js (onload): Formulário carregado com hash:', hash);
};

document.getElementById('form-presenca').addEventListener('submit', function(e) {
    e.preventDefault();

    const statusDiv = document.getElementById('status');
    statusDiv.innerHTML = '<p style="color: blue;">⌛ Enviando presença...</p>';

    const params = new URLSearchParams(window.location.search);
    const hash = params.get('hash');

    if (!hash) {
        statusDiv.innerHTML = '<p style="color: red;">❌ Erro: Hash do QR Code ausente. Não foi possível registrar a presença.</p>';
        console.error('form.js (submit): Hash ausente na URL ao tentar enviar formulário.');
        return;
    }

    const formData = new FormData(this);
    const dados = Object.fromEntries(formData);

    dados.hash = hash; 
    console.log('form.js (submit): Dados a serem enviados:', dados);
    console.log('form.js (submit): Convertendo dados para JSON para envio:', JSON.stringify(dados));
    
    // Constrói a URL completa para a requisição, AGORA ATRAVÉS DO PROXY
    // A URL final será: https://cors-anywhere.herokuapp.com/https://script.google.com/macros/.../exec?action=registrarPresenca
    const requestUrl = `${corsProxyUrl}${gasWebAppUrl}?action=registrarPresenca`;
    console.log('form.js (submit): URL da requisição (via proxy):', requestUrl);

    fetch(requestUrl, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(dados) 
    })
    .then(res => {
        console.log('form.js (fetch .then): Resposta recebida. Status HTTP:', res.status, res.statusText);
        if (!res.ok) {
            return res.json().then(errorData => {
                throw new Error(errorData.mensagem || `HTTP error! status: ${res.status}`);
            }).catch(() => {
                throw new Error(`HTTP error! status: ${res.status}`);
            });
        }
        return res.json();
    })
    .then(response => {
        console.log('form.js (fetch .then): Resposta JSON do servidor (via proxy):', response);
        if (response.sucesso) {
            statusDiv.innerHTML = '<p style="color: green;">✅ Sua presença foi registrada com sucesso!</p>';
        } else {
            statusDiv.innerHTML = `<p style="color: red;">❌ Erro: ${response.mensagem || 'Ocorreu um erro ao registrar a presença.'}</p>`;
            console.error('form.js (fetch .then): Erro do servidor ao registrar presença (via proxy):', response.mensagem);
        }
    })
    .catch(error => {
        statusDiv.innerHTML = `<p style="color: red;">❌ Erro de comunicação: ${error.message}. Tente novamente.</p>`;
        console.error('form.js (fetch .catch): Erro na requisição fetch para registrarPresenca (via proxy):', error);
    });
});
