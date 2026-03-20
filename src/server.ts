import process from "node:process"
import { createApp } from "./App.ts"

const app = await createApp()
const port = app.config.PORT

process.on('SIGINT', async () => {
  await app.close()
  process.exit(0)
})

await app.listen({ port: port })