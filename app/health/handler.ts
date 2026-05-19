import { FastifyReply, FastifyRequest } from "fastify";

export const checkHealth = async (req: FastifyRequest, rep: FastifyReply) => {
  rep.send("OK");
};
