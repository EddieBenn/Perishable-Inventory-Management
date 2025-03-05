import cron from 'node-cron';
import inventoryService from '../services/inventory.service';
import winstonLogger from '../middlewares/logger.middleware';

const scheduleCronJobs = () => {
  cron.schedule('0 8,16,0 * * *', async () => {
    try {
      const removedCount = await inventoryService.removeExpiredInventory();
      winstonLogger.info(`Cron Job: Removed ${removedCount} expired inventory items.`);
    } catch (error) {
      winstonLogger.error('Cron Job: Failed to remove expired inventory items:', error);
    }
  });
};

export default scheduleCronJobs;