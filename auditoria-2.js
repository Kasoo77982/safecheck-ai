const API_URL = 'http://localhost:3000/api';
const token = localStorage.getItem('token');

// Check authentication
if (!token) {
    window.location.href = 'login.html';
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
});

// Audit form submission
document.getElementById('auditForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const url = document.getElementById('url').value;
    const alertDiv = document.getElementById('alert');
    const submitBtn = document.getElementById('submitBtn');
    const progressContainer = document.getElementById('progressContainer');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    // Hide form, show progress
    submitBtn.disabled = true;
    submitBtn.textContent = 'Auditando...';
    progressContainer.style.display = 'block';

    // Simulate progress
    const steps = [
        { id: 'step1', text: 'Executando scan de portas...', progress: 20 },
        { id: 'step2', text: 'Detectando tecnologias...', progress: 40 },
        { id: 'step3', text: 'Analisando headers HTTP...', progress: 60 },
        { id: 'step4', text: 'Buscando vulnerabilidades...', progress: 80 },
        { id: 'step5', text: 'Análise de IA em andamento...', progress: 95 }
    ];

    let currentStep = 0;

    const progressInterval = setInterval(() => {
        if (currentStep < steps.length) {
            const step = steps[currentStep];
            
            // Mark previous step as completed
            if (currentStep > 0) {
                document.getElementById(steps[currentStep - 1].id).classList.remove('active');
                document.getElementById(steps[currentStep - 1].id).classList.add('completed');
            }
            
            // Activate current step
            document.getElementById(step.id).classList.add('active');
            progressFill.style.width = step.progress + '%';
            progressText.textContent = step.text;
            
            currentStep++;
        }
    }, 2000);

    try {
        const response = await fetch(`${API_URL}/auditar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ url })
        });

        const data = await response.json();

        clearInterval(progressInterval);

        if (response.ok) {
            // Mark all steps as completed
            steps.forEach(step => {
                const el = document.getElementById(step.id);
                el.classList.remove('active');
                el.classList.add('completed');
            });
            
            progressFill.style.width = '100%';
            progressText.textContent = 'Auditoria concluída! Redirecionando...';

            setTimeout(() => {
                window.location.href = `resultado.html?id=${data.audit.id}`;
            }, 1500);
        } else {
            clearInterval(progressInterval);
            alertDiv.className = 'alert alert-error';
            alertDiv.textContent = data.error || 'Erro ao realizar auditoria';
            alertDiv.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Iniciar Auditoria';
            progressContainer.style.display = 'none';
        }
    } catch (error) {
        clearInterval(progressInterval);
        alertDiv.className = 'alert alert-error';
        alertDiv.textContent = 'Erro ao conectar com o servidor';
        alertDiv.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Iniciar Auditoria';
        progressContainer.style.display = 'none';
    }
});
