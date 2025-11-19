const { exec } = require('child_process');
const util = require('util');
const fs = require('fs');
const path = require('path');
const verifySignature = require('./verifySignature');

const execPromise = util.promisify(exec);
const dbPath = path.join(__dirname, 'database.json');

function readDB() {
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

async function runNmap(url) {
  try {
    const { stdout } = await execPromise(`nmap -sV -Pn ${url} --max-retries 1 -T4`);
    return stdout;
  } catch (error) {
    return `Erro ao executar nmap: ${error.message}`;
  }
}

async function runWhatweb(url) {
  try {
    const { stdout } = await execPromise(`whatweb ${url}`);
    return stdout;
  } catch (error) {
    return `Erro ao executar whatweb: ${error.message}`;
  }
}

async function runCurlHeaders(url) {
  try {
    const { stdout } = await execPromise(`curl -I ${url}`);
    return stdout;
  } catch (error) {
    return `Erro ao executar curl: ${error.message}`;
  }
}

async function runNuclei(url) {
  try {
    const { stdout } = await execPromise(`nuclei -u ${url} -silent`);
    return stdout || 'Nenhuma vulnerabilidade detectada';
  } catch (error) {
    return `Erro ao executar nuclei: ${error.message}`;
  }
}

async function runOllamaAnalysis(url) {
  try {
    const prompt = `Analise o site ${url} em termos de UX, design, acessibilidade e sugira melhorias. Seja objetivo e profissional.`;
    const { stdout } = await execPromise(`ollama run llama3 "${prompt}"`);
    return stdout;
  } catch (error) {
    return `Análise de IA indisponível: ${error.message}`;
  }
}

async function performAudit(req, res) {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL é obrigatória' });
    }
    
    // Verificar assinatura
    const subscriptionCheck = verifySignature(req.userId);
    
    if (!subscriptionCheck.valid) {
      return res.status(403).json({ 
        error: 'Assinatura inválida ou expirada',
        message: subscriptionCheck.message
      });
    }
    
    // Validar URL
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlPattern.test(url)) {
      return res.status(400).json({ error: 'URL inválida' });
    }
    
    const auditId = Date.now().toString();
    
    // Executar auditorias em paralelo
    console.log(`Iniciando auditoria para ${url}...`);
    
    const [nmapResult, whatwebResult, curlResult, nucleiResult, ollamaResult] = await Promise.all([
      runNmap(url),
      runWhatweb(url),
      runCurlHeaders(url),
      runNuclei(url),
      runOllamaAnalysis(url)
    ]);
    
    const auditReport = {
      id: auditId,
      userId: req.userId,
      url,
      timestamp: new Date().toISOString(),
      results: {
        nmap: nmapResult,
        whatweb: whatwebResult,
        headers: curlResult,
        vulnerabilities: nucleiResult,
        aiAnalysis: ollamaResult
      },
      summary: {
        securityScore: calculateSecurityScore(nucleiResult, curlResult),
        uxScore: calculateUXScore(ollamaResult),
        totalIssues: countIssues(nucleiResult)
      }
    };
    
    // Salvar no banco
    const db = readDB();
    db.audits.push(auditReport);
    writeDB(db);
    
    res.json({
      message: 'Auditoria concluída com sucesso',
      audit: auditReport
    });
    
  } catch (error) {
    console.error('Erro ao realizar auditoria:', error);
    res.status(500).json({ error: 'Erro ao realizar auditoria', details: error.message });
  }
}

function calculateSecurityScore(nucleiResult, curlResult) {
  let score = 100;
  
  if (nucleiResult.includes('critical')) score -= 30;
  if (nucleiResult.includes('high')) score -= 20;
  if (nucleiResult.includes('medium')) score -= 10;
  if (nucleiResult.includes('low')) score -= 5;
  
  if (!curlResult.includes('Strict-Transport-Security')) score -= 10;
  if (!curlResult.includes('X-Content-Type-Options')) score -= 5;
  if (!curlResult.includes('X-Frame-Options')) score -= 5;
  
  return Math.max(score, 0);
}

function calculateUXScore(ollamaResult) {
  // Análise simplificada baseada em palavras-chave
  let score = 70;
  
  if (ollamaResult.includes('excelente') || ollamaResult.includes('ótimo')) score += 20;
  if (ollamaResult.includes('bom')) score += 10;
  if (ollamaResult.includes('ruim') || ollamaResult.includes('problema')) score -= 20;
  
  return Math.min(Math.max(score, 0), 100);
}

function countIssues(nucleiResult) {
  const lines = nucleiResult.split('\n').filter(line => line.trim());
  return lines.length > 1 ? lines.length - 1 : 0;
}

function getAuditHistory(req, res) {
  try {
    const db = readDB();
    const userAudits = db.audits.filter(audit => audit.userId === req.userId);
    
    // Ordenar por data (mais recente primeiro)
    userAudits.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    res.json({
      audits: userAudits.map(audit => ({
        id: audit.id,
        url: audit.url,
        timestamp: audit.timestamp,
        summary: audit.summary
      }))
    });
    
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({ error: 'Erro ao buscar histórico' });
  }
}

function getAuditDetails(req, res) {
  try {
    const { id } = req.params;
    const db = readDB();
    
    const audit = db.audits.find(a => a.id === id && a.userId === req.userId);
    
    if (!audit) {
      return res.status(404).json({ error: 'Auditoria não encontrada' });
    }
    
    res.json({ audit });
    
  } catch (error) {
    console.error('Erro ao buscar detalhes da auditoria:', error);
    res.status(500).json({ error: 'Erro ao buscar detalhes' });
  }
}

module.exports = { performAudit, getAuditHistory, getAuditDetails };
