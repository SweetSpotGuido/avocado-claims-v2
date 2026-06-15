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
                    `Estamos revisando tu caso - Ticket #${ticketId}`,
                html: `
          <h2>Hola ${customerName}</h2>

          <p>
            Queremos informarte que ya
            comenzamos a revisar tu caso.
          </p>

          <p>
            <strong>
              Ticket #${ticketId}
            </strong>
          </p>

          <p>
            Puedes consultar el estado
            actualizado aquí:
          </p>

          <p>
            <a href="https://avocado-claims-v2-xoip.vercel.app/ticket/${ticketToken}">
              Consultar ticket
            </a>
          </p>

          <p>
            Te mantendremos informado
            sobre cualquier novedad.
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