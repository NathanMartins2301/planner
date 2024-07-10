import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod';
import { dayjs, getMailClient, prisma } from "../lib";
import nodemailer from 'nodemailer'
import { ClientError } from "../errors/client-error";
import { env } from "../env";


const schema = {
    params: z.object({
        tripId: z.string().uuid()
    }),
    body: z.object({
        email: z.string().email()
    })
}

export async function createInvite(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().post('/trips/:tripId/invite', { schema }, async (req) => {
        const { tripId } = req.params
        const { email } = req.body

        const trip = await prisma.trip.findUnique({
            where: {
                id: tripId
            }
        })

        if(!trip) throw new ClientError("Trip not found");
        

        const participant = await prisma.participant.create({
            data: {
                email,
                trip_id: tripId
            }
        })

        const formattedStartDate = dayjs(trip.starts_at).format('LL')
        const formattedEndDate = dayjs(trip.ends_at).format('LL')

  
        const mail = await getMailClient()

    
        const confirmationLink = `${env.WEB_BASE_URL}3/trips/${trip.id}/confirmation/${participant.id}`
        const message = await mail.sendMail({
            from: {
                name: 'Equipe Plann.er',
                address: 'oi@plann.er'
            },
            to: participant.email,
            subject: `Confirme sua presença na viagem para ${trip.destination}`,
            html: `
                <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
                <p>Você foi convidado(a) para uma viagem para <strong>${trip.destination}</strong> nas datas de <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}</strong>.</p>
                <p></p>
                <p>Para confirmar sua viagem, clique no link abaixo:</p>
                <p></p>
                <p>
                    <a href="${confirmationLink}">Confirmar viagem</a>
                </p>
                <p></p>
                <p>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
                </div>
            `.trim(),
        })

        console.log(nodemailer.getTestMessageUrl(message))
 

        return {participantId: participant.id}
    })
}
