import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod';
import { dayjs, prisma } from "../lib";
import { ClientError } from "../errors/client-error";

const schema = {
    params: z.object({
        tripId: z.string().uuid()
    }),
    body: z.object({
        title: z.string().min(4),
        occurs_at: z.coerce.date(),
    })
}

export async function createActivity(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().post('/trips/:tripId/activities', { schema }, async (req) => {
        const { tripId } = req.params
        const { title, occurs_at } = req.body

        const trip = await prisma.trip.findUnique({
            where: {
                id: tripId
            }
        })

        if(!trip) throw new ClientError("Trip not found");
        
        if(dayjs(occurs_at).isBefore(trip.starts_at)) throw new ClientError("Invalid activity data");

        const activity = await prisma.activity.create({
            data: {
                title,
                occurs_at,
                trip_id: tripId
            }
        })

        return {activityId: activity.id}
    })
}
