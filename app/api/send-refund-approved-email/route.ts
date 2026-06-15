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
            ticketToken,
        } = await req.json()

        const result =
            await resend.emails.send({
                from:
                    'Avocado Claims <reclamos@avocadotechshop.com>',
                to: email,
                subject:
                    `Reembolso aprobado - Ticket #${ticketId}`,
                html: `
          <h2>Hola ${customerName}</h2>

          <p>
            Hemos aprobado tu solicitud
            de reembolso.
          </p>

          <p>
            <strong>
              Ticket #${ticketId}
            </strong>
          </p>

          <p>
            Para continuar, por favor
            ingresa los datos de la cuenta
            donde deseas recibir el dinero.
          </p>

          <p>
            Puedes hacerlo desde el
            seguimiento de tu ticket.
          </p>

          <p>
            <a href="https://avocado-claims-v2-xoip.vercel.app/ticket/${ticketToken}">
                Consultar ticket
          </a>
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