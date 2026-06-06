'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function TicketDetailPage() {
    const params = useParams()
    const router = useRouter()

    const [loading, setLoading] = useState(true)
    const [claim, setClaim] = useState<any>(null)
    const [notes, setNotes] = useState('')

    useEffect(() => {
        loadTicket()
    }, [])

    async function loadTicket() {
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
            .eq('id', params.id)
            .single()

        if (error) {
            console.error(error)
            return
        }

        setClaim(data)
        setNotes(data.internal_notes || '')
        setLoading(false)
    }

    async function saveNotes() {
        const { error } = await supabase
            .from('claims')
            .update({
                internal_notes: notes,
            })
            .eq('id', claim.id)

        if (error) {
            alert('Error guardando notas')
            return
        }

        alert('Notas guardadas')
    }

    if (loading) {
        return (
            <div className="p-8">
                Cargando ticket...
            </div>
        )
    }

    if (!claim) {
        return (
            <div className="p-8">
                Ticket no encontrado
            </div>
        )
    }

    return (
        <main className="max-w-4xl mx-auto p-8">
            <button
                onClick={() => router.push('/admin')}
                className="mb-6 border px-4 py-2 rounded"
            >
                ← Volver
            </button>

            <h1 className="text-3xl font-bold mb-6">
                Ticket #{claim.id}
            </h1>

            <div className="space-y-4">

                <div>
                    <strong>Orden:</strong><br />
                    {claim.order_number}
                </div>

                <div>
                    <strong>Cliente:</strong><br />
                    {claim.customer_name}
                </div>

                <div>
                    <strong>WhatsApp:</strong><br />
                    {claim.whatsapp}
                </div>

                <div>
                    <strong>Producto:</strong><br />
                    {claim.product_name}
                </div>

                <div>
                    <strong>Estado:</strong><br />
                    {claim.status}
                </div>

                <div>
                    <strong>Problema:</strong><br />
                    {claim.issue}
                </div>

                <div>
                    <strong>Fecha:</strong><br />
                    {new Date(
                        claim.created_at
                    ).toLocaleString()}
                </div>

                {claim.image_url && (
                    <div>
                        <strong>Imagen:</strong>

                        <div className="mt-2">
                            <img
                                src={claim.image_url}
                                alt="Reclamo"
                                className="max-w-full border rounded"
                            />
                        </div>
                    </div>
                )}

                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-2">
                        Notas internas
                    </h2>

                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={8}
                        className="w-full border rounded p-3"
                        placeholder="Escribe notas internas..."
                    />

                    <button
                        onClick={saveNotes}
                        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Guardar notas
                    </button>
                </div>

                {claim.refund_cvu && (
                    <div className="mt-6 border rounded p-4">
                        <h2 className="text-xl font-bold mb-3">
                            Datos de reembolso
                        </h2>

                        <p>
                            <strong>Titular:</strong>{' '}
                            {claim.refund_holder}
                        </p>

                        <p>
                            <strong>CVU / CBU:</strong>{' '}
                            {claim.refund_cvu}
                        </p>

                        <p>
                            <strong>Alias:</strong>{' '}
                            {claim.refund_alias || '-'}
                        </p>

                        <p>
                            <strong>Fecha:</strong>{' '}
                            {claim.refund_requested_at
                                ? new Date(
                                    claim.refund_requested_at
                                ).toLocaleString()
                                : '-'}
                        </p>
                    </div>
                )}

                <a
                    href={`https://wa.me/${claim.whatsapp.replace(
                        /\D/g,
                        ''
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-green-600 text-white px-4 py-2 rounded"
                >
                    💬 Contactar por WhatsApp
                </a>

            </div>
        </main>
    )
}
