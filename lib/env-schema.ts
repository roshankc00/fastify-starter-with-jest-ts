const fastifyEnvSchema = {
  type: "object",
  required: ["PORT"],
  properties: {
    HOST: {
      type: "string",
      default: "0.0.0.0",
    },
    PORT: {
      type: "string",
      default: 8000,
    },
  },
};

export default fastifyEnvSchema;
