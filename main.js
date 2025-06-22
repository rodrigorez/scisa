// main.js

// Variáveis globais para armazenar as configurações carregadas do GAS
let qrCodeRefreshInterval = 240;   // Valor padrão, será sobrescrito pelo GAS
let dashboardRefreshInterval = 5; // Valor padrão, será sobrescrito pelo GAS

// URL base do seu Google Apps Script
// **ESTA URL DEVE SER A URL ATIVA DE IMPLANTAÇÃO DO SEU GAS**
const gasWebAppUrl = 'https://script.google.com/macros/s/AKfycbw8QD_J5BWdFOseGOOvQji4FBKgrgGSpvd9m16ozvJR-NJFMSrhsy3bTev2UOhAkcQCMg/exec'; 

// URL base do seu GitHub Pages para o formulário do aluno
// **ATUALIZE ESTA URL COM O SEU DOMÍNIO COMPLETO DO GITHUB PAGES ONDE form.html ESTÁ HOSPEDADO!**
const gitHubPagesFormUrlBase = 'https://rodrigorez.github.io/scisa/form.html';

// Função para buscar configurações do Google Apps Script
async function fetchConfigs() {
    try {
        console.log('Buscando configurações do GAS...');
        const response = await fetch(`${gasWebAppUrl}?action=getConfigs`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const configs = await response.json();
        console.log('Configurações carregadas do GAS:', configs);

        if (configs) {
            qrCodeRefreshInterval = configs.qrCodeRefresh || 240; // Fallback para 240s
            dashboardRefreshInterval = configs.dashboardRefresh || 5; // Fallback para 5s
            
            // Inicia a atualização do dashboard com o intervalo obtido
            // Limpa qualquer timer anterior para evitar duplicação
            if (window.dashboardInterval) {
                clearInterval(window.dashboardInterval);
            }
            window.dashboardInterval = setInterval(atualizarDashboard, dashboardRefreshInterval * 1000);
            console.log(`Dashboard atualizando a cada ${dashboardRefreshInterval} segundos.`);
        }
    } catch (error) {
        console.error('Erro ao carregar configurações do GAS, usando valores padrão:', error);
        // Se houver erro, inicia o dashboard com os valores padrão
        if (window.dashboardInterval) {
            clearInterval(window.dashboardInterval);
        }
        window.dashboardInterval = setInterval(atualizarDashboard, dashboardRefreshInterval * 1000);
        console.log(`Dashboard iniciado com valores padrão (${dashboardRefreshInterval} segundos).`);
    }
}

// Função para gerar um novo QR Code
function gerarQRCode() {
    console.log('Gerando novo QR Code...');
    fetch(`${gasWebAppUrl}?action=criarHash`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            if (data && data.hash) {
                // Monta a URL completa do formulário com o hash
                const formUrl = `${gitHubPagesFormUrlBase}?hash=${data.hash}`; 
                document.getElementById('qrcode-container').innerHTML = `
                    <img src="https://quickchart.io/qr?text=${encodeURIComponent(formUrl)}&size=200x200" alt="QR Code" />
                `;
                console.log('QR Code gerado para hash:', data.hash);
                iniciarContagemAutomatica();
            } else {
                console.error('Erro: Hash não recebido do GAS.', data);
                alert('Erro ao gerar QR Code: Hash ausente na resposta do servidor.');
            }
        })
        .catch(error => {
            console.error('Erro ao chamar criarHash do GAS:', error);
            alert('Erro ao gerar QR Code. Verifique o console para mais detalhes.');
        });
}

// Função para atualizar a lista de presenças no dashboard do professor
function atualizarDashboard() {
    console.log('Atualizando dashboard...');
    fetch(`${gasWebAppUrl}?action=listarPresencas`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            const lista = document.getElementById('lista-presencas');
            lista.innerHTML = ''; // Limpa a lista atual

            if (data && data.length > 0) {
                data.forEach(presenca => {
                    const li = document.createElement('li');
                    // Garante que 'turma' existe antes de usar
                    const turmaDisplay = presenca.turma ? ` - Turma: ${presenca.turma}` : '';
                    li.textContent = `${presenca.nome} (${presenca.ra})${turmaDisplay}`;
                    lista.appendChild(li);
                });
                console.log(`Dashboard atualizado com ${data.length} presenças.`);
            } else {
                lista.innerHTML = '<li>Nenhum aluno presente ainda.</li>';
                console.log('Nenhum aluno presente registrado.');
            }
        })
        .catch(error => {
            console.error('Erro ao atualizar dashboard:', error);
            lista.innerHTML = '<li>Erro ao carregar presenças.</li>'; // Mensagem de erro na interface
        });
}

// Função para iniciar a contagem regressiva para o próximo QR Code
function iniciarContagemAutomatica() {
    let tempo = qrCodeRefreshInterval; // Usa o intervalo obtido do GAS
    const timerElement = document.getElementById('tempo-restante');
    timerElement.innerText = `Próximo QR Code em: ${tempo}s`;

    // Limpa qualquer timer de QR Code anterior para evitar múltiplos timers
    if (window.qrCodeInterval) {
        clearInterval(window.qrCodeInterval);
    }

    // Inicia um novo timer
    window.qrCodeInterval = setInterval(() => {
        tempo--;
        timerElement.innerText = `Próximo QR Code em: ${tempo}s`;

        if (tempo <= 0) {
            clearInterval(window.qrCodeInterval); // Para o timer atual
            gerarQRCode(); // Gera um novo QR Code
        }
    }, 1000); // Atualiza a cada 1 segundo
    console.log(`Contagem automática iniciada para ${qrCodeRefreshInterval} segundos.`);
}

// Evento que dispara quando o HTML é totalmente carregado
document.addEventListener('DOMContentLoaded', () => {
    // Primeiro, busca as configurações do GAS
    fetchConfigs()
        .then(() => {
            // Após carregar as configurações e iniciar o dashboard, gera o primeiro QR Code
            gerarQRCode();
        });
});
