import type {
	AvailableActions,
	Execution,
	executeChainActions,
} from "~/initiative";
import type { State } from "~/initiative";
import type { CTX } from "~/server/api/root";
import z, { type input as Input, type infer as Infer } from "zod";
import {
	amountZod,
	numberZod,
	statusZod,
	transactionsZod,
	usersZod,
} from "./validation";

const status = statusZod.merge(
	z.object({
		message: z.string().optional(),
	}),
);

export const UserState = {
	userSelectedTransaction: z
		.object({
			id: z.string(),
			name: z.string(),
			amount: z.number(),
		})
		.transform(
			(x) =>
				`User selected a transaction ID:${x.id} with amount:${x.amount} on UI and its receiver is ${x.name}`,
		),
	userSelectedContact: z
		.object({
			name: z.string(),
			number: numberZod,
		})
		.transform(
			(x) =>
				`Use mensioned a contact with name:${x.name} and number:${x.number}`,
		),
} satisfies State;

export type UserStateType = Infer<z.ZodObject<typeof UserState>>;
export type UserStateTypeRaw = Input<z.ZodObject<typeof UserState>>;

export type ExtraParams = {
	ctx: CTX;
	extra: object;
};

export const Schema = {
	calculateMaths: z
		.function()
		.describe("When user want to sum/avg or minus/divide/percentage with a number, in his transaction history from previous execution, always set transactions:'unknown' if user want to 'sent that amount'")
		.args(
			z.object({
				operation: z.enum(["sum", "avg", "minus", "divide", "percentage"]),
				value: z.number().optional().describe("value is the number to perform operation with"),
				transactions: z.any().or(z.enum(["unknown"]))
			}),
		)
		.returns(
			usersZod.pick({
				amount: true,
			}),
		),
	getBalance: z
		.function()
		.describe("When user want to know his balance")
		.args(z.any())
		.returns(
			usersZod.pick({
				amount: true,
			}),
		),
	changeUsersDetails: z
		.function()
		.describe("When user want to alter any of his details")
		.args(
			usersZod
				.pick({
					name: true,
					number: true,
				})
				.partial(),
		)
		.returns(status),
	createTransaction: z
		.function()
		.describe(
			"When user wants to create or initialize a transaction, to continue in execution order. Set amount:'unknown', if user dont specify numberical amount while creating transaction. Also never set amount:0",
		)
		.args(
			z.object({
				name: z.string().optional(),
				number: numberZod.optional(),
				amount: amountZod.or(z.enum(["unknown"])),
			}),
		)
		.returns(status),
	getTransactions: z
		.function()
		.describe(
			"When user wants get all transactions history, specify name or number to filter, specify empty object '{}' as parameter to get all transactions to continue in execution order.",
		)
		.args(
			z
				.object({
					name: z.string().min(1).optional(),
					number: numberZod.optional()
				}).optional(),
		)
		.returns(
			z.object({
				count: z.number(),
				transactions: z.array(transactionsZod)
			}),
		),
	unavailableAction: z
		.function()
		.describe(
			"When user wants do some action that is not available above, just ignore everything else and return that action description.",
		)
		.args(z.object({ actionDescription: z.string() }))
		.returns(status),
} satisfies AvailableActions;

export const AvailableActionsZod = z.object(Schema);

export const GetZodParam = <K extends keyof RawAvailableActions>(key: K) => {
	return Schema[key]?._def.args.items[0];
};

export const GetZodReturn = <K extends keyof RawAvailableActions>(key: K) => {
	return Schema[key]._def.returns;
};
// : Parameters<Infer<RawAvailableActions[K]>>
export type RawAvailableActions = typeof Schema;
export type RawAvailableActionsKeys = keyof typeof Schema;

export type GetActionParam<K extends keyof RawAvailableActions> = Parameters<
	Infer<RawAvailableActions[K]>
>[0];
export type GetActionReturn<K extends keyof RawAvailableActions> = ReturnType<
	Infer<RawAvailableActions[K]>
>;

type RunTime = {
	State: typeof UserState;
	Schema: RawAvailableActions;
};

export type AFC<K extends keyof RawAvailableActions> = React.FunctionComponent<{
	data: {
		value: GetActionParam<K>;
		result: GetActionReturn<K>;
		error: Error;
	} & Execution<typeof UserState, RawAvailableActions, ExtraParams>;
}>;

export type PermissionZod<S extends AvailableActions = typeof Schema> =
	z.ZodObject<{ [k in keyof S]: z.ZodBoolean }>;

export type Permissions<S extends AvailableActions = typeof Schema> = {
	[k in keyof S]: boolean;
};

export const permissionZod = z.object(
	Object.keys(Schema).reduce(
		// biome-ignore lint/performance/noAccumulatingSpread: <explanation>
		(acc, key) => ({ ...acc, [key]: z.boolean() }),
		{},
	),
) as PermissionZod;

export const AllowALL: { [k in keyof RawAvailableActions]: true } = Object.keys(
	Schema,
	// biome-ignore lint/performance/noAccumulatingSpread: <explanation>
).reduce((acc, key) => ({ ...acc, [key]: true }), {});
