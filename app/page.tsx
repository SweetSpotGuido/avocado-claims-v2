'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    order_number: '',
    customer_name: '',
    whatsapp: '',
    product_name: '',
    issue: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    setLoading(true)

    const { error } = await supabase.from('claims').insert([
      {
        order_number: form.order_number,
        customer_name: form.customer_name,
        whatsapp: form.whatsapp,
        product_name: form.product_name,
        issue: form.issue,
      },
    ])

    setLoading(false)

    if (error) {
      alert('Error al crear el reclamo')
      console.error(error)
      return
    }

    setSuccess(true)

    setForm({
      order_number: '',
      customer_name: '',
      whatsapp: '',
      product_name: '',
      issue: '',
    })
  }

  if (success) {
    return (
      <main className="max-w-xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">
          Reclamo enviado
        </h1>

        <p>
          Gracias por contactarte con Avocado Claims.
          Revisaremos tu caso lo antes posible.
        </p>
      </main>
    )
  }

  return (
    <main className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Avocado Claims
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

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white p-3 rounded"
        >
          {loading ? 'Enviando...' : 'Enviar reclamo'}
        </button>
      </form>
    </main>
  )
}
