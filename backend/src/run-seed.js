import 'dotenv/config';
import mongoose from 'mongoose';
import { seedDatabase } from './seed.js';

try {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing from backend/.env');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(`[Waymate] MongoDB connected for seeding: ${mongoose.connection.host}/${mongoose.connection.name}`);
  await seedDatabase();
  console.log('[Waymate] Demo data seed completed successfully. Existing records were preserved.');
} catch (error) {
  console.error('[Waymate] Seed failed:', error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
