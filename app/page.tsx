'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [ticketNumber, setTicketNumber] = useState<number | null>(null)
    const [image, setImage] = useState<File | null>(null)


    const [form, setForm] = useState({
        order_number: '',
        customer_name: '',
        whatsapp: '',
        email: '',
        product_name: '',
        issue: '',
    })

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        setLoading(true)

        let imageUrl = null

        if (image) {
            const fileName = `${Date.now()}-${image.name}`

            const { error: uploadError } = await supabase.storage
                .from('claim-images')
                .upload(fileName, image)

            if (uploadError) {
                setLoading(false)

                console.log('UPLOAD ERROR:', uploadError)
                alert(JSON.stringify(uploadError, null, 2))

                return
            }

            const { data } = supabase.storage
                .from('claim-images')
                .getPublicUrl(fileName)

            imageUrl = data.publicUrl
        }

        const publicToken =
            crypto.randomUUID().replace(/-/g, '')

        const { data, error } = await supabase
            .from('claims')
            .insert([
                {
                    order_number: form.order_number,
                    customer_name: form.customer_name,
                    whatsapp: form.whatsapp,
                    email: form.email,
                    product_name: form.product_name,
                    issue: form.issue,
                    image_url: imageUrl,
                    public_token: publicToken,
                },
            ])
            .select()
            .single()

        setLoading(false)

        if (error) {
            alert('Error al crear el reclamo')
            console.error(error)
            return
        }

        setTicketNumber(data.id)

        await fetch(
            '/api/send-ticket-email',
            {
                method: 'POST',
                headers: {
                    'Content-Type':
                        'application/json',
                },
                body: JSON.stringify({
                    email: form.email,
                    customerName:
                        form.customer_name,
                    ticketId: data.id,
                    ticketToken: publicToken,
                }),
            }
        )

        await supabase
            .from('claim_events')
            .insert([
                {
                    claim_id: data.id,
                    event_type: 'ticket_created',
                    description: 'Ticket creado',
                },
            ])

        setSuccess(true)

        setForm({
            order_number: '',
            customer_name: '',
            whatsapp: '',
            email: '',
            product_name: '',
            issue: '',
        })

        setImage(null)
    }

    if (success) {
        return (
            <main className="max-w-xl mx-auto p-8 text-center">
                <h1 className="text-3xl font-bold mb-4">
                    ✅ Reclamo enviado
                </h1>

                <p className="mb-4">
                    Gracias por contactarte con el equipo de Avocado.
                </p>

                <div className="border rounded p-6 text-2xl font-bold">
                    Ticket #{ticketNumber}
                </div>

                <p className="mt-4 text-gray-600">
                    Guarda este número para futuras consultas.
                </p>
            </main>
        )
    }

    return (
        <main className="max-w-xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">
                Centro de Reclamos de Avocado
            </h1>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
            >
                <input
                    placeholder="Número de orden"
                    value={form.order_number}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            order_number: e.target.value,
                        })
                    }
                    className="border p-3 rounded"
                    required
                />

                <input
                    placeholder="Nombre"
                    value={form.customer_name}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            customer_name: e.target.value,
                        })
                    }
                    className="border p-3 rounded"
                    required
                />

                <input
                    placeholder="WhatsApp"
                    value={form.whatsapp}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            whatsapp: e.target.value,
                        })
                    }
                    className="border p-3 rounded"
                    required
                />

                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={form.email}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            email: e.target.value,
                        })
                    }
                    className="border p-3 rounded"
                    required
                />

                <input
                    placeholder="Producto"
                    value={form.product_name}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            product_name: e.target.value,
                        })
                    }
                    className="border p-3 rounded"
                />

                <textarea
                    placeholder="Describe el problema"
                    value={form.issue}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            issue: e.target.value,
                        })
                    }
                    className="border p-3 rounded"
                    rows={5}
                />

                <div>
                    <label className="block mb-3 text-lg font-medium">
                        Foto del problema
                    </label>

                    <label
                        htmlFor="image-upload"
                        className="
            flex items-center gap-4
            border-2 border-dashed border-zinc-700
            rounded-xl
            p-5
            cursor-pointer
            hover:border-green-500
            transition-all
        "
                    >
                        <div
                            className="
                w-16 h-16
                rounded-xl
                border border-green-500
                flex items-center justify-center
                text-3xl
            "
                        >
                            📤
                        </div>

                        <div>
                            <p className="text-lg font-medium">
                                Elegir archivo
                            </p>

                            <p className="text-sm text-zinc-400">
                                JPG, PNG o WEBP · Máx. 10 MB
                            </p>

                            {image && (
                                <p className="text-green-500 text-sm mt-1">
                                    ✓ {image.name}
                                </p>
                            )}
                        </div>
                    </label>

                    <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files?.[0]) {
                                setImage(e.target.files[0])
                            }
                        }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="
        w-full
        bg-green-700
        hover:bg-green-800
        text-white
        font-semibold
        p-4
        rounded-xl
        transition
        disabled:opacity-50
    "
                >
                    {loading ? 'Enviando...' : 'Enviar reclamo'}
                </button>
            </form>
        </main>
    )
}
