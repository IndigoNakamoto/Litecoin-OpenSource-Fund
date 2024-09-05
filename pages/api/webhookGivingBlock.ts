// pages/api/webhook.js

import crypto from 'crypto'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { eventType, payload } = req.body

      // Decrypt the payload
      const decryptedPayload = decryptPayload(payload)

      // Process the payload based on eventType
      switch (eventType) {
        case 'DEPOSIT_TRANSACTION':
          // Handle deposit transaction
          console.log('Deposit transaction:', decryptedPayload)
          await handleDepositTransaction(decryptedPayload)
          break
        case 'TRANSACTION_CONVERTED':
          // Handle transaction converted
          console.log('Transaction converted:', decryptedPayload)
          await handleTransactionConverted(decryptedPayload)
          break
        case 'MERCHANT_STATUS_EVENT':
          // Handle merchant status event
          console.log('Merchant status event:', decryptedPayload)
          await handleMerchantStatusEvent(decryptedPayload)
          break
        default:
          console.warn('Unknown event type:', eventType)
      }

      res.status(200).json({ status: 'success' })
    } catch (error) {
      console.error('Error handling webhook:', error)
      res.status(500).json({ status: 'error', message: error.message })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

const dataEncryptionKey = Buffer.from(
  'ae97bfa25b4abcbb7d8722fc5c60747bf7687ec22d1463174f0176ad6daa96ec',
  'hex'
)
const dataEncryptionKeyIV = Buffer.from(
  '9663f5821170b172c51ecdd86677132f',
  'hex'
)

function decryptPayload(encryptedPayloadHex) {
  const encryptedBuffer = Buffer.from(encryptedPayloadHex, 'hex')
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    dataEncryptionKey,
    dataEncryptionKeyIV
  )
  const decrypted = decipher.update(encryptedBuffer)
  return JSON.parse(Buffer.concat([decrypted, decipher.final()]).toString())
}

// Example handlers for each event type
async function handleDepositTransaction(payload) {
  // Logic to update your PostgreSQL database with the deposit details
}

async function handleTransactionConverted(payload) {
  // Logic to update your PostgreSQL database with the conversion details
}

async function handleMerchantStatusEvent(payload) {
  // Logic to handle merchant status events
}
