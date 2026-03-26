import { createApp } from "./app.js"

try{
const app = await createApp()
const port = app.config.PORT

process.on('SIGINT', async () => {
  await app.close()
  process.exit(0)
})

  await app.listen({ port: port })
}catch(error){
  process.exit(1)
}