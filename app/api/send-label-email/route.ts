import { Resend } from 'resend'

const resend = new Resend(
    process.env.RESEND_API_KEY
)

export async function POST(
    req: Request
) {
    const {
        email,
        customerName,
        ticketId,
        carrier,
        trackingNumber,
        labelUrl,
    } = await req.json()

    const result =
        await resend.emails.send({
            from:
                'Avocado Claims <reclamos@avocadotechshop.com>',
            to: email,
            subject:
                `Etiqueta de devolución - Ticket #${ticketId}`,
            html: `
        <h2>Hola ${customerName}</h2>

        <p>
          Tu devolución fue aprobada.
        </p>

        <p>
          Transportista:
          ${carrier}
        </p>

        <p>
          Tracking:
          ${trackingNumber}
        </p>

        <p>
          <a href="${labelUrl}">
            Descargar etiqueta
          </a>
        </p>
      `,
        })

    return Response.json(result)
}