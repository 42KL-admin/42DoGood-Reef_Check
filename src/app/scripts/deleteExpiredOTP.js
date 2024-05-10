import cron from 'node-cron';
import AdminOTPVerification from './models/AdminOTPVerification';

// Schedule a task to run every week
cron.schedule('0 0 * * 0', async () => {
  const now = new Date();
  try {
    // Delete all OTPs where expiresAt is less than the current time
    await AdminOTPVerification.deleteMany({ expiresAt: { $lt: now } });
    //console.log('Expired OTPs deleted');
  } catch (err) {
    console.error('Error deleting expired OTPs:', err);
  }
});