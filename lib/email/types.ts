export interface SendEmailOptions {
  to: { email: string; name?: string }
  subject: string
  htmlContent: string
  textContent: string
}

export interface EmailSendResult {
  success: boolean
  messageId?: string
  error?: string
  isSimulated?: boolean
}

export interface SyncContactOptions {
  email: string
  firstName?: string
  listId?: number
}

export interface ContactSyncResult {
  success: boolean
  error?: string
  isSimulated?: boolean
}
