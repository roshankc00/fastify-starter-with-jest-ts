import { FastifyInstance, FastifyPluginOptions } from "fastify";
import healthRoutes from "../app/health/route";
import { FastifyDone } from "../lib/types";

const routePlugin = (
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
  done: FastifyDone,
) => {
  fastify.register(healthRoutes, { prefix: "/api" });
  done();
};

export default routePlugin;
