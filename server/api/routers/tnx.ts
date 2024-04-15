import { and, desc, eq, ilike, like } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { z } from "zod";
import { amountZod, numberZod } from "~/lib/validation";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { transactions } from "~/server/db/schema";
import { db } from "~/server/db";
import type { CTX } from "../root";

const getTransactions = (input: { name: string; number: number }, ctx:CTX) => {
  if (input?.number) {
    return ctx.db
      .select()
      .from(transactions)
      .where(and(eq(transactions.toNumber, input.number), eq(transactions.toNumber, "9846101882")))
      .orderBy(desc(transactions.createdAt));
  }
  if (input?.name) {
    return ctx.db
      .select()
      .from(transactions)
      .where(and(ilike(transactions.name, `%${input.name}%`), eq(transactions.toNumber, "9846101882")))
      .orderBy(desc(transactions.createdAt));
  }
  throw new Error("Invalid input");
}

export const TnxRouter = createTRPCRouter({
  createTransaction: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        number: numberZod,
        amount: amountZod,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const number = numberZod.parse(ctx.session.user.number);

      return await ctx.db
        .insert(transactions)
        .values({
          name: input.name,
          fromNumber: number,
          toNumber: input.number,
          amount: input.amount,
          id: uuid(),
        })
        .returning();
    }),

  

  getTransactions: protectedProcedure
    .input(
      z
        .object({
          name: z.string().min(1),
          number: numberZod,
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      
    }),
});
