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
    const [customerMessage, setCustomerMessage] = useState('')
    const [events, setEvents] = useState<any[]>([])

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

        const { data: eventsData } =
            await supabase
                .from('claim_events')
                .select('*')
                .eq('claim_id', params.id)
                .order('created_at', {
                    ascending: false,
                })

        setEvents(eventsData || [])

        setClaim(data)
        setNotes(data.internal_notes || '')
        setCustomerMessage(
            data.customer_message || ''
        )
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

        await supabase
            .from('claim_events')
            .insert([
                {
                    claim_id: claim.id,
                    event_type: 'note',
                    description: 'Nota interna actualizada',
                },
            ])
    }

    async function saveCustomerMessage() {
        const { error } = await supabase
            .from('claims')
            .update({
                customer_message: customerMessage,
            })
            .eq('id', claim.id)

        if (error) {
            alert('Error guardando mensaje')
            return
        }

        alert('Mensaje guardado')

        await supabase
            .from('claim_events')
            .insert([
                {
                    claim_id: claim.id,
                    event_type: 'customer_message',
                    description:
                        'Mensaje para cliente actualizado',
                },
            ])
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

                    <div className="mt-8">
                        <h2 className="text-xl font-bold mb-3">
                            Historial
                        </h2>

                        <div className="space-y-2">
                            {events.map((event) => (
                                <div
                                    key={event.id}
                                    className="border rounded p-3"
                                >
                                    <div className="font-medium">
                                        {event.description}
                                    </div>

                                    <div className="text-sm text-gray-500">
                                        {new Date(
                                            event.created_at
                                        ).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

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

                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-2">
                        Mensaje para el cliente
                    </h2>

                    <textarea
                        value={customerMessage}
                        onChange={(e) =>
                            setCustomerMessage(
                                e.target.value
                            )
                        }
                        rows={5}
                        className="w-full border rounded p-3"
                        placeholder="Mensaje visible para el cliente..."
                    />

                    <button
                        onClick={saveCustomerMessage}
                        className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
                    >
                        Guardar mensaje
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
