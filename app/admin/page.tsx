'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Claim = {
    id: number
    order_number: string
    customer_name: string
    whatsapp: string
    product_name: string
    issue: string
    image_url: string | null
    status: string
}

export default function AdminPage() {
    const router = useRouter()

    const [loading, setLoading] = useState(true)
    const [claims, setClaims] = useState<Claim[]>([])
    const [search, setSearch] = useState('')

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

        const { data, error } = await supabase
            .from('claims')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error(error)
        }

        setClaims(data || [])
        setLoading(false)
    }

    async function logout() {
        await supabase.auth.signOut()
        router.push('/login')
    }

    async function updateStatus(
        claimId: number,
        newStatus: string
    ) {
        const { error } = await supabase
            .from('claims')
            .update({
                status: newStatus,
            })
            .eq('id', claimId)

        if (error) {
            alert('Error actualizando estado')
            console.error(error)
            return
        }

        await supabase
            .from('claim_events')
            .insert([
                {
                    claim_id: claimId,
                    event_type: 'status_change',
                    description: `Estado cambiado a ${newStatus}`,
                },
            ])

        setClaims((prev) =>
            prev.map((claim) =>
                claim.id === claimId
                    ? { ...claim, status: newStatus }
                    : claim
            )
        )
    }

    const filteredClaims = claims.filter((claim) =>
        claim.order_number
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
        claim.customer_name
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
        claim.whatsapp
            ?.toLowerCase()
            .includes(search.toLowerCase())
    )

    const openCount = claims.filter(
        (c) => c.status === 'Abierto'
    ).length

    const reviewCount = claims.filter(
        (c) => c.status === 'En revisión'
    ).length

    const waitingCount = claims.filter(
        (c) => c.status === 'Esperando cliente'
    ).length

    const resolvedCount = claims.filter(
        (c) => c.status === 'Resuelto'
    ).length

    if (loading) {
        return (
            <div className="p-8">
                Cargando...
            </div>
        )
    }

    return (
        <main className="max-w-7xl mx-auto p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">
                    Avocado Claims
                </h1>

                <button
                    onClick={logout}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                >
                    Cerrar sesión
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

                <div className="border rounded p-4">
                    <div className="text-sm text-gray-500">
                        Abiertos
                    </div>

                    <div className="text-3xl font-bold">
                        {openCount}
                    </div>
                </div>

                <div className="border rounded p-4">
                    <div className="text-sm text-gray-500">
                        En revisión
                    </div>

                    <div className="text-3xl font-bold">
                        {reviewCount}
                    </div>
                </div>

                <div className="border rounded p-4">
                    <div className="text-sm text-gray-500">
                        Esperando cliente
                    </div>

                    <div className="text-3xl font-bold">
                        {waitingCount}
                    </div>
                </div>

                <div className="border rounded p-4">
                    <div className="text-sm text-gray-500">
                        Resueltos
                    </div>

                    <div className="text-3xl font-bold">
                        {resolvedCount}
                    </div>
                </div>

            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="🔍 Buscar por orden, cliente o WhatsApp..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border rounded p-3"
                />
            </div>

            <p className="text-sm text-gray-500 mb-4">
                {filteredClaims.length} tickets encontrados
            </p>

            <table className="w-full border border-gray-300">
                <thead>
                    <tr className="border-b bg-gray-100">
                        <th className="p-2">ID</th>
                        <th className="p-2">Orden</th>
                        <th className="p-2">Cliente</th>
                        <th className="p-2">WhatsApp</th>
                        <th className="p-2">Producto</th>
                        <th className="p-2">Problema</th>
                        <th className="p-2">Foto</th>
                        <th className="p-2">Estado</th>
                        <th className="p-2">Contacto</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredClaims.map((claim) => (
                        <tr
                            key={claim.id}
                            className="border-b"
                        >
                            <td className="p-2">
                                <a
                                    href={`/admin/ticket/${claim.id}`}
                                    className="text-blue-600 underline"
                                >
                                    #{claim.id}
                                </a>
                            </td>

                            <td className="p-2">
                                {claim.order_number}
                            </td>

                            <td className="p-2">
                                {claim.customer_name}
                            </td>

                            <td className="p-2">
                                {claim.whatsapp}
                            </td>

                            <td className="p-2">
                                {claim.product_name}
                            </td>

                            <td className="p-2 max-w-xs">
                                {claim.issue}
                            </td>

                            <td className="p-2">
                                {claim.image_url ? (
                                    <a
                                        href={claim.image_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <img
                                            src={claim.image_url}
                                            alt="Reclamo"
                                            className="w-20 h-20 object-cover border rounded"
                                        />
                                    </a>
                                ) : (
                                    '-'
                                )}
                            </td>

                            <td className="p-2">
                                <select
                                    value={claim.status}
                                    onChange={(e) =>
                                        updateStatus(
                                            claim.id,
                                            e.target.value
                                        )
                                    }
                                    className="border rounded p-1"
                                >
                                    <option value="Abierto">
                                        Abierto
                                    </option>

                                    <option value="En revisión">
                                        En revisión
                                    </option>

                                    <option value="Esperando cliente">
                                        Esperando cliente
                                    </option>

                                    <option value="Reembolso aprobado">
                                        Reembolso aprobado
                                    </option>

                                    <option value="Reembolsado">
                                        Reembolsado
                                    </option>

                                    <option value="Resuelto">
                                        Resuelto
                                    </option>
                                </select>
                            </td>

                            <td className="p-2">
                                <a
                                    href={`https://wa.me/${claim.whatsapp.replace(
                                        /\D/g,
                                        ''
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-600 font-semibold"
                                >
                                    💬 WhatsApp
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    )
}