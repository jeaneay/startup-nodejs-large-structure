import { appEnv } from './config'
import Server from './server'
import { catchAllServerExceptions } from './utils/errors'

const PORT = Number(appEnv.config.port)
const server = new Server(PORT)
server.start()

catchAllServerExceptions(server)
