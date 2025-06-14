// lib/logger.ts
import { createLogger, format, transports } from 'winston'
import PrismaTransport from './PrismaTransport'

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json() // Use JSON format for better structured logs
  ),
  transports: [
    new transports.Console(), // Console transport for local debugging
    new PrismaTransport({ level: 'info' }), // Use your custom Prisma transport
  ],
})

export default logger
