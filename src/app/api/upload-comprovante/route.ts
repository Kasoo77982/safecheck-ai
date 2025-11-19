import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Proxy para o backend Express (porta 5000)
    const response = await fetch('http://localhost:5000/api/upload-comprovante', {
      method: 'POST',
      headers: {
        'Authorization': request.headers.get('Authorization') || '',
      },
      body: formData,
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Erro no proxy de upload:', error)
    return NextResponse.json(
      { error: 'Erro ao conectar com o servidor' },
      { status: 500 }
    )
  }
}
