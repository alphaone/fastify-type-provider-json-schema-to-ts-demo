# Demo for fastify-type-provider-json-schema-to-ts

This is using fastify and
[fastify-type-provider-json-schema-to-ts](https://github.com/fastify/fastify-type-provider-json-schema-to-ts).
It illustrates the problems with infering the Typescript types from the
provided JSON schemas.

## Types are not correctly inferred :\

despite using the example from https://github.com/fastify/fastify-type-provider-json-schema-to-ts#plugin-definition
I get no types inferred from the schema:

```Typescript
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
      } as const,
    },
    (req) => {
      // Property 'x' does not exist on type 'unknown'.ts(2339)
      const { x } = req.body;
      // Type 'string | string[] | undefined' is not assignable to type 'number'.
      // Type 'undefined' is not assignable to type 'number'.
      const baz: number = req.headers.baz;

      return { ok: true };
    }
  );
};
```

Defining the route like this also does not bring any difference:

```Typescript
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
      } as const,
    },
    (req) => {
      // Property 'bar' does not exist on type 'unknown'
      const { bar } = req.query;

      // Type 'string | string[] | undefined' is not assignable to type 'number'.
      // Type 'undefined' is not assignable to type 'number'.
      const x: number = req.headers.baz;

      return { ok: true };
    }
  );
}
```

## Routes and route validation works as expected

```bash
curl -X POST -H "baz:123" -H "Content-Type:application/json" "http://localhost:3000/test" -d '{"x": "abc"}'
{"statusCode":400,"error":"Bad Request","message":"body must have required property 'y'"}%
```

```bash
curl -X POST -H "baz:123" -H "Content-Type:application/json" "http://localhost:3000/test" -d '{"x": "abc", "y": 123, "z": true}'
{"ok":true}%
```

```bash
curl "http://localhost:3000/test2"
{"statusCode":400,"error":"Bad Request","message":"querystring must have required property 'foo'"}
```

```bash
curl -H "baz:123" "http://localhost:3000/test2?foo=123&bar=abc"
{"ok":true}%
```

## Swagger API generation works as expected

```bash
curl "http://localhost:3000/api-docs"
```
# fastify-type-provider-json-schema-to-ts-demo
