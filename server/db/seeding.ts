import { v4 } from "uuid";
import { db } from "./";
import { faker } from "@faker-js/faker";
import * as schema from "./schema";

const getNumber = () => 
  faker.number.int({
    min: 999,
    max: 9999,
  }).toString();

const getRandom = <T>(array:T[]) => array[Math.floor(Math.random() * array.length)]

console.log("Seed start");

(async () => {
  const userData: (typeof schema.users.$inferInsert)[] = [
    {
      id: v4(),
      name: "Rajat Sandeep",
      email: "rajatsandeepsen@gmail.com",
      number: "1882"
    }
  ];
  const transactionData: (typeof schema.transactions.$inferInsert)[] = [];

  for (let i = 0; i < 20; i++) {
    userData.push({
      id: v4(),
      name: faker.internet.displayName(),
      email: faker.internet.email(),
      number: getNumber(),
    });
  }

  for (let i = 0; i < 20; i++) {
    const userInstance = getRandom(userData)
    transactionData.push({
      id: v4(),
      fromNumber: getRandom(userData)?.number,
      toNumber: userInstance?.number,
      amount: faker.number.int({ min: 1, max: 10000 }),
      name: userInstance?.name,
    });
  }

  console.log(userData, transactionData)

  console.log("Seed start");
  await db.transaction(async (trx) => {
      await trx.insert(schema.users).values(userData);
      await trx.insert(schema.transactions).values(transactionData);
    })
  console.log("Seed done");
})();
