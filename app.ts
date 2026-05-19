import "dotenv/config";
import path from "path";
import Fastify, { FastifyServerOptions } from "fastify";
import cors from "@fastify/cors";
import auth from "@fastify/auth";
import FastifyEnv from "@fastify/env";
import autoload from "@fastify/autoload";
import fastifyRateLimit from "@fastify/rate-limit";
import fastifyHelmet from "@fastify/helmet";
import fastifyRawBody from "fastify-raw-body";
import fastifyEnvSchema from "./lib/env-schema";

declare module "fastify" {
    interface FastifyContextConfig {
        isPublicApi?: boolean;
    }

    interface FastifyInstance {
        config: {
            HOST: string;
            PORT: string;
        };
    }
}

const defaultLogger: FastifyServerOptions["logger"] = {
    transport:
        process.env.NODE_ENV !== "production"
            ? { target: "pino-pretty", options: { colorize: true } }
            : undefined,
    redact: { paths: ["*.password"] },
    serializers: {
        req: (req) => ({
            host: req.hostname,
            method: req.method,
            remoteAddress: req.ip,
            remotePort: req.socket.remotePort,
            url: req.url,
            endpoint: req.routeOptions?.url ?? req.url,
        }),
    },
};

export const buildApp = async (options: FastifyServerOptions = {}) => {
    const fastify = Fastify({
        childLoggerFactory(logger, bindings, childLoggerOpts, rawReq) {
            const origin = rawReq.headers.origin;
            return logger.child(
                { ...bindings, ...(origin ? { origin } : {}) },
                childLoggerOpts,
            );
        },
        logger: defaultLogger,
        requestIdHeader: "x-request-id",
        // Generates a fallback request ID if the header is absent
        genReqId: () => crypto.randomUUID(),
        ...options,
    });

    // 1. Security headers
    await fastify.register(fastifyHelmet, {
        contentSecurityPolicy: false,
    });

    // 2. Rate limiting
    await fastify.register(fastifyRateLimit, {
        max: 1000,
        timeWindow: "1 minute",
        logLevel: "error",
    });

    // 3. Env config - must come before anything that reads fastify.config
    await fastify.register(FastifyEnv, {
        schema: fastifyEnvSchema,
        dotenv: true,
    });

    // 4. CORS
    await fastify.register(cors, {
        origin: [
            "http://localhost:3000",
            ...(process.env.CLIENT_ORIGIN ? [process.env.CLIENT_ORIGIN] : []),
        ],
        methods: ["GET", "HEAD", "OPTIONS", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
    });

    // 5. Auth decorator (must be before routes that use it)
    await fastify.register(auth);

    // 6. Raw body (opt-in per route via config: { rawBody: true })
    await fastify.register(fastifyRawBody, {
        field: "rawBody",
        global: false,
        encoding: false, // Keep as Buffer
        runFirst: true,
    });

    // 7. Plugins (db, decorators, routes, etc.)
    await fastify.register(autoload, {
        dir: path.join(__dirname, "plugins"),
    });

    await fastify.ready();

    return fastify;
};
