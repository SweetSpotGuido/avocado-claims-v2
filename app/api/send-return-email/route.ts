import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(
    process.env.RESEND_API_KEY
)

export async function POST(
    req: Request
) {
    try {
        const {
            email,
            customerName,
            ticketId,
            ticketToken,
            labelUrl,
        } = await req.json()

        const result =
            await resend.emails.send({
                from:
                    'Avocado Claims <reclamos@avocadotechshop.com>',
                to: email,
                subject:
                    `Devolución habilitada - Ticket #${ticketId}`,
                html: `
                    <h2>Hola ${customerName}</h2>

                    <p>
                        Hemos aprobado la devolución
                        de tu producto.
                    </p>

                    <p>
                        Sigue estos pasos:
                    </p>

                    <ol>
                        <li>
                            Descarga la etiqueta de devolución.
                        </li>
                        <li>
                            Imprímela y pégala en el paquete.
                        </li>
                        <li>
                            Entrega el paquete en Correo Argentino.
                        </li>
                    </ol>

                    ${labelUrl
                        ? `
                        <p>
                            <a
                                href="${labelUrl}"
                                style="
                                    background:#2563eb;
                                    color:white;
                                    padding:12px 20px;
                                    text-decoration:none;
                                    border-radius:8px;
                                    display:inline-block;
                                "
                            >
                                📦 Descargar etiqueta
                            </a>
                        </p>
                    `
                        : ''
                    }

                    <p>
                        También puedes seguir el estado
                        de tu caso desde el siguiente enlace:
                    </p>

                    <p>
                        <a
                            href="https://avocado-claims-v2-xoip.vercel.app/ticket/${ticketToken}"
                            style="
                                background:#15803d;
                                color:white;
                                padding:12px 20px;
                                text-decoration:none;
                                border-radius:8px;
                                display:inline-block;
                            "
                        >
                            🔎 Ver seguimiento
                        </a>
                    </p>

                    <p>
                        Ticket #${ticketId}
                    </p>

                    <p>
                        Equipo de soporte Avocado
                    </p>
                `,
            })

        return NextResponse.json(
            result
        )
    } catch (error) {
        console.error(error)

        return NextResponse.json(
            { error },
            { status: 500 }
        )
    }
}