import {z} from 'zod'


export const acceptMessages = z.object({
   acceptingMessages: z.boolean(),
})