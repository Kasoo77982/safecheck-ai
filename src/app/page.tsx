'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header/Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-lg border-b border-white/5">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M20 5L5 12V20C5 28.5 11 35.5 20 37C29 35.5 35 28.5 35 20V12L20 5Z" stroke="#00D9FF" strokeWidth="2" fill="none"/>
                <path d="M15 20L18 23L25 16" stroke="#00D9FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xl font-bold">SafeCheck AI</span>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <a href="#como-funciona" className="text-gray-300 hover:text-white transition-colors">Como Funciona</a>
              <a href="#beneficios" className="text-gray-300 hover:text-white transition-colors">Benefícios</a>
              <a href="#depoimentos" className="text-gray-300 hover:text-white transition-colors">Depoimentos</a>
              <a href="#faq" className="text-gray-300 hover:text-white transition-colors">FAQ</a>
              <Link href="/login" className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
                Login
              </Link>
              <Link href="/registro" className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
                Começar Agora
              </Link>
            </div>

            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-6">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="#00D9FF" strokeWidth="2"/>
                <circle cx="8" cy="8" r="3" fill="#00D9FF"/>
              </svg>
              <span className="text-sm text-cyan-400">Auditoria Automatizada com IA</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Proteja Seu Site com<br/>
              <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                Auditoria Inteligente
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Análise completa de segurança, vulnerabilidades e UX do seu site em minutos. 
              Tecnologia de ponta com IA para identificar riscos e melhorar sua presença online.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/registro" className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center justify-center gap-2">
                Começar Auditoria
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7 3L14 10L7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </Link>
              <a href="#como-funciona" className="px-8 py-4 bg-white/5 border border-white/10 rounded-lg font-semibold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M10 6V10L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Ver Como Funciona
              </a>
            </div>

            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div>
                <div className="text-3xl font-bold text-cyan-400 mb-1">1000+</div>
                <div className="text-sm text-gray-400">Sites Auditados</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-cyan-400 mb-1">98%</div>
                <div className="text-sm text-gray-400">Satisfação</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-cyan-400 mb-1">24/7</div>
                <div className="text-sm text-gray-400">Disponibilidade</div>
              </div>
            </div>
          </div>

          {/* Floating Cards */}
          <div className="relative h-64 hidden lg:block">
            <div className="absolute top-0 left-1/4 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-sm animate-float">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L3 7V12C3 17.5 7 22 12 23C17 22 21 17.5 21 12V7L12 2Z" stroke="#00D9FF" strokeWidth="2"/>
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Segurança</div>
                  <div className="text-2xl font-bold">95/100</div>
                </div>
              </div>
            </div>

            <div className="absolute top-20 right-1/4 bg-gradient-to-br from-purple-500/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm animate-float-delayed">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#9D4EDD" strokeWidth="2"/>
                    <path d="M9 9H15M9 13H13" stroke="#9D4EDD" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-400">UX Score</div>
                  <div className="text-2xl font-bold">88/100</div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-gradient-to-br from-red-500/20 to-pink-600/20 border border-red-500/30 rounded-2xl p-6 backdrop-blur-sm animate-float">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#FF006E" strokeWidth="2"/>
                    <path d="M2 17L12 22L22 17M2 12L12 17L22 12" stroke="#FF006E" strokeWidth="2"/>
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Vulnerabilidades</div>
                  <div className="text-2xl font-bold">3 encontradas</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-20 px-4 bg-white/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Como Funciona?</h2>
            <p className="text-xl text-gray-400">Auditoria completa em 4 passos simples</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                number: '01',
                title: 'Crie sua Conta',
                description: 'Cadastre-se gratuitamente em menos de 1 minuto. Sem cartão de crédito necessário.',
                color: 'cyan'
              },
              {
                number: '02',
                title: 'Assine por R$ 19,90',
                description: 'Pagamento único via PIX. Acesso completo por 30 dias para auditorias ilimitadas.',
                color: 'purple'
              },
              {
                number: '03',
                title: 'Envie a URL',
                description: 'Cole a URL do seu site e nossa IA iniciará a análise completa automaticamente.',
                color: 'red'
              },
              {
                number: '04',
                title: 'Receba o Relatório',
                description: 'Relatório detalhado com vulnerabilidades, score de segurança e recomendações de IA.',
                color: 'green'
              }
            ].map((step, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                <div className="text-5xl font-bold text-gray-800 mb-4">{step.number}</div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O que Analisamos */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">O que Analisamos?</h2>
            <p className="text-xl text-gray-400">Auditoria completa com as melhores ferramentas do mercado</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Scan de Portas (Nmap)', description: 'Identificação de portas abertas, serviços rodando e possíveis vetores de ataque.', color: 'cyan' },
              { title: 'Tecnologias (WhatWeb)', description: 'Detecção de CMS, frameworks, bibliotecas e versões utilizadas no site.', color: 'purple' },
              { title: 'Headers HTTP', description: 'Análise de cabeçalhos de segurança como HSTS, CSP, X-Frame-Options e mais.', color: 'red' },
              { title: 'Vulnerabilidades (Nuclei)', description: 'Scan automatizado de CVEs conhecidas e vulnerabilidades críticas.', color: 'green' },
              { title: 'Análise de IA (Ollama)', description: 'Inteligência artificial analisa UX, design, acessibilidade e sugere melhorias.', color: 'yellow' },
              { title: 'Score de Segurança', description: 'Pontuação geral de 0 a 100 baseada em todos os testes realizados.', color: 'red' }
            ].map((feature, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L3 7V12C3 17.5 7 22 12 23C17 22 21 17.5 21 12V7L12 2Z" stroke="#00D9FF" strokeWidth="2"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section id="beneficios" className="py-20 px-4 bg-white/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Por que usar o SafeCheck AI?</h2>
            <p className="text-xl text-gray-400">Vantagens que fazem a diferença</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '⚡', title: 'Rápido e Automatizado', description: 'Auditoria completa em minutos. Sem configurações complexas ou conhecimento técnico.' },
              { icon: '💰', title: 'Preço Acessível', description: 'Apenas R$ 19,90 por 30 dias. Auditorias ilimitadas durante todo o período.' },
              { icon: '🤖', title: 'Inteligência Artificial', description: 'IA analisa seu site e sugere melhorias específicas de UX e design.' },
              { icon: '📊', title: 'Relatórios Detalhados', description: 'Visualize histórico completo e compare evolução da segurança ao longo do tempo.' },
              { icon: '🔒', title: 'Segurança Profissional', description: 'Mesmas ferramentas usadas por pentesters e empresas de segurança.' },
              { icon: '🎯', title: 'Ação Imediata', description: 'Identifique e corrija vulnerabilidades antes que sejam exploradas.' }
            ].map((benefit, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section id="depoimentos" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">O que dizem nossos clientes</h2>
            <p className="text-xl text-gray-400">Empresas que confiam no SafeCheck AI</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Marcos Silva', role: 'CEO, TechStart', text: 'Descobri 5 vulnerabilidades críticas que eu nem sabia que existiam. O relatório da IA foi extremamente útil para melhorar a experiência dos usuários.' },
              { name: 'Ana Costa', role: 'Desenvolvedora Freelancer', text: 'Ferramenta indispensável! Por R$ 19,90 consegui auditar todos os sites dos meus clientes. O ROI foi absurdo.' },
              { name: 'Ricardo Pereira', role: 'Dono, Loja Virtual', text: 'A análise de IA surpreendeu. Recebi sugestões que melhoraram a conversão do meu e-commerce em 23%. Recomendo demais!' }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="text-yellow-400 mb-4">⭐⭐⭐⭐⭐</div>
                <p className="text-gray-300 mb-6">&quot;{testimonial.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center font-bold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 bg-white/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Plano Simples e Transparente</h2>
            <p className="text-xl text-gray-400">Sem pegadinhas, sem taxas ocultas</p>
          </div>

          <div className="max-w-md mx-auto bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-2xl p-8">
            <div className="inline-block px-4 py-1 bg-cyan-500 rounded-full text-sm font-semibold mb-6">Mais Popular</div>
            <h3 className="text-2xl font-bold mb-4">Plano Mensal</h3>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-gray-400">R$</span>
              <span className="text-6xl font-bold">19</span>
              <span className="text-2xl">,90</span>
            </div>
            <div className="text-gray-400 mb-8">por 30 dias</div>
            
            <ul className="space-y-4 mb-8">
              {[
                'Auditorias ilimitadas',
                'Análise com IA',
                'Histórico completo',
                'Relatórios detalhados',
                'Pagamento via PIX',
                'Sem renovação automática'
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="9" fill="#00D9FF" fillOpacity="0.1"/>
                    <path d="M6 10L9 13L14 8" stroke="#00D9FF" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <Link href="/registro" className="block w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold text-center hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
              Começar Agora
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Perguntas Frequentes</h2>
            <p className="text-xl text-gray-400">Tire suas dúvidas</p>
          </div>

          <div className="space-y-4">
            {[
              { q: 'Como funciona o pagamento?', a: 'O pagamento é feito via PIX no valor de R$ 19,90. Após o pagamento, você envia o comprovante e sua assinatura é ativada imediatamente por 30 dias.' },
              { q: 'Quantas auditorias posso fazer?', a: 'Você pode fazer auditorias ilimitadas durante os 30 dias de assinatura. Não há limite de sites ou quantidade de análises.' },
              { q: 'Preciso ter conhecimento técnico?', a: 'Não! Nossa plataforma é totalmente automatizada. Basta colar a URL do site e aguardar o relatório. A IA explica tudo de forma simples e clara.' },
              { q: 'Quanto tempo demora uma auditoria?', a: 'Em média, uma auditoria completa leva de 2 a 5 minutos, dependendo do tamanho e complexidade do site analisado.' },
              { q: 'A assinatura renova automaticamente?', a: 'Não! Você paga apenas uma vez e tem acesso por 30 dias. Após esse período, você decide se quer renovar ou não. Sem surpresas.' },
              { q: 'Posso auditar sites de terceiros?', a: 'Sim! Você pode auditar qualquer site público. Ideal para freelancers, agências e consultores que atendem múltiplos clientes.' }
            ].map((faq, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold">{faq.q}</span>
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none"
                    className={`transform transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                  >
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 text-gray-400">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 bg-gradient-to-br from-cyan-500/20 to-blue-600/20">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Pronto para proteger seu site?</h2>
          <p className="text-xl text-gray-300 mb-8">Comece agora e descubra vulnerabilidades antes que seja tarde demais</p>
          <Link href="/registro" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
            Começar Auditoria Agora
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7 3L14 10L7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </Link>
          <p className="text-sm text-gray-400 mt-6">✓ Sem cartão de crédito • ✓ Pagamento via PIX • ✓ Acesso imediato</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M20 5L5 12V20C5 28.5 11 35.5 20 37C29 35.5 35 28.5 35 20V12L20 5Z" stroke="#00D9FF" strokeWidth="2" fill="none"/>
                  <path d="M15 20L18 23L25 16" stroke="#00D9FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-xl font-bold">SafeCheck AI</span>
              </div>
              <p className="text-gray-400 text-sm">Auditoria automatizada de sites com inteligência artificial. Proteja seu negócio online.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <a href="#como-funciona" className="block hover:text-white transition-colors">Como Funciona</a>
                <a href="#beneficios" className="block hover:text-white transition-colors">Benefícios</a>
                <Link href="/registro" className="block hover:text-white transition-colors">Preços</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <a href="#faq" className="block hover:text-white transition-colors">FAQ</a>
                <a href="mailto:contato@safecheck.ai" className="block hover:text-white transition-colors">Contato</a>
                <a href="#" className="block hover:text-white transition-colors">Documentação</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <a href="#" className="block hover:text-white transition-colors">Termos de Uso</a>
                <a href="#" className="block hover:text-white transition-colors">Privacidade</a>
                <a href="#" className="block hover:text-white transition-colors">Cookies</a>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">&copy; 2024 SafeCheck AI. Todos os direitos reservados.</p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite;
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  )
}
