export {}
// // pages/api/webhooks/tgb.ts

// import type { NextApiRequest, NextApiResponse } from 'next'
// import prisma from '../../../lib/prisma'
// import crypto from 'crypto'
// // import winston from 'winston'
// import logger from '../../../lib/logger'

// // Define Webhook Event Types
// type WebhookEventType = 'DEPOSIT_TRANSACTION' | 'TRANSACTION_CONVERTED' | string

// // Define Payload Types
// type DepositTransactionPayload = {
//   type: string
//   id: string
//   status: string
//   timestampms: string
//   eid: string
//   transactionHash: string
//   currency: string
//   amount: number
//   organizationId: number
//   eventTimestamp: string
//   pledgeId: string
//   valueAtDonationTimeUSD: number
//   paymentMethod: string
//   payoutAmount: number | null
//   payoutCurrency: string
//   externalId: string
//   campaignId: string
// }

// type TransactionConvertedPayload = {
//   type: string
//   id: string
//   status: string
//   timestampms: string
//   eid: string
//   transactionHash: string
//   currency: string
//   amount: number
//   organizationId: number
//   eventTimestamp: number
//   convertedAt: string
//   netValueAmount: number
//   grossAmount: number
//   netValueCurrency: string
//   pledgeId: string
//   valueAtDonationTimeUSD: number
//   payoutAmount: number
//   payoutCurrency: string
//   externalId: string
//   campaignId: string
// }

// type DonationRefundPayload = {
//   type: string
//   id: string
//   status: string
//   timestampms: string
//   eid: string
//   refundHash: string
//   currency: string
//   amount: number
//   organizationId: number
//   eventTimestamp: string
//   pledgeId: string
//   reason: string
// }

// type DecryptedPayload =
//   | DepositTransactionPayload
//   | TransactionConvertedPayload
//   | DonationRefundPayload
//   | any

// type WebhookRequest = {
//   eventType: WebhookEventType
//   payload: string // Encrypted string
// }

// type SuccessResponse = {
//   message: string
// }

// type ErrorResponse = {
//   error: string
// }

// // Define a mapping of event types to handler functions
// const eventHandlers: Record<
//   WebhookEventType,
//   (eventType: WebhookEventType, payload: DecryptedPayload) => Promise<void>
// > = {
//   DEPOSIT_TRANSACTION: handleDepositTransaction,
//   TRANSACTION_CONVERTED: handleTransactionConverted,
//   DONATION_REFUND: handleDonationRefund, // Example of a new event type
//   // Add new event types and their handlers here
// }

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<SuccessResponse | ErrorResponse>
// ) {
//   if (req.method !== 'POST') {
//     res.setHeader('Allow', 'POST')
//     return res.status(405).json({ error: 'Method Not Allowed' })
//   }

//   const webhookRequest: WebhookRequest = req.body

//   try {
//     // Decrypt the payload
//     const decryptedPayload = decryptPayload(webhookRequest.payload)

//     // Validate eventTimestamp
//     let eventTimestampMs: number
//     if (webhookRequest.eventType === 'DEPOSIT_TRANSACTION') {
//       eventTimestampMs = Number(decryptedPayload.eventTimestamp)
//     } else if (webhookRequest.eventType === 'TRANSACTION_CONVERTED') {
//       eventTimestampMs = Number(decryptedPayload.eventTimestamp)
//     } else {
//       // For unknown event types, attempt to extract eventTimestamp if available
//       if (decryptedPayload.eventTimestamp) {
//         eventTimestampMs = Number(decryptedPayload.eventTimestamp)
//       } else {
//         logger.warn(
//           'Missing eventTimestamp for event type:',
//           webhookRequest.eventType
//         )
//         return res.status(400).json({ error: 'Missing eventTimestamp' })
//       }
//     }

//     const eventTimestamp = new Date(eventTimestampMs).getTime()
//     const currentTime = Date.now()
//     const oneHourInMs = 60 * 60 * 1000

//     if (currentTime - eventTimestamp > oneHourInMs) {
//       logger.warn('Received an outdated webhook event', {
//         eventType: webhookRequest.eventType,
//         eventTimestamp,
//       })
//       return res.status(400).json({ error: 'Outdated event' })
//     }

//     // Determine the handler function
//     const handlerFunction =
//       eventHandlers[webhookRequest.eventType] || handleUnknownEvent

//     // Process the event
//     await handlerFunction(webhookRequest.eventType, decryptedPayload)

//     return res.status(200).json({ message: 'Webhook processed successfully' })
//   } catch (error: any) {
//     logger.error('Error processing webhook:', {
//       message: error.message,
//       stack: error.stack,
//     })
//     return res.status(500).json({ error: 'Internal Server Error' })
//   }
// }

// // Utility function to decrypt payload
// function decryptPayload(encryptedHex: string): DecryptedPayload {
//   const algorithm = 'aes-256-cbc'
//   const key = Buffer.from(process.env.TGB_AES_KEY || '', 'hex') // 32 bytes for aes-256
//   const iv = Buffer.from(process.env.TGB_AES_IV || '', 'hex') // 16 bytes for aes-256-cbc

//   if (key.length !== 32 || iv.length !== 16) {
//     throw new Error('Invalid encryption key or IV length')
//   }

//   const encryptedData = Buffer.from(encryptedHex, 'hex')
//   const decipher = crypto.createDecipheriv(algorithm, key, iv)
//   let decrypted = decipher.update(encryptedData, undefined, 'utf8')
//   decrypted += decipher.final('utf8')
//   return JSON.parse(decrypted)
// }

// // Handler for DEPOSIT_TRANSACTION event
// async function handleDepositTransaction(
//   eventType: WebhookEventType,
//   payload: DepositTransactionPayload
// ) {
//   const { pledgeId, eid } = payload

//   if (!pledgeId || !eid) {
//     throw new Error('Missing pledgeId or eid in payload')
//   }

//   // Check if the event has already been processed (idempotency)
//   const existingEvent = await prisma.webhookEvent.findUnique({
//     where: { eid },
//   })

//   if (existingEvent) {
//     logger.info('Event already processed:', { eid })
//     return // Skip processing to prevent duplication
//   }

//   // Find the associated Donation
//   const donation = await prisma.donation.findUnique({
//     where: { pledgeId },
//   })

//   if (!donation) {
//     throw new Error(`Donation with pledgeId ${pledgeId} not found`)
//   }

//   // Update the Donation record
//   await prisma.donation.update({
//     where: { pledgeId },
//     data: {
//       transactionHash: payload.transactionHash,
//       payoutAmount: payload.payoutAmount,
//       payoutCurrency: payload.payoutCurrency,
//       externalId: payload.externalId,
//       campaignId: payload.campaignId,
//       valueAtDonationTimeUSD: payload.valueAtDonationTimeUSD,
//       currency: payload.currency,
//       amount: payload.amount,
//       status: payload.status,
//       timestampms: new Date(Number(payload.timestampms)),
//       eid: payload.eid,
//       paymentMethod: payload.paymentMethod,
//       eventData: {
//         ...donation.eventData,
//         DEPOSIT_TRANSACTION: { ...payload },
//       },
//       updatedAt: new Date(),
//     },
//   })

//   // Create a WebhookEvent record
//   await prisma.webhookEvent.create({
//     data: {
//       eventType: 'DEPOSIT_TRANSACTION',
//       payload: payload,
//       donationId: donation.id,
//       eid: payload.eid,
//       processed: true,
//     },
//   })

//   logger.info('Processed DEPOSIT_TRANSACTION event:', { eid, pledgeId })
// }

// // Handler for TRANSACTION_CONVERTED event
// async function handleTransactionConverted(
//   eventType: WebhookEventType,
//   payload: TransactionConvertedPayload
// ) {
//   const { pledgeId, eid } = payload

//   if (!pledgeId || !eid) {
//     throw new Error('Missing pledgeId or eid in payload')
//   }

//   // Check if the event has already been processed (idempotency)
//   const existingEvent = await prisma.webhookEvent.findUnique({
//     where: { eid },
//   })

//   if (existingEvent) {
//     logger.info('Event already processed:', { eid })
//     return // Skip processing to prevent duplication
//   }

//   // Find the associated Donation
//   const donation = await prisma.donation.findUnique({
//     where: { pledgeId },
//   })

//   if (!donation) {
//     throw new Error(`Donation with pledgeId ${pledgeId} not found`)
//   }

//   // Update the Donation record
//   await prisma.donation.update({
//     where: { pledgeId },
//     data: {
//       convertedAt: new Date(payload.convertedAt),
//       netValueAmount: payload.netValueAmount,
//       grossAmount: payload.grossAmount,
//       netValueCurrency: payload.netValueCurrency,
//       payoutAmount: payload.payoutAmount,
//       payoutCurrency: payload.payoutCurrency,
//       externalId: payload.externalId,
//       campaignId: payload.campaignId,
//       valueAtDonationTimeUSD: payload.valueAtDonationTimeUSD,
//       currency: payload.currency,
//       amount: payload.amount,
//       status: payload.status,
//       timestampms: new Date(Number(payload.timestampms)),
//       eid: payload.eid,
//       paymentMethod: payload.paymentMethod,
//       eventData: {
//         ...donation.eventData,
//         TRANSACTION_CONVERTED: payload,
//       },
//       updatedAt: new Date(),
//     },
//   })

//   // Create a WebhookEvent record
//   await prisma.webhookEvent.create({
//     data: {
//       eventType: 'TRANSACTION_CONVERTED',
//       payload: payload,
//       donationId: donation.id,
//       eid: payload.eid,
//       processed: true,
//     },
//   })

//   logger.info('Processed TRANSACTION_CONVERTED event:', { eid, pledgeId })
// }

// // Handler for DONATION_REFUND event
// async function handleDonationRefund(
//   eventType: WebhookEventType,
//   payload: DonationRefundPayload
// ) {
//   const { pledgeId, eid, refundHash, reason } = payload

//   if (!pledgeId || !eid) {
//     throw new Error('Missing pledgeId or eid in payload')
//   }

//   // Check if the event has already been processed (idempotency)
//   const existingEvent = await prisma.webhookEvent.findUnique({
//     where: { eid },
//   })

//   if (existingEvent) {
//     logger.info('Event already processed:', { eid })
//     return // Skip processing to prevent duplication
//   }

//   // Find the associated Donation
//   const donation = await prisma.donation.findUnique({
//     where: { pledgeId },
//   })

//   if (!donation) {
//     throw new Error(`Donation with pledgeId ${pledgeId} not found`)
//   }

//   // Update the Donation record with refund information
//   await prisma.donation.update({
//     where: { pledgeId },
//     data: {
//       refundHash: refundHash, // Ensure these fields exist in the schema
//       refundReason: reason, // Ensure these fields exist in the schema
//       eventData: {
//         ...donation.eventData,
//         DONATION_REFUND: payload,
//       },
//       updatedAt: new Date(),
//     },
//   })

//   // Create a WebhookEvent record
//   await prisma.webhookEvent.create({
//     data: {
//       eventType: 'DONATION_REFUND',
//       payload: payload,
//       donationId: donation.id,
//       eid: eid,
//       processed: true,
//     },
//   })

//   logger.info('Processed DONATION_REFUND event:', { eid, pledgeId })
// }

// // Handler for unknown or additional event types
// async function handleUnknownEvent(eventType: string, payload: any) {
//   const { pledgeId, eid } = payload

//   if (!pledgeId || !eid) {
//     throw new Error('Missing pledgeId or eid in payload for unknown event')
//   }

//   // Check if the event has already been processed (idempotency)
//   const existingEvent = await prisma.webhookEvent.findUnique({
//     where: { eid },
//   })

//   if (existingEvent) {
//     logger.info('Event already processed:', { eid })
//     return // Skip processing to prevent duplication
//   }

//   // Find the associated Donation
//   const donation = await prisma.donation.findUnique({
//     where: { pledgeId },
//   })

//   if (!donation) {
//     throw new Error(
//       `Donation with pledgeId ${pledgeId} not found for unknown event`
//     )
//   }

//   // Create a WebhookEvent record
//   await prisma.webhookEvent.create({
//     data: {
//       eventType: eventType,
//       payload: payload,
//       donationId: donation.id,
//       eid: eid,
//       processed: true,
//     },
//   })

//   // Optionally, update the Donation's eventData with the unknown event
//   await prisma.donation.update({
//     where: { pledgeId },
//     data: {
//       eventData: {
//         ...donation.eventData,
//         [eventType]: payload,
//       },
//       updatedAt: new Date(),
//     },
//   })

//   logger.info('Processed unknown event type:', { eventType, eid, pledgeId })
// }
