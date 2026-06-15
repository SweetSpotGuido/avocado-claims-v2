import { Resend } from 'resend'

const resend = new Resend(
    process.env.RESEND_API_KEY
)

export async function POST(
    req: Request
) {
    try {
        const body = await req.json()

        const {
            email,
            customerName,
            ticketId,
            ticketToken,
        } = body

        console.log(
            'RESEND KEY:',
            process.env.RESEND_API_KEY
        )

        const result = await resend.emails.send({
            from:
                'Soporte Avocado <soporte@avocadotechshop.com>',
            to: email,
            subject:
                `Ticket #${ticketId} recibido`,
            html: `
        <h2>Hola ${customerName}</h2>

        <p>
          Hemos recibido tu reclamo correctamente.
        </p>

        <p>
          <strong>Ticket #${ticketId}</strong>
        </p>

        <p>
  Puedes seguir tu caso desde el siguiente enlace:
</p>

<p>
  <a href="https://avocado-claims-v2-xoip.vercel.app/ticket/${ticketToken}">
    🔎 Ver mi caso
  </a>
</p>

        <p>
          Gracias por contactarte con
          Avocado Support.
        </p>
      `,
        })

        console.log(result)

        return Response.json(result)
    } catch (error) {
        return Response.json(
            { error },
            { status: 500 }
        )
    }
}