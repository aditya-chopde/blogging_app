import fs from 'fs'
import path from 'path'
import {
  createOrUpdateSubscriber,
  getAllSubscribers,
  getSubscriberByEmail,
  getSubscriberByDownloadToken,
  recordDownload,
  unsubscribeByToken,
  isValidEmail,
  normalizeEmail,
} from '../lib/subscribers.ts'
import { checkRateLimit } from '../lib/rateLimit.ts'
import { sendEbookDeliveryEmail } from '../lib/email/index.ts'

console.log('====================================================')
console.log('🧪 RUNNING LEAD MAGNET & SUBSCRIBER TEST SUITE')
console.log('====================================================\n')

let passedTests = 0
let failedTests = 0

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`)
    passedTests++
  } else {
    console.error(`❌ FAIL: ${message}`)
    failedTests++
  }
}

// 1. Validation tests
console.log('--- 1. Email Validation Tests ---')
assert(isValidEmail('test@example.com'), 'Valid email format recognized')
assert(isValidEmail('sarah.connor+healthy@domain.co.uk'), 'Complex valid email recognized')
assert(!isValidEmail(''), 'Empty email rejected')
assert(!isValidEmail('plainaddress'), 'Plain string rejected')
assert(!isValidEmail('@missinguser.com'), 'Missing user part rejected')
assert(!isValidEmail('user@.com'), 'Missing domain name rejected')
assert(!isValidEmail('a'.repeat(250) + '@example.com'), 'Excessively long email rejected')

// 2. Normalization test
console.log('\n--- 2. Email Normalization ---')
assert(normalizeEmail('  Sarah.Connor@EXAMPLE.COM ') === 'sarah.connor@example.com', 'Normalized email to lowercase and trimmed')

// 3. Rate Limiting Tests
console.log('\n--- 3. Rate Limiting ---')
const testIp = 'test-client-ip-123'
let rateLimitHit = false
for (let i = 0; i < 6; i++) {
  const result = checkRateLimit(testIp, 5, 60000)
  if (!result.success) {
    rateLimitHit = true
    break
  }
}
assert(rateLimitHit, 'Rate limiter activates when limit is exceeded')

// 4. Subscriber creation and storage without marketing consent
console.log('\n--- 4. Subscriber Persistence (Ebook Only) ---')
const emailNoConsent = `user-noconsent-${Date.now()}@example.com`
const resNoConsent = createOrUpdateSubscriber({
  email: emailNoConsent,
  firstName: 'No Consent User',
  marketingConsent: false,
  source: 'pinterest',
})

assert(resNoConsent.isNew === true, 'New subscriber successfully marked as isNew')
assert(resNoConsent.subscriber.email === emailNoConsent, 'Subscriber email matches normalized input')
assert(resNoConsent.subscriber.marketingConsent === false, 'Marketing consent is accurately false')
assert(resNoConsent.subscriber.consentTimestamp === null, 'Consent timestamp is null when no consent given')
assert(resNoConsent.subscriber.source === 'pinterest', 'Source properly attributed')
assert(Boolean(resNoConsent.subscriber.downloadToken), 'Download token generated')
assert(Boolean(resNoConsent.subscriber.unsubscribeToken), 'Unsubscribe token generated')

// 5. Subscriber creation with marketing consent
console.log('\n--- 5. Subscriber Persistence (With Marketing Consent) ---')
const emailConsent = `user-consented-${Date.now()}@example.com`
const resConsent = createOrUpdateSubscriber({
  email: emailConsent,
  firstName: 'Consented User',
  marketingConsent: true,
  source: 'website',
})

assert(resConsent.subscriber.marketingConsent === true, 'Marketing consent recorded as true')
assert(resConsent.subscriber.consentTimestamp !== null, 'Marketing consent timestamp recorded')

// 6. Duplicate Submission & Idempotency Test
console.log('\n--- 6. Duplicate Submission & Idempotency ---')
const resDuplicate = createOrUpdateSubscriber({
  email: emailConsent,
  firstName: 'Updated Consented Name',
  marketingConsent: true,
  source: 'website',
})

assert(resDuplicate.isNew === false, 'Existing subscriber recognized on duplicate submission (isNew = false)')
const allSubscribers = getAllSubscribers()
const countOfEmail = allSubscribers.filter((s) => s.email === emailConsent).length
assert(countOfEmail === 1, 'No duplicate records created in subscribers database')

// 7. Download Token Verification & Usage Tracking
console.log('\n--- 7. Download Token Verification & Usage Tracking ---')
const currentToken = resDuplicate.subscriber.downloadToken
const foundSub = getSubscriberByDownloadToken(currentToken)
assert(foundSub !== null, 'Subscriber found via secure download token')

const downloadRecorded = recordDownload(currentToken)
assert(downloadRecorded === true, 'Download recorded successfully')

const updatedSub = getSubscriberByEmail(emailConsent)
assert(updatedSub.downloadCount === 1, 'Download count incremented to 1')

// 8. Unsubscribe Token Test
console.log('\n--- 8. Unsubscribe Handling ---')
const unsubResult = unsubscribeByToken(resConsent.subscriber.unsubscribeToken)
assert(unsubResult.success === true, 'Unsubscribe by token succeeded')

const afterUnsub = getSubscriberByEmail(emailConsent)
assert(afterUnsub.marketingConsent === false, 'Marketing consent revoked upon unsubscribe')
assert(afterUnsub.unsubscribedAt !== null, 'Unsubscribed timestamp recorded')

// 9. Built-in Email Dispatch with PDF Attachment Test
console.log('\n--- 9. Built-in Email Dispatch with PDF Attachment ---')
const emailResult = await sendEbookDeliveryEmail({
  subscriber: resNoConsent.subscriber,
  siteUrl: 'http://localhost:3000',
})
assert(emailResult.success === true, 'Built-in ebook delivery email succeeded')
assert(Boolean(emailResult.messageId), 'Email message ID assigned')

const outboxPath = path.join(process.cwd(), 'data', 'email_outbox.json')
assert(fs.existsSync(outboxPath), 'Internal email outbox log exists')
if (fs.existsSync(outboxPath)) {
  const outbox = JSON.parse(fs.readFileSync(outboxPath, 'utf-8'))
  const recent = outbox.find((m) => m.to === resNoConsent.subscriber.email)
  assert(recent !== undefined, 'Outbox contains dispatched email record')
  assert(recent?.pdfAttached === true, 'Outbox verifies PDF ebook was attached')
}

// 10. PDF File Integrity
console.log('\n--- 10. PDF Ebook File Integrity ---')
const pdfPath = path.join(process.cwd(), 'data', 'ebooks', '10-healthy-high-protein-recipes.pdf')
const pdfExists = fs.existsSync(pdfPath)
assert(pdfExists, '10 Healthy High-Protein Recipes PDF exists in data/ebooks/')
if (pdfExists) {
  const stat = fs.statSync(pdfPath)
  assert(stat.size > 10000, `PDF has valid size (${stat.size} bytes)`)
}

console.log('\n====================================================')
console.log(`SUMMARY: ${passedTests} passed, ${failedTests} failed`)
console.log('====================================================')

if (failedTests > 0) {
  process.exit(1)
}
