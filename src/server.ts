import { exit } from "process";
import Fastify from "fastify";
import fastifySwagger from "@fastify/swagger";

import { plugin, someRoutes } from "./routes";

async function startServer() {
  const fastify = Fastify({
    logger: true,
  });
  await fastify.register(fastifySwagger, {
    openapi: {
      info: { title: "demo", version: "1.0.0" },
      security: [{ bearerAuth: [] }],
      components: {
        securitySchemes: {
          bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
        },
      },
    },
  });
  fastify.get(`/api-docs`, { schema: { hide: true } }, () => fastify.swagger());
  await fastify.register(plugin);
  await fastify.register(someRoutes);
  await fastify.listen({ port: 3000 });
}

startServer().catch((e) => {
  console.error(e, "Could not start server");
  exit(-1);
});
