import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import logger from '../middlewares/logger.middleware';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: true,
    },
  },
  logging: process.env.NODE_ENV === 'development' ? (msg) => logger.info(msg) : false,
});

export const testConnection = async () => {
  try {
    await sequelize.sync({});
    logger.info('Database is connected');
  } catch (error) {
    logger.error('Unable to connect to database:', error);
    throw error;
  }
};

export default sequelize;
