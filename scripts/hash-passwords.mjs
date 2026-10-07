#!/usr/bin/env node
// Offline helper: derives the two values you paste into Apps Script
// Script Properties (ADMIN_HASH_1 / ADMIN_HASH_2).
// Run:  ADMIN_SECURITY_SECRET=<same value as Vercel> node scripts/hash-passwords.mjs
// Passwords are typed hidden, never written to disk, and not sent anywhere.
import crypto from 'crypto'
import readline from 'readline'

const secret = process.env.ADMIN_SECURITY_SECRET || ''
if (secret.length < 32) { console.error('Set ADMIN_SECURITY_SECRET (>= 32 chars) in this shell first.'); process.exit(1) }
const sub = l => crypto.createHmac('sha256', secret).update(l).digest()
const hash = (pw, w) => crypto.scryptSync(pw.normalize('NFKC'), sub('pw-salt:' + w), 32, { N: 16384, r: 8, p: 1 }).toString('hex')

function ask(q) {
  return new Promise(res => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true })
    rl._writeToOutput = s => { if (s.includes(q)) rl.output.write(s) }
    rl.question(q, a => { rl.close(); process.stdout.write('\n'); res(a) })
  })
}
const p1 = await ask('Password 1 (min 12 chars): ')
const p2 = await ask('Password 2 (min 12 chars, different): ')
if (p1.length < 12 || p2.length < 12) { console.error('Both passwords need at least 12 characters.'); process.exit(1) }
if (p1 === p2) { console.error('Password 1 and 2 must be different.'); process.exit(1) }
console.log('\nPaste into Apps Script → Project Settings → Script properties:\n')
console.log('ADMIN_HASH_1=' + hash(p1, 1))
console.log('ADMIN_HASH_2=' + hash(p2, 2))
