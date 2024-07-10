import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod';
import 'dayjs/locale/pt-br';
import { dayjs, prisma } from "../lib";
import { ClientError } from "../errors/client-error";


const schema = {
    params: z.object({
        participantId: z.string().uuid()
    })
}

export async function getParticipant(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().get('/participant/:participantId', { schema }, async (req) => {
        const { participantId } = req.params

        const participant = await prisma.participant.findUnique({
            select: {
                id: true,
                name: true,
                email: true,
                is_confirmed: true
            },
            where: {
                id: participantId
            }
        })

        if(!participant) throw new ClientError("Trip not found");

        

        
        

        return { participants: participant }
    })
}
