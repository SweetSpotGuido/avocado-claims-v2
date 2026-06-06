import { Resend } from 'resend'

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
        } = await req.json()

        const result =
            await resend.emails.send({
                from:
                    'Avocado Claims <reclamos@avocadotechshop.com>',
                to: email,
                subject:
                    `Reembolso procesado - Ticket #${ticketId}`,
                html: `
          <h2>Hola ${customerName}</h2>

          <p>
            Te informamos que el reembolso
            correspondiente a tu reclamo
            ya fue procesado.
          </p>

          <p>
            <strong>
              Ticket #${ticketId}
            </strong>
          </p>

          <p>
            Si tienes alguna consulta,
            puedes responder este correo.
          </p>

          <p>
            Gracias por confiar en Avocado.
          </p>

          <p>
            Equipo Avocado Support
          </p>
        `,
            })

        return Response.json(result)
    } catch (error) {
        console.error(error)

        return Response.json(
            { error },
            { status: 500 }
        )
    }
}