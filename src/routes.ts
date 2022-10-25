import {
  FastifyPluginAsyncJsonSchemaToTs,
  JsonSchemaToTsProvider,
} from "@fastify/type-provider-json-schema-to-ts";
import { FastifyInstance } from "fastify";

export const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify,
  _opts
) => {
  fastify.post(
    "/test",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            x: { type: "string" },
            y: { type: "number" },
            z: { type: "boolean" },
          },
          required: ["x", "y", "z"],
        },
        headers: {
          type: "object",
          properties: {
            baz: { type: "number" },
          },
          required: ["baz"],
        },
        response: {
          200: {
            type: "object",
            properties: {
              ok: { type: "boolean" },
            },
          },
        },
      } as const,
    },
    (req) => {
      // x: string
      const { x } = req.body;
      // baz: number
      const baz = req.headers.baz;

      return { ok: true };
    }
  );
};

export async function someRoutes(fastify: FastifyInstance) {
  fastify.withTypeProvider<JsonSchemaToTsProvider>().get(
    "/test2",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            foo: { type: "number" },
            bar: { type: "string" },
          },
          required: ["foo", "bar"],
        },
        headers: {
          type: "object",
          properties: {
            baz: { type: "number" },
          },
          required: ["baz"],
        },
        response: {
          200: {
            type: "object",
            properties: {
              ok: { type: "boolean" },
            },
          },
        },
      } as const,
    },
    (req) => {
      // bar: string
      const { bar } = req.query;

      // baz: number
      const baz = req.headers.baz;

      return { ok: true };
    }
  );
}
