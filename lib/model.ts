import { TogetherAI } from "@langchain/community/llms/togetherai";
import { and, desc, eq, ilike, or } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import {
	chainedActionPrompt,
	createExtraction,
	getZodChainedCombined,
	implementChain,
} from "~/initiative";
import type { CTX } from "~/server/api/root";
import { transactions, users } from "~/server/db/schema";
import { Schema, UserState } from "./schema";
import { numberZod, transactionsZod } from "./validation";
import { z } from "zod";
import { decrement, increment } from "~/server/db/util";

export const model = new TogetherAI({
	modelName: "meta-llama/Llama-3-8b-chat-hf",
	// modelName: "mistralai/Mixtral-8x7B-Instruct-v0.1",
	apiKey: process.env.API_KEY,
});

type FuncParam = {
	ctx: CTX;
	extra: object;
};

export const materials = getZodChainedCombined(Schema, UserState);
export const init = implementChain(Schema, UserState, materials, {
	functions: (_extra: FuncParam, state, rawState) => ({
		findSum: async ({ transactions }) => {
			const validated = z.array(transactionsZod).parse(transactions);
			const totalAmount = validated.reduce(
				(total, transaction) => total + transaction.amount,
				0,
			);
			return {
				amount: totalAmount,
			};
		},
		getBalance: async () => {
			if (!_extra.ctx.session) throw new Error("User not logged in");
			const data = await _extra.ctx.db.query.users.findFirst({
				columns: {
					amount: true,
				},
				where: eq(users.id, _extra.ctx.session.user.id),
			});

			return {
				amount: data?.amount ?? 0,
			};
		},
		changeUsersDetails: async ({ name, number }) => {
			if (!_extra.ctx.session) throw new Error("User not logged in");

			await _extra.ctx.db
				.update(users)
				.set({
					name,
					number,
				})
				.where(eq(users.id, _extra.ctx.session.user.id));

			return {
				status: "success",
				message: `Successfully changed your ${name ? `name to ${name}` : ""}${
					name && number ? " & " : ""
				}${number ? `number to ${number}` : ""}`,
			};
		},
		createTransaction: async ({ name, number, amount }) => {
			if (!_extra.ctx.session?.user) throw new Error("User not logged in");

			const fromNumber = numberZod.parse(
				_extra.ctx.session.user.number ?? 1882,
			);

			const id = await _extra.ctx.db.transaction(async (tx) => {
				await tx
					.update(users)
					.set({
						amount: increment(users.amount, amount),
					})
					.where(eq(users.number, number));

				await tx
					.update(users)
					.set({
						amount: decrement(users.amount, amount),
					})
					.where(eq(users.id, _extra.ctx.session?.user.id ?? ""));
				const id = uuid()

				await tx.insert(transactions).values({
					name: name,
					fromNumber,
					toNumber: number,
					amount: amount,
					id,
				})

				return id
			});

			return {
				status: "success",
				message: `Transaction created, ID:${id}`,
			};
		},
		getTransactions: async (data) => {
			if (!_extra.ctx.session) throw new Error("User not logged in");

			const fromNumber = numberZod.parse(
				_extra.ctx.session.user?.number ?? 1882,
			);
			if (
				!data ||
				(Object.keys(data).length === 0 && data.constructor === Object)
			) {
				const returnData = await _extra.ctx.db.query.transactions.findMany({
					where: or(
						eq(transactions.fromNumber, fromNumber),
						eq(transactions.toNumber, fromNumber),
					),
				});
				return {
					count: returnData.reduce(
						(total, transaction) => total + transaction.amount,
						0,
					),
					transactions: returnData,
				};
			}

			const { name, number } = data;

			if (number) {
				const returnData = await _extra.ctx.db
					.select()
					.from(transactions)
					.where(
						and(
							eq(transactions.toNumber, number),
							eq(transactions.toNumber, 1882),
						),
					)
					.orderBy(desc(transactions.createdAt));

				return {
					count: returnData.reduce(
						(total, transaction) => total + transaction.amount,
						0,
					),
					transactions: returnData,
				};
			}
			if (name) {
				const returnData = await _extra.ctx.db
					.select()
					.from(transactions)
					.where(
						and(
							ilike(transactions.name, `%${name}%`),
							eq(transactions.toNumber, 1882),
						),
					)
					.orderBy(desc(transactions.createdAt));
				return {
					count: returnData.reduce(
						(total, transaction) => total + transaction.amount,
						0,
					),
					transactions: returnData,
				};
			}
			throw new Error("Invalid input");
		},
		unavailableAction: ({ actionDescription }) => ({
			status: "failed",
			message: `Action '${actionDescription}' is not available`,
		}),
	}),
	examples: [
		{
			Input: "Sent 10 dollers to 12345",
			Output: [
				{
					createTransaction: {
						name: "unknown",
						number: 12345,
						amount: 10,
					},
				},
			],
		},
		{
			Input: "Get my entire transaction history",
			Output: [
				{
					getTransactions: {},
				},
			],
		},
		{
			Input: "Get transaction history with alex",
			Output: [
				{
					getTransactions: {
						name: "alex"
					},
				},
			],
		},
	],
});

export const chain = await createExtraction(
	model,
	init,
	materials,
	chainedActionPrompt,
);

// const res = await chain.invoke("Delete this file", {
//   state: {
//
//   },
// });
//
// console.log(JSON.stringify(res, null, 2));
//
// const x = await executeChainActions(Schema, UserState, init, res, {
//   permissions: AllowALL,
//   params: {
//     ctx: ,
//     extra: {},
//   },
// });
//
// console.log(x);
