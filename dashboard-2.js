const API_URL = 'http://localhost:3000/api';
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');

// Check authentication
if (!token) {
    window.location.href = 'login.html';
}

// Display user name
document.getElementById('userName').textContent = user.name || 'Usuário';

// Logout
document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
});

// Load subscription status
async function loadSubscriptionStatus() {
    try {
        const response = await fetch(`${API_URL}/assinatura`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok && data.subscription) {
            const sub = data.subscription;
            const statusElement = document.getElementById('subscriptionStatus');
            const daysElement = document.getElementById('daysRemaining');
            const expiryElement = document.getElementById('expiryDate');
            const newAuditBtn = document.getElementById('newAuditBtn');

            if (sub.active) {
                statusElement.textContent = 'Ativa';
                statusElement.className = 'status-value status-active';
                daysElement.textContent = sub.daysRemaining || 0;
                expiryElement.textContent = new Date(sub.expiryDate).toLocaleDateString('pt-BR');
                newAuditBtn.style.pointerEvents = 'auto';
                newAuditBtn.style.opacity = '1';
            } else {
                statusElement.textContent = 'Inativa';
                statusElement.className = 'status-value status-inactive';
                daysElement.textContent = '0';
                expiryElement.textContent = '-';
                newAuditBtn.style.pointerEvents = 'none';
                newAuditBtn.style.opacity = '0.5';
                newAuditBtn.title = 'Ative sua assinatura para auditar';
            }
        }
    } catch (error) {
        console.error('Erro ao carregar status da assinatura:', error);
    }
}

// Load audit history
async function loadAuditHistory() {
    try {
        const response = await fetch(`${API_URL}/historico`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok && data.audits && data.audits.length > 0) {
            const historyGrid = document.getElementById('historyGrid');
            historyGrid.innerHTML = '';

            data.audits.forEach(audit => {
                const card = createHistoryCard(audit);
                historyGrid.appendChild(card);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
    }
}

function createHistoryCard(audit) {
    const card = document.createElement('div');
    card.className = 'history-card';
    card.onclick = () => {
        window.location.href = `resultado.html?id=${audit.id}`;
    };

    const securityScore = audit.summary?.securityScore || 0;
    const uxScore = audit.summary?.uxScore || 0;

    const securityClass = securityScore >= 80 ? 'score-high' : securityScore >= 50 ? 'score-medium' : 'score-low';
    const uxClass = uxScore >= 80 ? 'score-high' : uxScore >= 50 ? 'score-medium' : 'score-low';

    card.innerHTML = `
        <div class="history-info">
            <div class="history-url">${audit.url}</div>
            <div class="history-meta">
                <span>${new Date(audit.timestamp).toLocaleDateString('pt-BR')}</span>
                <span>${new Date(audit.timestamp).toLocaleTimeString('pt-BR')}</span>
                <span>${audit.summary?.totalIssues || 0} problemas encontrados</span>
            </div>
        </div>
        <div class="history-scores">
            <div class="score-badge ${securityClass}">
                Segurança: ${securityScore}
            </div>
            <div class="score-badge ${uxClass}">
                UX: ${uxScore}
            </div>
        </div>
    `;

    return card;
}

// Initialize
loadSubscriptionStatus();
loadAuditHistory();
