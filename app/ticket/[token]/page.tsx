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
    public_token?: string | null
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

            <div className=" mt-4 border border-green-500 bg-gradient-to-r from-green-950 to-zinc-900 rounded-xl p-5 ">

                <p>
                    <strong>Ticket:</strong> #
                    {claim.id}
                </p>

                <div>

                    <strong>Estado:</strong>

                    <div className=" mt-4 border border-green-500 bg-gradient-to-r from-green-950 to-zinc-900 rounded-xl p-5 ">

                        {claim.status === 'Abierto' && (
                            <span className=" font-bold text-green-400 text-xl ">
                                📋 Abierto
                            </span>
                        )}

                        {claim.status === 'En revisión' && (
                            <span className=" font-bold text-green-400 text-xl ">
                                🔍 En revisión
                            </span>
                        )}

                        {claim.status ===
                            'Devolución habilitada' && (
                                <div
                                    className="
            mt-4
            border
            border-blue-500
            bg-gradient-to-r
            from-blue-950
            to-zinc-900
            rounded-xl
            p-5
        "
                                >
                                    <h3
                                        className="
                font-bold
                text-blue-400
                text-xl
            "
                                    >
                                        📦 Devolución habilitada
                                    </h3>

                                    <p className="mt-2 text-zinc-200">
                                        Tu devolución fue aprobada.
                                    </p>

                                    <p className="mt-2 text-zinc-200">
                                        Descarga la etiqueta,
                                        imprímela y entrega el
                                        paquete en Correo Argentino.
                                    </p>

                                    {claim.return_label_url && (
                                        <a
                                            href={claim.return_label_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="
                    inline-block
                    mt-4
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    px-5
                    py-3
                    rounded-lg
                    font-medium
                "
                                        >
                                            📄 Descargar etiqueta
                                        </a>
                                    )}
                                </div>
                            )}

                        {claim.status ===
                            'Reembolso aprobado' && (
                                <div className=" mt-4 border border-green-500 bg-gradient-to-r from-green-950 to-zinc-900 rounded-xl p-5 ">
                                    <h3 className=" font-bold text-green-400 text-xl ">
                                        💰 Reembolso aprobado
                                    </h3>

                                    <p className="mt-2 text-zinc-200">
                                        Hemos aprobado tu solicitud
                                        de reembolso.
                                    </p>

                                    <p className="mt-2 text-zinc-200">
                                        Si aún no lo hiciste,
                                        ingresa los datos de la
                                        cuenta donde deseas
                                        recibir el dinero.
                                    </p>

                                    <a
                                        href={`/reembolso?ticket=${claim.id}`}
                                        className="
        inline-block
        mt-4
        bg-green-700
        text-white
        px-4
        py-2
        rounded-lg
    "
                                    >
                                        Completar datos de reembolso
                                    </a>

                                </div>
                            )}

                        {claim.status === 'Reembolsado' && (
                            <div className="
    mt-4
    border
    border-green-500
    bg-gradient-to-r
    from-green-950
    to-zinc-900
    rounded-xl
    p-5
">
                                <h3 className="
        font-bold
        text-green-400
        text-xl
    ">
                                    💸 Reembolso realizado
                                </h3>

                                <p className="mt-2 text-zinc-200">
                                    La transferencia fue procesada correctamente.
                                </p>
                            </div>
                        )}

                        {claim.status === 'Resuelto' && (
                            <span className="bg-blue-200 px-3 py-1 rounded-full">
                                ✅ Resuelto
                            </span>
                        )}

                    </div>

                </div>

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
                    <div className=" mt-4 border border-green-500 bg-gradient-to-r from-green-950 to-zinc-900 rounded-xl p-5 ">
                        <strong>
                            Última actualización
                        </strong>

                        <p className="mt-2 text-zinc-200">
                            {claim.customer_message}
                        </p>
                    </div>
                )}

                {claim.carrier && (
                    <div className=" mt-4 border border-green-500 bg-gradient-to-r from-green-950 to-zinc-900 rounded-xl p-5 ">

                        <p>
                            <strong>
                                Transportista:
                            </strong>{' '}
                            {claim.carrier}
                        </p>

                        {claim.tracking_number && (
                            <p className="mt-2 text-zinc-200">
                                <strong>
                                    Tracking:
                                </strong>{' '}
                                {claim.tracking_number}
                            </p>
                        )}

                        {claim.carrier ===
                            'Correo Argentino' &&
                            claim.tracking_number && (
                                <a
                                    href={`https://www.correoargentino.com.ar/formularios/e-commerce?id=${claim.tracking_number}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
                        inline-block
                        mt-3
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        px-4
                        py-2
                        rounded-lg
                    "
                                >
                                    🔍 Rastrear envío
                                </a>
                            )}
                    </div>
                )}
            </div>

        </main>
    )
}