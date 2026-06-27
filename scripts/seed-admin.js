/**
 * Seed the admin (owner) account.
 * Run: node scripts/seed-admin.js
 * Creates: email=silentoracle33@gmail.com, name=admin, PIN=1295
 * Admin bypasses all rate limits + has all Pro features unlocked.
 */
const { PrismaClient } = require('/home/z/my-project/node_modules/@prisma/client');
const crypto = require('node:crypto');

const prisma = new PrismaClient();
const AUTH_SECRET = process.env.AUTH_SECRET || 'dev-only-secret-change-me';

async function main() {
  const email = 'silentoracle33@gmail.com';
  const name = 'admin';
  const pin = '1295';
  const pinHash = crypto.createHmac('sha256', AUTH_SECRET).update(pin).digest('hex');

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await prisma.user.update({ where: { email }, data: { isAdmin: true, isSubscribed: true, name, pinHash } });
    console.log('✓ Admin account updated:', email);
  } else {
    await prisma.user.create({ data: { email, name, pinHash, isAdmin: true, isSubscribed: true, birthdate: '1992-12-18' } });
    console.log('✓ Admin account created:', email);
  }
  console.log('  Name:', name, '| PIN:', pin, '| isAdmin: true | isSubscribed: true');
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
