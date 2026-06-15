'use client'

import { use, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Claim = {
    id: number
    order_number: string
    customer_name: string
    product_name: string
    issue: string
    status: string
    image_url: string | null
    customer_message?: string | null
    refund_holder?: string | null
    refund_cvu?: string | null
    refund_alias?: string | null
    carrier?: string | null
    tracking_number?: string | null
    return_label_url?: string | null
}

export default function TicketPage({
    params,
}: {
    params: Promise<{
        token: string
    }>
}) {
    const { token } = use(params)

    const [claim, setClaim] =
        useState<Claim | null>(null)

    const [loading, setLoading] =
        useState(true)

    useEffect(() => {
        loadTicket()
    }, [])

    console.log('TOKEN:', token)

    async function loadTicket() {
        const { data, error } =
            await supabase
                .from('claims')
                .select('*')
                .eq(
                    'public_token',
                    token
                )
                .single()

        if (error) {
            console.error(error)
        }

        setClaim(data)
        setLoading(false)
    }

    if (loading) {
        return (
            <main className="max-w-3xl mx-auto p-8">
                Cargando...
            </main>
        )
    }

    if (!claim) {
        return (
            <main className="max-w-3xl mx-auto p-8">
                Ticket no encontrado
            </main>
        )
    }

    return (
        <main className="max-w-3xl mx-auto p-8">

            <h1 className="text-3xl font-bold mb-6">
                Seguimiento de reclamo
            </h1>

            <div className="border rounded-xl p-6 space-y-4">

                <p>
                    <strong>Ticket:</strong> #
                    {claim.id}
                </p>

                <p>
                    <strong>Estado:</strong>{' '}
                    {claim.status}
                </p>

                <p>
                    <strong>Producto:</strong>{' '}
                    {claim.product_name}
                </p>

                <p>
                    <strong>Problema:</strong>{' '}
                    {claim.issue}
                </p>

                {claim.image_url && (
                    <div>
                        <strong>Imagen:</strong>

                        <img
                            src={claim.image_url}
                            alt="Reclamo"
                            className="mt-2 rounded border max-w-sm"
                        />
                    </div>
                )}

                {claim.customer_message && (
                    <div className="border rounded p-4 bg-zinc-50">
                        <strong>
                            Última actualización
                        </strong>

                        <p className="mt-2">
                            {claim.customer_message}
                        </p>
                    </div>
                )}

                {claim.carrier && (
                    <div>
                        <strong>
                            Transportista:
                        </strong>{' '}
                        {claim.carrier}
                    </div>
                )}

                {claim.tracking_number && (
                    <div>
                        <strong>
                            Tracking:
                        </strong>{' '}
                        {claim.tracking_number}
                    </div>
                )}

                {claim.return_label_url && (
                    <a
                        href={claim.return_label_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-green-700 text-white px-4 py-2 rounded"
                    >
                        Descargar etiqueta
                    </a>
                )}

            </div>

        </main>
    )
}