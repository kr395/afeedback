import {z} from 'zod'


export const acceptMessagesSchema = z.object({
   acceptingMessages: z.boolean(),
})