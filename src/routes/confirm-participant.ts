import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'
import 'dayjs/locale/pt-br'
import { prisma } from "../lib";
import { ClientError } from "../errors/client-error";
import { env } from "../env";

const schema = {
    params: z.object({
       participantId: z.string().uuid()
    })
}

export async function confirmParticipant(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().get('/participants/:participantId/confirmation', { schema }, async (req, reply) => {
        const { participantId } = req.params

        const participant = await prisma.participant.findUnique({
            where:{
                id: participantId
            }
        })

        if(!participant) throw new ClientError("Parcipant not found");

        if(participant.is_confirmed) return reply.redirect(`${env.WEB_BASE_URL}/trips/${participant.trip_id}`)

        await prisma.participant.update({
            where: { id: participantId},
            data: {
                is_confirmed: true
            }
        })

        return reply.redirect(`${env.WEB_BASE_URL}/trips/${participant.trip_id}`)
        
        
    })
}
