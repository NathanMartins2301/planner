import fastify from "fastify";
import { createTrip, confirmTrip, confirmParticipant, createActivity, getActivity, createLink, getLink, getParticipants, createInvite, updateTrip, getTripDetais, getParticipant } from "./routes";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import cors from "@fastify/cors"
import { errorHandler } from "./error-handler";
import { env } from "./env";

const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.setErrorHandler(errorHandler)

app.register(cors, {
    origin: '*'
})
app.register(createTrip)
app.register(confirmTrip)
app.register(confirmParticipant)
app.register(createActivity)
app.register(getActivity)
app.register(createLink)
app.register(getLink)
app.register(getParticipants)
app.register(createInvite)
app.register(updateTrip)
app.register(getTripDetais)
app.register(getParticipant)

app.listen({port: env.PORT}).then(() => {
    console.log('Server running!')
})