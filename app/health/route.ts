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

  // For ClickFunnels webhook to work properly
  fastify.route({
    method: "POST",
    url: "/funnel_webhooks/test",
    handler: (_, res) => res.status(200).send("ok"),
    schema: {},
  });
}

export default healthRoutes;
