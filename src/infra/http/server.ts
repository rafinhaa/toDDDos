import { env } from "@/env"
import { app } from "@/infra/http/app"

const start = async () => {
  try {
    await app.listen({ port: env.PORT, host: "0.0.0.0" })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
