import { Request, Response } from 'express';
import inventoryService from '../services/inventory.service';
import { InventorySchema, InventoryDTO, SellSchema, SellDTO } from '../validators/inventory.validator';
import winstonLogger from '../middlewares/logger.middleware';
import { getErrorMessage } from '../middlewares/error.middleware';
import { ZodError } from 'zod';
import { HttpError } from 'http-errors';

const addInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { item } = req.params;
    const { quantity, expiry } = req.body;

    InventorySchema.parse({ itemName: item, quantity, expiry } as InventoryDTO);

    await inventoryService.addInventory(item, quantity, expiry);
    res.status(200).json({});
  } catch (error) {
    winstonLogger.error('Error adding inventory:', error);
    res.status(500).json(getErrorMessage(error as Error | ZodError | HttpError));
  }
};

const getQuantity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { item } = req.params;
    const itemQuantity = await inventoryService.getItemQuantity(item);
    res.status(200).json(itemQuantity);
  } catch (error) {
    winstonLogger.error('Error getting item quantity:', error);
    res.status(500).json(getErrorMessage(error as Error | ZodError | HttpError));
  }
};

const sellItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { item } = req.params;
    const { quantity } = req.body;

    SellSchema.parse({ itemName: item, quantity } as SellDTO);

    await inventoryService.sellItem(item, quantity);
    res.status(200).json({});
  } catch (error) {
    winstonLogger.error('Error selling item:', error);
    res.status(500).json(getErrorMessage(error as Error | ZodError | HttpError));
  }
};

export default {
  addInventory,
  getQuantity,
  sellItem,
};
