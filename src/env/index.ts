import { z } from "zod"

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
  PORT: z.coerce.number().default(3000),
})

const envParser = envSchema.safeParse(process.env)

if (!envParser.success) {
  const errorMessage = "Invalid environment variables"
  console.error(errorMessage, envParser.error.format())
  throw new Error(errorMessage)
}

export const env = envParser.data
