import { FastifyInstance } from "fastify";
import { checkHealth } from "./handler";
import { healthCheckSchema } from "./schemas";

async function healthRoutes(fastify: FastifyInstance) {
  fastify.route({
    method: "GET",
    url: "/",
    handler: checkHealth,
    schema: {
      description: healthCheckSchema.description,
      response: {
        200: { type: "string" },
      },
    },
  });
}

export default healthRoutes;
