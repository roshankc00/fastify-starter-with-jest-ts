import { buildApp } from "./app";

const start = async () => {
    try {
        const fastify = await buildApp();

        await fastify.listen({
            host: fastify.config.HOST,
            port: Number(fastify.config.PORT),
        });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();