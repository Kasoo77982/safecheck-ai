'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, FileText, Clock, CheckCircle, AlertCircle, LogOut } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: string
  subscription?: {
    status: string
    expiresAt: string
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar autenticação
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    setLoading(false)

    // Verificar se a assinatura está ativa
    if (parsedUser.subscription) {
      const expiresAt = new Date(parsedUser.subscription.expiresAt)
      if (expiresAt < new Date()) {
        router.push('/pagamento')
      }
    } else {
      router.push('/pagamento')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const subscriptionActive = user.subscription && new Date(user.subscription.expiresAt) > new Date()
  const daysRemaining = user.subscription 
    ? Math.ceil((new Date(user.subscription.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-cyan-500" />
              <span className="text-xl font-bold">SafeCheck AI</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status da Assinatura */}
        <div className="mb-8">
          <div className={`p-6 rounded-2xl border ${
            subscriptionActive 
              ? 'bg-green-500/10 border-green-500/20' 
              : 'bg-red-500/10 border-red-500/20'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {subscriptionActive ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-500" />
                )}
                <div>
                  <h2 className="text-lg font-semibold">
                    {subscriptionActive ? 'Assinatura Ativa' : 'Assinatura Inativa'}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {subscriptionActive 
                      ? `Expira em ${daysRemaining} dias` 
                      : 'Renove sua assinatura para continuar usando'}
                  </p>
                </div>
              </div>
              {!subscriptionActive && (
                <button
                  onClick={() => router.push('/pagamento')}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                >
                  Renovar Agora
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-cyan-500/10 rounded-lg">
                <FileText className="w-6 h-6 text-cyan-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-gray-400">Análises Realizadas</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-gray-400">Documentos Válidos</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/10 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-gray-400">Fraudes Detectadas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Área de Upload */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">Analisar Documento</h2>
          
          <div className="border-2 border-dashed border-white/20 rounded-xl p-12 text-center hover:border-cyan-500/50 transition-colors cursor-pointer">
            <Shield className="w-16 h-16 text-cyan-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Arraste seu documento aqui</h3>
            <p className="text-gray-400 mb-4">ou clique para selecionar</p>
            <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
              Selecionar Arquivo
            </button>
            <p className="text-xs text-gray-500 mt-4">
              Formatos aceitos: PDF, JPG, PNG (máx. 10MB)
            </p>
          </div>
        </div>

        {/* Histórico Recente */}
        <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">Histórico de Análises</h2>
          
          <div className="text-center py-12 text-gray-400">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma análise realizada ainda</p>
            <p className="text-sm mt-2">Faça upload do seu primeiro documento para começar</p>
          </div>
        </div>
      </main>
    </div>
  )
}
