// lib/PrismaTransport.ts
import TransportStream, { TransportStreamOptions } from 'winston-transport'
import prisma from './prisma' // Your existing Prisma client setup

type PrismaTransportOptions = TransportStreamOptions

class PrismaTransport extends TransportStream {
  constructor(options: PrismaTransportOptions) {
    super(options)
  }

  async log(info: any, callback: () => void) {
    setImmediate(() => this.emit('logged', info))

    // Extract log details
    const { level, message, ...meta } = info

    try {
      // Store the log in the database
      await prisma.log.create({
        data: {
          level,
          message,
          meta: meta ? JSON.stringify(meta) : undefined, // Ensure meta is stored as JSON if present
          timestamp: new Date(), // Set the timestamp to now
        },
      })

      callback()
    } catch (error) {
      console.error('Error saving log to the database:', error)
      callback() // Call callback without arguments
    }
  }
}

export default PrismaTransport
