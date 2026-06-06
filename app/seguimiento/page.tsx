'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function SeguimientoPage() {
    const [ticketId, setTicketId] = useState('')
    const [claim, setClaim] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    async function searchTicket(
        e: React.FormEvent
    ) {
        e.preventDefault()

        setLoading(true)

        const { data, error } = await supabase
            .from('claims')
            .select('*')
            .eq('id', ticketId)
            .single()

        setLoading(false)

        if (error || !data) {
            alert('Ticket no encontrado')
            return
        }

        setClaim(data)
    }

    return (
        <main className="max-w-xl mx-auto p-8">

            <h1 className="text-3xl font-bold mb-6">
                Seguimiento de Ticket
            </h1>

            <form
                onSubmit={searchTicket}
                className="flex gap-2 mb-6"
            >
                <input
                    value={ticketId}
                    onChange={(e) =>
                        setTicketId(e.target.value)
                    }
                    placeholder="Número de ticket"
                    className="border p-3 rounded flex-1"
                    required
                />

                <button
                    type="submit"
                    className="bg-black text-white px-4 rounded"
                >
                    Buscar
                </button>
            </form>

            {claim && (
                <div className="border rounded p-6">

                    <h2 className="text-xl font-bold mb-4">
                        Ticket #{claim.id}
                    </h2>

                    <p>
                        <strong>Estado:</strong>{' '}
                        {claim.status}
                    </p>

                    <p className="mt-2">
                        <strong>Producto:</strong>{' '}
                        {claim.product_name}
                    </p>

                    <p className="mt-2">
                        <strong>Fecha:</strong>{' '}
                        {new Date(
                            claim.created_at
                        ).toLocaleString()}
                    </p>

                    {claim.status ===
                        'Reembolso aprobado' && (
                            <div className="mt-4 p-4 border rounded bg-yellow-50">
                                Tu caso fue aprobado para
                                reembolso.

                                <div className="mt-3">
                                    <a
                                        href="/reembolso"
                                        className="text-blue-600 underline"
                                    >
                                        Completar datos de
                                        reembolso
                                    </a>
                                </div>
                            </div>
                        )}

                </div>
            )}

            {loading && (
                <p>Buscando ticket...</p>
            )}

        </main>
    )
}