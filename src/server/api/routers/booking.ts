import { z } from "zod";
import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure
} from "~/server/api/trpc";

export const bookingRouter = createTRPCRouter({
    getRooms: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.room.findMany();
    }),
    getRoomBookings: publicProcedure
        .input(z.object({ roomId: z.string().nullish() }).nullish())
        .query(({ ctx, input }) => {
            return input?.roomId ? (ctx.prisma.booking.findMany({
                where: {
                    roomId: input?.roomId,
                    startTime: {gte: new Date()},
                }
            })) : (null);
        }),
    createBooking: publicProcedure
        .input(z.object({ roomId: z.string(), startTime: z.date(), endTime: z.date(), userId: z.string() }))
        .mutation(({ ctx, input }) => {
            return ctx.prisma.booking.create({
                data: {
                    roomId: input.roomId,
                    startTime: input.startTime,
                    endTime: input.endTime, 
                    userId: input.userId
                }
            })
        }),
})