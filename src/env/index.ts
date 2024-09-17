import { config } from "dotenv"
import { z } from "zod"

config({ path: ".env" })

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string(),
})

const envParser = envSchema.safeParse(process.env)

if (!envParser.success) {
  const errorMessage = "Invalid environment variables"
  console.error(errorMessage, envParser.error.format())
  throw new Error(errorMessage)
}

export const env = envParser.data
