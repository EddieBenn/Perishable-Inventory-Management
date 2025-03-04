import { Op, Transaction } from 'sequelize';
import { Inventory } from '../models/inventory.model';
import { sequelize } from '../config/database';
import createHttpError from 'http-errors';

const addInventory = async (itemName: string, quantity: number, expiry: number): Promise<void> => {
  await Inventory.create({
    itemName,
    quantity,
    expiry,
  });
};

const getItemQuantity = async (itemName: string): Promise<{ quantity: number; validTill: number | null }> => {
  const currentTime = Date.now();

  const lots = await Inventory.findAll({
    where: {
      itemName,
      expiry: { [Op.gt]: currentTime },
      quantity: { [Op.gt]: 0 },
    },
    order: [['expiry', 'ASC']],
  });

  if (lots.length === 0) {
    return { quantity: 0, validTill: null };
  }

  const totalQuantity = lots.reduce((sum, lot) => sum + lot.quantity, 0);

  const validTill = lots[0].expiry;

  return { quantity: totalQuantity, validTill };
};

const sellItem = async (itemName: string, quantityToSell: number): Promise<void> => {
  const transaction = await sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  });

  try {
    const currentTime = Date.now();

    const lots = await Inventory.findAll({
      where: {
        itemName,
        expiry: { [Op.gt]: currentTime },
        quantity: { [Op.gt]: 0 },
      },
      order: [['expiry', 'ASC']],
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    const totalAvailable = lots.reduce((sum, lot) => sum + lot.quantity, 0);

    if (totalAvailable < quantityToSell) {
      throw createHttpError(400, `Not enough inventory. Requested: ${quantityToSell}, Available: ${totalAvailable}`);
    }

    let remainingToSell = quantityToSell;

    for (const lot of lots) {
      if (remainingToSell <= 0) break;

      const sellFromLot = Math.min(lot.quantity, remainingToSell);
      lot.quantity -= sellFromLot;
      remainingToSell -= sellFromLot;

      await lot.save({ transaction });
    }

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const removeExpiredInventory = async (): Promise<number> => {
  const currentTime = Date.now();

  const [affectedCount] = await Inventory.update(
    { quantity: 0 },
    {
      where: {
        expiry: { [Op.lte]: currentTime },
        quantity: { [Op.gt]: 0 },
      },
    },
  );

  return affectedCount;
};

export default {
  addInventory,
  getItemQuantity,
  sellItem,
  removeExpiredInventory,
};
