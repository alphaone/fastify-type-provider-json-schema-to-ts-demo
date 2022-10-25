import { FromSchema, JSONSchema } from "json-schema-to-ts";

const dogSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    age: { type: "integer" },
    hobbies: { type: "array", items: { type: "string" } },
    favoriteFood: { enum: ["pizza", "taco", "fries"] },
  },
  // required: ["name", "age"],
} as const;

type Dog = FromSchema<typeof dogSchema>;
// => Will infer the same type as above
