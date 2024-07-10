import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod';
import 'dayjs/locale/pt-br';
import { dayjs, prisma } from "../lib";
import { ClientError } from "../errors/client-error";


const schema = {
    params: z.object({
        tripId: z.string().uuid()
    })
}

export async function getLink(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().get('/trips/:tripId/links', { schema }, async (req) => {
        const { tripId } = req.params

        const trip = await prisma.trip.findUnique({
            where: {
                id: tripId
            },
            include: {
                links: true
            }
        })

        if(!trip) throw new ClientError("Trip not found");

        return { links: trip.links }
    })
}
