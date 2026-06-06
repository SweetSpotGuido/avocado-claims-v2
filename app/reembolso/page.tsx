'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ReembolsoPage() {
    const [ticketId, setTicketId] = useState('')
    const [holder, setHolder] = useState('')
    const [cvu, setCvu] = useState('')
    const [alias, setAlias] = useState('')

    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    async function handleSubmit(
        e: React.FormEvent
    ) {
        e.preventDefault()

        setLoading(true)

        const { data: claim, error: findError } =
            await supabase
                .from('claims')
                .select('*')
                .eq('id', ticketId)
                .single()

        if (findError || !claim) {
            setLoading(false)
            alert('Ticket no encontrado')
            return
        }

        if (
            claim.status !==
            'Reembolso aprobado'
        ) {
            setLoading(false)

            alert(
                'Tu caso aún no fue aprobado para reembolso.'
            )

            return
        }

        const { error } = await supabase
            .from('claims')
            .update({
                refund_holder: holder,
                refund_cvu: cvu,
                refund_alias: alias,
                refund_requested_at:
                    new Date().toISOString(),
            })
            .eq('id', ticketId)

        setLoading(false)

        if (error) {
            alert(
                'Error guardando datos'
            )
            console.error(error)
            return
        }

        await supabase
            .from('claim_events')
            .insert([
                {
                    claim_id: Number(ticketId),
                    event_type: 'refund_info',
                    description:
                        'Cliente cargó datos de reembolso',
                },
            ])

        setSuccess(true)
    }

    if (success) {
        return (
            <main className="max-w-xl mx-auto p-8 text-center">
                <h1 className="text-3xl font-bold mb-4">
                    Datos recibidos
                </h1>

                <p>
                    Hemos recibido tus datos de
                    reembolso correctamente.
                </p>

                <p className="mt-4">
                    Ticket #{ticketId}
                </p>
            </main>
        )
    }

    return (
        <main className="max-w-xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">
                Solicitud de Reembolso
            </h1>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
            >
                <input
                    placeholder="Número de ticket"
                    value={ticketId}
                    onChange={(e) =>
                        setTicketId(e.target.value)
                    }
                    className="border p-3 rounded"
                    required
                />

                <input
                    placeholder="Titular de la cuenta"
                    value={holder}
                    onChange={(e) =>
                        setHolder(e.target.value)
                    }
                    className="border p-3 rounded"
                    required
                />

                <input
                    placeholder="CVU / CBU"
                    value={cvu}
                    onChange={(e) =>
                        setCvu(e.target.value)
                    }
                    className="border p-3 rounded"
                    required
                />

                <input
                    placeholder="Alias (opcional)"
                    value={alias}
                    onChange={(e) =>
                        setAlias(e.target.value)
                    }
                    className="border p-3 rounded"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white p-3 rounded"
                >
                    {loading
                        ? 'Enviando...'
                        : 'Enviar datos'}
                </button>
            </form>
        </main>
    )
}