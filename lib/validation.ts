import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { statusEnum, transactions, users } from '~/server/db/schema';

export const transactionsZod = createSelectSchema(transactions);
export const usersZod = createSelectSchema(users);

export const statusZod = transactionsZod.pick({
    status: true
})

// export const numberZod = z.number().int().min(999999999).max(9999999999);
export const numberZod = z.number()//.or(z.string()).transform(e => typeof e === "string" ? Number.parseInt(e) : e);
export const amountZod = z.number().positive().min(1);