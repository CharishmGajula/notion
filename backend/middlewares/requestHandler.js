const { z } = require("zod");

const registerSchema = z.object({
  token: z.string().min(10, "Token is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

const createSchema = z.object({
  title: z.string().trim().max(50),
  parentPageId: z.string().trim().optional(),
});

module.exports = { registerSchema, createSchema };
