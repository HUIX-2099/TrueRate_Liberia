/**
 * Field-level encryption for sensitive government data.
 * Uses AES-256-GCM; key from GOV_ENCRYPTION_KEY (32-byte hex or base64).
 * Transport: ensure HTTPS (TLS) for all API traffic.
 */

import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto"

const ALGORITHM = "aes-256-gcm"
const IV_LENGTH = 12
const TAG_LENGTH = 16
const SALT_LENGTH = 16
const KEY_LENGTH = 32

function getEncryptionKey(): Buffer {
  const raw = process.env.GOV_ENCRYPTION_KEY
  if (!raw) {
    throw new Error("GOV_ENCRYPTION_KEY is not set; cannot encrypt/decrypt")
  }
  const buf = Buffer.from(raw, raw.length === 64 && /^[0-9a-fA-F]+$/.test(raw) ? "hex" : "base64")
  if (buf.length !== KEY_LENGTH) {
    const derived = scryptSync(raw, "gov-salt", KEY_LENGTH)
    return derived
  }
  return buf
}

/**
 * Encrypt a plaintext string. Returns base64: iv + ciphertext + authTag.
 */
export function encryptField(plaintext: string): string {
  const key = getEncryptionKey()
  const iv = randomBytes(IV_LENGTH)
  const cipher = createCipheriv(ALGORITHM, key, iv, { authTagLength: TAG_LENGTH })
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()])
  const tag = cipher.getAuthTag()
  return Buffer.concat([iv, enc, tag]).toString("base64")
}

/**
 * Decrypt a payload produced by encryptField.
 */
export function decryptField(ciphertext: string): string {
  const key = getEncryptionKey()
  const buf = Buffer.from(ciphertext, "base64")
  if (buf.length < IV_LENGTH + TAG_LENGTH) {
    throw new Error("Invalid ciphertext")
  }
  const iv = buf.subarray(0, IV_LENGTH)
  const tag = buf.subarray(buf.length - TAG_LENGTH)
  const data = buf.subarray(IV_LENGTH, buf.length - TAG_LENGTH)
  const decipher = createDecipheriv(ALGORITHM, key, iv, { authTagLength: TAG_LENGTH })
  decipher.setAuthTag(tag)
  return decipher.update(data) + decipher.final("utf8")
}

/**
 * Encrypt sensitive fields in an object (in-place). Keys listed in fieldKeys are stringified and encrypted.
 */
export function encryptSensitiveFields<T extends Record<string, unknown>>(
  obj: T,
  fieldKeys: string[]
): T {
  const out = { ...obj }
  for (const key of fieldKeys) {
    if (key in out && typeof (out as Record<string, unknown>)[key] === "string") {
      try {
        (out as Record<string, unknown>)[key] = encryptField((out as Record<string, unknown>)[key] as string)
      } catch {
        // skip if encryption key not set
      }
    }
  }
  return out
}

/**
 * Decrypt sensitive fields in an object (in-place).
 */
export function decryptSensitiveFields<T extends Record<string, unknown>>(
  obj: T,
  fieldKeys: string[]
): T {
  const out = { ...obj }
  for (const key of fieldKeys) {
    if (key in out && typeof (out as Record<string, unknown>)[key] === "string") {
      try {
        (out as Record<string, unknown>)[key] = decryptField((out as Record<string, unknown>)[key] as string)
      } catch {
        // leave as-is on error
      }
    }
  }
  return out
}

/** Check if encryption is configured. */
export function isEncryptionConfigured(): boolean {
  try {
    getEncryptionKey()
    return true
  } catch {
    return false
  }
}
