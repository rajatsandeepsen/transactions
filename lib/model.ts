import { TogetherAI } from "@langchain/community/llms/togetherai";
import { createExtraction, chainedActionPrompt } from "initiative";
import {
  type ExtraParams,
  Schema,
  UserState,
  AllowALL,
  UserStateType,
} from "./schema";
import {
  executeChainActions,
  getZodChainedCombined,
  implementChain,
} from "initiative";
import {
  ZodObject,
  infer as Infer,
  ZodSchema,
  ZodOptional,
  ZodTransformer,
  z,
} from "zod";
import { api } from "~/trpc/server";

export const model = new TogetherAI({
  modelName: "mistralai/Mixtral-8x7B-Instruct-v0.1",
  apiKey: process.env.API_KEY,
});

export const materials = getZodChainedCombined(Schema, UserState);
export const init = implementChain(Schema, UserState, materials, {
  functions: (_extra, state, rawState) => ({
    createTransaction: async ({ name, number, amount }) => {
      const data = await api.tnx.createTransaction({
        name,
        number,
        amount,
      })

      return data;
    },
    getTransactions: async (prop) => {
      const data = await api.tnx.getTransactions(prop);
      return data
    },
    unavailableAction: ({ actionDescription }) => ({
      status: "failed",
      message: `Action '${actionDescription}' is not available`,
    }),
  }),
  examples: [
    {
      Input: "Sent 10 dollers to 1234567890",
      Output: [
        {
          createTransaction: {
            name: "unknown",
            number: "1234567890",
            amount: 10,
          },
        },
      ],
    },
  ],
});

export const chain = await createExtraction(
  Schema,
  UserState,
  model,
  init,
  {
    combinedZod: materials.combinedZod,
    stateZod: materials.stateZod,
  },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  chainedActionPrompt
);

const res = await chain.invoke("Delete this file", {
  state: {
    selected_A_File: "file.md",
  },
});

console.log(JSON.stringify(res, null, 2));

const x = await executeChainActions(Schema, UserState, init, res, {
  permissions: AllowALL,
  params: {
    ctx: null,
    extra: {},
  },
});

console.log(x);
