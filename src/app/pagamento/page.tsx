'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function PagamentoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }

    setUser(JSON.parse(userData))
  }, [router])

  const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    const formElement = e.currentTarget
    const fileInput = formElement.querySelector('input[type="file"]') as HTMLInputElement
    
    if (!fileInput.files || fileInput.files.length === 0) {
      setError('Por favor, selecione um arquivo')
      setLoading(false)
      return
    }

    const formData = new FormData()
    formData.append('comprovante', fileInput.files[0])

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/upload-comprovante', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Comprovante enviado! Assinatura ativada por 30 dias. Redirecionando...')
        
        // Atualizar dados do usuário
        const updatedUser = { ...user, subscription: data.subscription }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        setError(data.error || 'Erro ao enviar comprovante')
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white px-4 py-12">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M20 5L5 12V20C5 28.5 11 35.5 20 37C29 35.5 35 28.5 35 20V12L20 5Z" stroke="#00D9FF" strokeWidth="2" fill="none"/>
            <path d="M15 20L18 23L25 16" stroke="#00D9FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-2xl font-bold">SafeCheck AI</span>
        </div>

        {/* Card Principal */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Ativar Assinatura</h1>
            <p className="text-gray-400">Pagamento via PIX - R$ 19,90</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
              {success}
            </div>
          )}

          {/* QR Code e Informações de Pagamento */}
          <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-center mb-6 text-cyan-400">
              Escaneie o QR Code para Pagar
            </h3>
            
            {/* QR CODE REAL */}
            <div className="bg-white rounded-xl p-5 mb-6 flex justify-center">
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/d5253746-3e5c-40aa-9942-f1b537f68ebf.jpg" 
                alt="QR Code PIX para pagamento" 
                className="w-64 h-64"
              />
            </div>

            {/* Informações de Pagamento */}
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">Ou use a chave PIX:</p>
                <p className="font-bold text-lg bg-white/5 py-3 px-4 rounded-lg break-all">
                  pagamento@safecheck.ai
                </p>
              </div>

              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">Valor:</p>
                <p className="font-bold text-3xl text-green-400">R$ 19,90</p>
              </div>

              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">Beneficiário:</p>
                <p className="font-bold">SafeCheck AI LTDA</p>
              </div>
            </div>
          </div>

          {/* Formulário de Upload */}
          <form onSubmit={handleFileUpload} className="space-y-6">
            <div>
              <label htmlFor="comprovante" className="block text-sm font-medium mb-2">
                Enviar Comprovante
              </label>
              <input
                type="file"
                id="comprovante"
                accept="image/*,application/pdf"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan-500 file:text-white file:cursor-pointer hover:file:bg-cyan-600"
                disabled={loading}
                required
              />
              <p className="text-gray-400 text-sm mt-2">
                Formatos aceitos: JPG, PNG, PDF (máx 5MB)
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando...' : 'Enviar Comprovante e Ativar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white">
              Pular por enquanto
            </Link>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-6">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="#00D9FF" strokeWidth="2"/>
              <path d="M10 6V10L13 13" stroke="#00D9FF" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            O que acontece após o pagamento?
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">✓</span>
              <span>Sua assinatura é ativada automaticamente por 30 dias</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">✓</span>
              <span>Acesso ilimitado a auditorias de sites</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">✓</span>
              <span>Relatórios detalhados com análise de IA</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">✓</span>
              <span>Histórico completo de todas as auditorias</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
