'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Users, FileText, DollarSign, CheckCircle, XCircle, Clock, LogOut, Search, Eye, Download } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: string
  subscription?: {
    status: string
    expiresAt: string
    comprovante?: string
  }
}

interface AdminUser extends User {
  createdAt: string
  paymentProof?: string
}

export default function AdminPage() {
  const router = useRouter()
  const [admin, setAdmin] = useState<User | null>(null)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    // Verificar autenticação e permissão de admin
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    
    // Verificar se é admin
    if (parsedUser.role !== 'admin') {
      router.push('/dashboard')
      return
    }

    setAdmin(parsedUser)
    loadUsers(token)
  }, [router])

  const loadUsers = async (token: string) => {
    try {
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar usuários')
      }

      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (userId: string) => {
    const token = localStorage.getItem('token')
    if (!token) return

    setActionLoading(userId)
    try {
      const response = await fetch('/api/admin/approve-payment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      })

      if (!response.ok) {
        throw new Error('Erro ao aprovar pagamento')
      }

      // Recarregar usuários
      await loadUsers(token)
      alert('Pagamento aprovado com sucesso!')
    } catch (error) {
      console.error('Erro ao aprovar:', error)
      alert('Erro ao aprovar pagamento')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (userId: string) => {
    const reason = prompt('Motivo da rejeição (opcional):')
    
    const token = localStorage.getItem('token')
    if (!token) return

    setActionLoading(userId)
    try {
      const response = await fetch('/api/admin/reject-payment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, reason })
      })

      if (!response.ok) {
        throw new Error('Erro ao rejeitar pagamento')
      }

      // Recarregar usuários
      await loadUsers(token)
      alert('Pagamento rejeitado')
    } catch (error) {
      console.error('Erro ao rejeitar:', error)
      alert('Erro ao rejeitar pagamento')
    } finally {
      setActionLoading(null)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    totalUsers: users.length,
    activeSubscriptions: users.filter(u => u.subscription?.status === 'active').length,
    pendingPayments: users.filter(u => u.subscription?.status === 'pending').length,
    totalRevenue: users.filter(u => u.subscription?.status === 'active').length * 29.90
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

  if (!admin) return null

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-cyan-500" />
              <div>
                <span className="text-xl font-bold">SafeCheck AI</span>
                <span className="ml-3 px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">Admin</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">{admin.name}</p>
                <p className="text-xs text-gray-400">{admin.email}</p>
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
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-cyan-500/10 rounded-lg">
                <Users className="w-6 h-6 text-cyan-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
                <p className="text-sm text-gray-400">Total de Usuários</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.activeSubscriptions}</p>
                <p className="text-sm text-gray-400">Assinaturas Ativas</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pendingPayments}</p>
                <p className="text-sm text-gray-400">Pagamentos Pendentes</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">R$ {stats.totalRevenue.toFixed(2)}</p>
                <p className="text-sm text-gray-400">Receita Mensal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gerenciamento de Usuários */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Gerenciar Usuários</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar usuário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          {/* Tabela de Usuários */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Nome</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">E-mail</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Status</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Expira em</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-400">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhum usuário encontrado</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const isActive = user.subscription?.status === 'active'
                    const isPending = user.subscription?.status === 'pending'
                    const isRejected = user.subscription?.status === 'rejected'
                    const expiresAt = user.subscription?.expiresAt 
                      ? new Date(user.subscription.expiresAt).toLocaleDateString('pt-BR')
                      : '-'

                    return (
                      <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-medium">{user.name}</div>
                        </td>
                        <td className="py-4 px-4 text-gray-400">{user.email}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                            isActive 
                              ? 'bg-green-500/20 text-green-400' 
                              : isPending
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : isRejected
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {isActive && <CheckCircle className="w-3 h-3" />}
                            {isPending && <Clock className="w-3 h-3" />}
                            {isRejected && <XCircle className="w-3 h-3" />}
                            {isActive ? 'Ativa' : isPending ? 'Pendente' : isRejected ? 'Rejeitada' : 'Sem assinatura'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-400">{expiresAt}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {isPending && (
                              <>
                                <button 
                                  onClick={() => handleApprove(user.id)}
                                  disabled={actionLoading === user.id}
                                  className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition-colors disabled:opacity-50"
                                >
                                  {actionLoading === user.id ? 'Processando...' : 'Aprovar'}
                                </button>
                                <button 
                                  onClick={() => handleReject(user.id)}
                                  disabled={actionLoading === user.id}
                                  className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors disabled:opacity-50"
                                >
                                  Rejeitar
                                </button>
                                {user.subscription?.comprovante && (
                                  <a
                                    href={`http://localhost:5000/uploads/${user.subscription.comprovante}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm hover:bg-cyan-500/30 transition-colors inline-flex items-center gap-1"
                                  >
                                    <Eye className="w-3 h-3" />
                                    Ver Comprovante
                                  </a>
                                )}
                              </>
                            )}
                            {isActive && (
                              <span className="text-xs text-gray-400">Assinatura ativa</span>
                            )}
                            {isRejected && (
                              <span className="text-xs text-red-400">Pagamento rejeitado</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
