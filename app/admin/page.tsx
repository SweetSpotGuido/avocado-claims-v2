'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [claims, setClaims] = useState<any[]>([])

  useEffect(() => {
    checkSession()
  }, [])

  async function checkSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      router.push('/login')
      return
    }

    const { data } = await supabase
      .from('claims')
      .select('*')
      .order('created_at', { ascending: false })

    setClaims(data || [])
    setLoading(false)
  }

  async function logout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return <div className="p-8">Cargando...</div>
  }

  return (
    <main className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">
          Tickets
        </h1>

        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Cerrar sesión
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="border-b">
            <th className="p-2">ID</th>
            <th className="p-2">Orden</th>
            <th className="p-2">Cliente</th>
            <th className="p-2">WhatsApp</th>
            <th className="p-2">Producto</th>
            <th className="p-2">Problema</th>
            <th className="p-2">Estado</th>
          </tr>
        </thead>

        <tbody>
          {claims.map((claim) => (
            <tr key={claim.id} className="border-b">
              <td className="p-2">{claim.id}</td>
              <td className="p-2">{claim.order_number}</td>
              <td className="p-2">{claim.customer_name}</td>
              <td className="p-2">{claim.whatsapp}</td>
              <td className="p-2">{claim.product_name}</td>
              <td className="p-2">{claim.issue}</td>
              <td className="p-2">{claim.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
