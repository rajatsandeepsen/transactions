import type { AvailableActions } from "initiative";
// import { type State } from "@/initiative/state";
import type { CTX } from "~/server/api/root";
import z, { type input as Input, type infer as Infer } from "zod";
import { amountZod, numberZod, statusZod, transactionsZod } from "./validation";

const fileEnum = z.string();

const status = statusZod.merge(z.object({
  message: z.string().optional(),
}))

const text = z.object({
  text: z.string(),
});

export const UserState = {};

export type UserStateType = Infer<z.ZodObject<typeof UserState>>;
export type UserStateTypeRaw = Input<z.ZodObject<typeof UserState>>;

export type ExtraParams = {
  ctx: CTX;
  extra: object;
};

export const Schema = {
  createTransaction: z
    .function()
    .describe(
      "When user wants to create or initialize a transaction, to continue in execution order."
    )
    .args(
      z.object({
        name: z.string().min(1),
        number: numberZod,
        amount: amountZod,
      })
    )
    .returns(status),
  getTransactions: z
    .function()
    .describe(
      "When user wants get some transaction based on name or number of user or , to continue in execution order."
    )
    .args(
      z
        .object({
          name: z.string().min(1),
          number: numberZod,
        })
        .optional()
    )
    .returns(z.array(transactionsZod)),
  unavailableAction: z
    .function()
    .describe(
      "When user wants do some action that is not available above, just ignore everything else and return that action description."
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

export type AFC<K extends keyof RawAvailableActions> = React.FunctionComponent<{
  data: GetActionReturn<K>;
}>;

export type PermissionZod<S extends AvailableActions = typeof Schema> =
  z.ZodObject<{ [k in keyof S]: z.ZodBoolean }>;

export const permissionZod = z.object(
  Object.keys(Schema).reduce(
    // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
    (acc, key) => ({ ...acc, [key]: z.boolean() }),
    {}
  )
) as PermissionZod;

export const AllowALL: { [k in keyof RawAvailableActions]: true } = Object.keys(
  Schema
).reduce((acc, key) => ({ ...acc, [key]: true }), {}) as any;
