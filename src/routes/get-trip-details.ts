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

export async function getTripDetais(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().get('/trips/:tripId/details', { schema }, async (req) => {
        const { tripId } = req.params

        const trip = await prisma.trip.findUnique({
            select: {
                id: true,
                destination: true,
                starts_at: true,
                ends_at: true,
                is_confirmed: true
            },
            where: {
                id: tripId
            }
        })

        if(!trip) throw new ClientError("Trip not found");

        return { trip: trip }
    })
}
